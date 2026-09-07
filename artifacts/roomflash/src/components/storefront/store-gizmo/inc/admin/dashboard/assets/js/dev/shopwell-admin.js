//--------------------------------------------------------------------//
// Shopwell script that handles our admin functionality.
//--------------------------------------------------------------------//

; (function ($) {

	'use strict';

	/**
	 * Holds most important methods that bootstrap the whole admin area.
	 *
	 * @type {Object}
	 */
	var ShopwellAdmin = {

		/**
		 * Start the engine.
		 *
		 * @since 1.0.0
		 */
		init: function () {

			// Document ready
			$(document).ready(ShopwellAdmin.ready);

			// Window load
			$(window).on('load', ShopwellAdmin.load);

			// Bind UI actions
			ShopwellAdmin.bindUIActions();

			// Trigger event when Shopwell fully loaded
			$(document).trigger('shopwellReady');
		},

		//--------------------------------------------------------------------//
		// Events
		//--------------------------------------------------------------------//

		/**
		 * Document ready.
		 *
		 * @since 1.0.0
		 */
		ready: function () {
		},


		/**
		 * Window load.
		 *
		 * @since 1.0.0
		 */
		load: function () {

			// Trigger resize once everything loaded.
			window.dispatchEvent(new Event('resize'));
		},


		/**
		 * Window resize.
		 *
		 * @since 1.0.0
		*/
		resize: function () {
		},


		//--------------------------------------------------------------------//
		// Functions
		//--------------------------------------------------------------------//


		/**
		 * Bind UI actions.
		 *
		 * @since 1.0.0
		*/
		bindUIActions: function () {
			var $wrap = $('#wpwrap');
			var $body = $('body');
			var $this;

			$wrap.on('click', '.plugins .hester-btn:not(.active)', function (e) {

				e.preventDefault();

				if ($wrap.find('.plugins .hester-btn.in-progress').length) {
					return;
				}

				// Don't let an individual plugin action collide with a bulk one already running.
				if ($body.find('.shopwell-bulk-plugins-action.in-progress').length) {
					return;
				}

				$this = $(this);

				ShopwellAdmin.pluginAction($this);
			});

			$(document).on('wp-plugin-install-success', ShopwellAdmin.pluginInstallSuccess);
			$(document).on('wp-plugin-install-error', ShopwellAdmin.pluginInstallError);

			$body.on('click', '.shopwell-bulk-plugins-action', function (e) {

				var $btn = $(this);

				if ($btn.hasClass('in-progress')) {
					e.preventDefault();
					return;
				}

				// Once fully done the button becomes a plain link (Demo Library) - let it navigate normally.
				if (!$btn.data('shopwellBulkAction')) {
					return;
				}

				e.preventDefault();

				// Don't let a bulk action collide with an individual plugin action already running.
				if ($wrap.find('.plugins .hester-btn.in-progress').length) {
					return;
				}

				ShopwellAdmin.bulkPluginAction($btn, e);
			});
		},

		pluginAction: function ($button) {

			$button.addClass('in-progress').attr('disabled', 'disabled').html(hester_strings.texts[$button.data('action') + '-inprogress']);

			if ('install' === $button.data('action')) {

				if (wp.updates.shouldRequestFilesystemCredentials && !wp.updates.ajaxLocked) {
					wp.updates.requestFilesystemCredentials(event);

					$(document).one('credential-modal-cancel', function () {

						$button.removeAttr('disabled').removeClass('in-progress').html(hester_strings.texts.install);

						wp.a11y.speak(wp.updates.l10n.updateCancel, 'polite');
					});
				}

				wp.updates.installPlugin({
					slug: $button.data('plugin')
				});

			} else {

				var data = {
					_ajax_nonce: hester_strings.wpnonce, // eslint-disable-line camelcase
					plugin: $button.data('plugin'),
					action: 'hester-plugin-' + $button.data('action')
				};

				$.post(hester_strings.ajaxurl, data, function (response) {
					if (response.success) {
						if ($button.data('redirect')) {
							window.location.href = $button.data('redirect');
						} else {
							location.reload();
						}
					} else {
						$('.plugins .hester-btn.in-progress').removeAttr('disabled').removeClass('in-progress primary').addClass('secondary').html(hester_strings.texts.retry);
					}
				});
			}
		},

		pluginInstallSuccess: function (event, response) {

			event.preventDefault();

			var $message = jQuery(event.target);
			var $init = $message.data('init');
			var activatedSlug;

			if ('undefined' === typeof $init) {
				activatedSlug = response.slug;
			} else {
				activatedSlug = $init;
			}

			var $button = $('.plugins a[data-plugin="' + activatedSlug + '"]');

			$button.data('action', 'activate');

			ShopwellAdmin.pluginAction($button);
		},

		pluginInstallError: function (event, response) {

			event.preventDefault();

			var $message = jQuery(event.target);
			var $init = $message.data('init');
			var activatedSlug;

			if ('undefined' === typeof $init) {
				activatedSlug = response.slug;
			} else {
				activatedSlug = $init;
			}

			var $button = $('.plugins a[data-plugin="' + activatedSlug + '"]');

			$button.attr('disabled', 'disabled').removeClass('in-progress primary').addClass('secondary').html(wp.updates.l10n.installFailedShort);
		},

		/**
		 * Coerce a data-* attribute value (already auto-parsed by jQuery when it
		 * looks like JSON, but falls back to a raw string on some browsers) into
		 * a plain array we can safely mutate.
		 *
		 * @since 1.0.17
		 */
		toArray: function (value) {

			if ($.isArray(value)) {
				return value.slice();
			}

			if ('string' === typeof value && value) {
				try {
					return JSON.parse(value);
				} catch (e) {
					return [];
				}
			}

			return [];
		},

		/**
		 * Install & activate (or just activate) a batch of recommended plugins
		 * from the admin notice, one plugin at a time so a single slow/failed
		 * plugin never blocks the rest and the request never risks a PHP timeout.
		 *
		 * @since 1.0.17
		 */
		bulkPluginAction: function ($btn, e) {

			var installList = ShopwellAdmin.toArray($btn.data('shopwellInstallList'));
			var activateList = ShopwellAdmin.toArray($btn.data('shopwellActivateList'));
			var pluginNames = $btn.data('shopwellPluginNames') || {};
			var installTotal = installList.length;
			var $dismiss = $btn.closest('.notice').find('.notice-dismiss');
			var $text = $btn.find('.shopwell-notice-action-text');
			var $spinner = $btn.find('.shopwell-notice-spinner');
			// Present on the Recommended Plugins page (empty set elsewhere, e.g. the notice) -
			// dims the individual plugin cards so a click during a bulk run doesn't look ignored.
			var $pluginsGrid = $('.hester-columns.plugins');
			var aborted = false;
			var hadFailure = false;
			var failedInstallNames = [];
			var failedInstallSlugs = [];
			var failedActivateNames = [];

			if (!installTotal && !activateList.length) {
				return;
			}

			$btn.addClass('in-progress').attr('aria-busy', 'true');
			$dismiss.css({ opacity: 0.4, 'pointer-events': 'none' });
			$spinner.addClass('is-active');
			$text.text(hester_strings.texts.preparing);
			$pluginsGrid.addClass('shopwell-bulk-running');
			bindUnloadWarning();

			$(document).one('credential-modal-cancel', function () {
				aborted = true;
				resetButton(hester_strings.texts.retry);
			});

			function resetButton(label) {
				unbindUnloadWarning();
				$spinner.removeClass('is-active');
				$btn.removeClass('in-progress').removeAttr('aria-busy');
				$dismiss.css({ opacity: '', 'pointer-events': '' });
				$pluginsGrid.removeClass('shopwell-bulk-running');
				$text.text(label);
			}

			// Warn if the admin tries to leave mid-run - the activate step is a single
			// AJAX request looping server-side, so navigating away can cut it short.
			function bindUnloadWarning() {
				$(window).on('beforeunload.shopwellBulk', function () {
					return hester_strings.texts.bulk_unload_warning;
				});
			}

			function unbindUnloadWarning() {
				$(window).off('beforeunload.shopwellBulk');
			}

			// Append the same "activate-multi" flag WordPress core uses for its own
			// bulk-activate on plugins.php - many plugins (Elementor, WooCommerce, etc.)
			// explicitly skip their onboarding/getting-started redirect when it's present.
			function reloadPage() {
				var url = window.location.href;
				var hashIndex = url.indexOf('#');
				var hash = -1 === hashIndex ? '' : url.slice(hashIndex);
				var base = -1 === hashIndex ? url : url.slice(0, hashIndex);

				if (-1 === base.indexOf('activate-multi=')) {
					base += (-1 === base.indexOf('?') ? '?' : '&') + 'activate-multi=true';
				}

				// Carry failed installs across the reload so we can point the admin
				// to a manual upload as a fallback - a slow/blocked connection to
				// WordPress.org won't succeed just by clicking "Install Now" again.
				if (failedInstallSlugs.length) {
					base += '&shopwell_install_failed=' + encodeURIComponent(failedInstallSlugs.join(','));
				}

				window.location.href = base + hash;
			}

			function runInstalls(slugs, index, next) {

				if (aborted) {
					return;
				}

				if (!slugs.length) {
					next();
					return;
				}

				var slug = slugs.shift();
				var label = hester_strings.texts.installing_plugins;

				// Only show a "(x/N)" counter when there's actually more than one step to count.
				if (installTotal > 1) {
					label += ' (' + index + '/' + installTotal + ')';
				}

				$text.text(label);

				installOne(slug, false);

				// A failed download is often a transient network blip - one immediate
				// retry clears most of those without bothering the admin a second time.
				function installOne(currentSlug, isRetry) {

					wp.updates.installPlugin({
						slug: currentSlug,
						success: function () {
							activateList.push(currentSlug);
							runInstalls(slugs, index + 1, next);
						},
						error: function () {

							if (!isRetry) {
								installOne(currentSlug, true);
								return;
							}

							hadFailure = true;
							failedInstallNames.push(pluginNames[currentSlug] || currentSlug);
							failedInstallSlugs.push(currentSlug);
							runInstalls(slugs, index + 1, next);
						}
					});
				}
			}

			function runActivate() {

				if (aborted) {
					return;
				}

				if (!activateList.length) {
					finish(!hadFailure);
					return;
				}

				$text.text(hester_strings.texts.activating_plugins);

				$.post(hester_strings.ajaxurl, {
					_ajax_nonce: hester_strings.wpnonce, // eslint-disable-line camelcase
					action: 'shopwell-plugins-bulk-activate',
					plugins: activateList
				}).done(function (response) {

					if (response && response.data && response.data.failed) {
						failedActivateNames = failedActivateNames.concat(response.data.failed);
					}

					finish(!hadFailure && response && response.success);
				}).fail(function () {
					finish(false);
				});
			}

			function finish(success) {

				if (aborted) {
					return;
				}

				// Unbind before our own reload navigates away, or the browser would
				// prompt the admin to confirm leaving the page we're about to reload.
				unbindUnloadWarning();

				$spinner.removeClass('is-active');
				$btn.removeAttr('aria-busy');
				$text.text(success ? hester_strings.texts.bulk_done : failureMessage());

				// Reload either way - the notice recalculates from real plugin state, so a
				// partial failure simply comes back as "Install Now"/"Activate Now" for
				// whatever is still pending, ready for the user to retry with fresh data.
				setTimeout(reloadPage, success ? 500 : 1200);
			}

			function truncatedList(names) {
				var shown = names.slice(0, 2).join(', ');

				if (names.length > 2) {
					shown += hester_strings.texts.bulk_failed_more.replace('%d', names.length - 2);
				}

				return shown;
			}

			function failureMessage() {

				var parts = [];

				if (failedInstallNames.length) {
					parts.push(hester_strings.texts.bulk_failed_install_prefix + truncatedList(failedInstallNames));
				}

				if (failedActivateNames.length) {
					parts.push(hester_strings.texts.bulk_failed_activate_prefix + truncatedList(failedActivateNames));
				}

				if (!parts.length) {
					return hester_strings.texts.bulk_failed_generic;
				}

				return parts.join('. ') + '.';
			}

			if (wp.updates.shouldRequestFilesystemCredentials && !wp.updates.ajaxLocked) {
				wp.updates.requestFilesystemCredentials(e);
			}

			runInstalls(installList, 1, runActivate);
		}

	}; // END var ShopwellAdmin

	ShopwellAdmin.init();
	window.shopwelladmin = ShopwellAdmin;

}(jQuery));
