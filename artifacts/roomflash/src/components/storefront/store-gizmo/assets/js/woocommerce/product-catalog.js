(function ($) {
    'use strict';

    var shopwell = shopwell || {};
    shopwell.init = function () {
        shopwell.$body = $(document.body),
            shopwell.$window = $(window),
            shopwell.$header = $('#site-header');

        // Catalog
        this.topCategories();
        this.catalogView();
        this.catalogToolbar();
        this.productsFilterActivated();
        this.loadMoreProducts();

		this.changeCatalogElementsFiltered();
		this.catalogToolBar();
		this.catalogOrderBy();
		this.scrollFilterSidebar();


		this.stickySidebar();
    };

    // Top Categories
    shopwell.topCategories = function () {
		if (typeof Swiper === 'undefined') {
			return;
		}

		if( shopwellData.top_categories_layout !== '1' ) {
			return;
		}

		var $container = $( '.catalog-top-categories .catalog-top-categories__wrapper' );

		$container.addClass( 'swiper-container' ).wrapInner( '<div class="swiper-wrapper"></div>' );
		$container.append( '<div class="swiper-pagination"></div>' );
		$container.find( '.catalog-top-categories__item' ).addClass( 'swiper-slide' );
		$container.after('<span class="shopwell-svg-icon shopwell-swiper-button-prev shopwell-swiper-button swiper-button"><svg viewBox="0 0 19 32"><path d="M13.552 0.72l2.656 1.76-9.008 13.52 9.008 13.52-2.656 1.76-10.192-15.28z"></path></svg></span>');
        $container.after('<span class="shopwell-svg-icon shopwell-swiper-button-next shopwell-swiper-button swiper-button"><svg viewBox="0 0 19 32"><path d="M5.648 31.28l-2.656-1.76 9.008-13.52-9.008-13.52 2.656-1.76 10.192 15.28z"></path></svg></span>');

		var $container,
			options = {
				observer: true,
    			observeParents: true,
				slidesPerView: "auto",
				spaceBetween: 0,
				navigation: {
					nextEl: '.shopwell-swiper-button-next',
					prevEl: '.shopwell-swiper-button-prev',
				},
				pagination: {
					el: $container.find( '.swiper-pagination' ).get(0),
					clickable: true,
				},
			};

		new Swiper( $container.get(0), options );

		shopwell.$window.resize( function () {
			$container.find( '.swiper-pagination .swiper-pagination-bullet' ).first().trigger( 'click' );
		}).trigger( 'resize' );

		if( $container.find( '.active' ).length == 0 ) {
			$container.find( '.catalog-top-categories__item' ).first().addClass( 'active' );
		}
	};

    // Catalog View
    shopwell.catalogView = function () {
        $('#shopwell-toolbar-view').on('click', 'a', function (e) {
            e.preventDefault();
            var $el = $(this),
                view = $el.data('view');

            if ($el.hasClass( 'current' )) {
                return;
            }

            $el.addClass( 'current' ).siblings().removeClass( 'current' );

			if( ! $el.hasClass( 'list' ) ) {
				$el.closest( '.site-main' ).find( '.product-actions' ).addClass( 'hidden' );
			}

            shopwell.$body.removeClass('catalog-view-grid-2 catalog-view-grid-3 catalog-view-grid-4 catalog-view-default catalog-view-grid-5 catalog-view-list').addClass('catalog-view-' + view);

            shopwell.catalogViewSwich();

			if( ! $el.hasClass( 'list' ) ) {
				setTimeout( function() {
					$el.closest( '.site-main' ).find( '.product-actions' ).removeClass( 'hidden' );
				}, 100 );
			}

            document.cookie = 'catalog_view=' + view + ';domain=' + window.location.host + ';path=/';
        });

        shopwell.catalogViewSwich();
    }

    shopwell.catalogViewSwich = function () {
        if ( shopwell.$body.hasClass( 'catalog-view-grid-2' ) ) {
            shopwell.$body.find( 'ul.products' ).removeClass( 'columns-1 columns-3 columns-4 columns-5').addClass( 'columns-2'  );
		} else if ( shopwell.$body.hasClass( 'catalog-view-grid-3' ) ) {
            shopwell.$body.find( 'ul.products' ).removeClass( 'columns-1 columns-2 columns-4 columns-5').addClass( 'columns-3' );
        } else if( shopwell.$body.hasClass( 'catalog-view-default' ) || shopwell.$body.hasClass( 'catalog-view-grid-4' ) ) {
            shopwell.$body.find( 'ul.products' ).removeClass( 'columns-1 columns-2 columns-3 columns-5' ).addClass( 'columns-4' );
        } else if( shopwell.$body.hasClass( 'catalog-view-grid-5' ) ) {
            shopwell.$body.find( 'ul.products' ).removeClass( 'columns-1 columns-2 columns-3 columns-4' ).addClass( 'columns-5' );
        } else if( shopwell.$body.hasClass( 'catalog-view-list' ) ) {
            shopwell.$body.find( 'ul.products' ).removeClass( 'columns-2 columns-3 columns-4 columns-5' ).addClass( 'columns-1' );
        }
    }

	shopwell.catalogToolbar = function() {
		if( shopwellData.catalog_toolbar_layout !== '2' ) {
			return;
		}

		var $tools = $( '.catalog-toolbar--top' );

		// Products ordering.
		if ( $.fn.select2 ) {
			$tools.find( '.woocommerce-ordering select' ).select2( {
				width                  : 'auto',
				minimumResultsForSearch: -1,
				selectionCssClass      : 'shopwell-input--default',
				dropdownCssClass	   : 'product-order',
				dropdownParent         : $tools.find( '.woocommerce-ordering' )
			} );
		}
	}

	shopwell.productsFilterActivated = function () {
        var $primaryFilter = $( '.catalog-toolbar__filters-actived' ),
			$panelFilter = $( '.filter-sidebar-panel' ),
            $widgetFilter = $panelFilter.find( '.products-filter__activated-items' ),
			$removeAll = '<a href="#" class="remove-filtered-all shopwell-button shopwell-button--subtle">Clear All</a>';

        	if( $.trim( $widgetFilter.html() ) ) {
				$primaryFilter.html('');
				$primaryFilter.removeClass( 'active' );
				$primaryFilter.prepend( $widgetFilter.html() + $removeAll );
				$primaryFilter.addClass( 'active' );
			}

        shopwell.$body.on( 'shopwell_products_filter_widget_updated', function (e, form) {
            var $panel = $(form).closest('.filter-sidebar-panel'),
				$widgetNewFilter = $panel.find('.products-filter__activated-items');

				if( $.trim( $widgetNewFilter.html() ) ) {
					$primaryFilter.removeClass('hidden');
					$primaryFilter.html('');
					$primaryFilter.removeClass( 'active' );
					$primaryFilter.prepend( $widgetNewFilter.html() + $removeAll );
					$primaryFilter.addClass( 'active' );
				}
        });

        $primaryFilter.on( 'click', '.remove-filtered', function (e) {
            var value = $(this).data( 'value' ),
				$widgetNewsFilter = $panelFilter.find('.products-filter__activated-items');

            if ( value !== 'undefined' ) {
                $(this).remove();
                $panelFilter.find( ".remove-filtered[data-value='" + value + "']" ).trigger( 'click' );
            }

			if( ! $.trim( $widgetNewsFilter.html() ) ) {
				$primaryFilter.html('');
				$primaryFilter.removeClass( 'active' );
			}

            return false;
        });

		$primaryFilter.on( 'click', '.remove-filtered-all', function (e) {
			e.preventDefault();
			$primaryFilter.html('');
			$primaryFilter.removeClass( 'active' );
			$panelFilter.find( '.products-filter__button .reset-button' ).trigger( 'click' );
		});
    };

    /**
	 * Ajax load more products.
	 */
	shopwell.loadMoreProducts = function() {
		// Infinite scroll.
		if ( $( '.woocommerce-navigation' ).hasClass( 'ajax-infinite' ) ) {
			var waiting = false,
				endScrollHandle;

			$( window ).on( 'scroll', function() {
				if ( waiting ) {
					return;
				}

				waiting = true;

				clearTimeout( endScrollHandle );

				infiniteScoll();

				setTimeout( function() {
					waiting = false;
				}, 100 );

				endScrollHandle = setTimeout( function() {
					waiting = false;
					infiniteScoll();
				}, 200 );
			});

		}

		function infiniteScoll() {
			var $navigation = $( '.woocommerce-navigation.ajax-navigation' ),
				$button = $( 'a', $navigation );

			if ( shopwell.isVisible( $navigation ) && $button.length && !$navigation.hasClass( 'loading' ) ) {
                $navigation.addClass( 'loading' );

				loadProducts( $button, function( respond ) {
					$button = $navigation.find( 'a' );
				});
			}
		}

		//Load More
		if ( $( '.woocommerce-navigation' ).hasClass( 'ajax-loadmore' ) ) {
			shopwell.$body.on( 'click', '.woocommerce-navigation.ajax-loadmore a', function (event) {
				event.preventDefault();
				loadMore();

			});
		}

		function loadMore() {
			var $navigation = $( '.woocommerce-navigation.ajax-navigation' ),
				$button = $( 'a', $navigation );

			if ( shopwell.isVisible( $navigation ) && $button.length && !$navigation.hasClass( 'loading' ) ) {
                $navigation.addClass( 'loading' );

				loadProducts( $button, function( respond ) {
					$button = $navigation.find( 'a' );
				});
			}
		}

		/**
		 * Ajax load products.
		 *
		 * @param jQuery $el Button element.
		 * @param function callback The callback function.
		 */
		function loadProducts( $el, callback ) {
			var $nav = $el.closest( '.woocommerce-navigation' ),
				totalProduct = $nav.closest('#main').children().find('.product').length,
				url = $el.attr( 'href' );

			$.get( url, function( response ) {
				var $content = $( '#main', response ),
					$list = $( 'ul.products', $content ),
					numberPosts = $list.find( '.product' ).length + totalProduct,
					$products = $list.children(),
					$found = $('.shopwell-posts-found'),
					$newNav = $( '.woocommerce-navigation.ajax-navigation', $content );

				if (shopwell.$window.width() > 768) {
					$products.each( function( index, product ) {
						$( product ).css( 'animation-delay', index * 100 + 'ms' );
					} );
					$products.addClass( 'animated shopwellFadeInUp' );
				}

				$products.appendTo( $nav.parent().find( 'ul.products' ) );

				if ( $newNav.length ) {
					$el.replaceWith( $( 'a', $newNav ) );
				} else {
					$nav.fadeOut( function() {
						$nav.remove();
					} );
				}

				if ( 'function' === typeof callback ) {
					callback( response );
				}

				shopwell.$body.trigger( 'shopwell_products_loaded', [$products, true] );

				$found.find('.current-post').html(' ' + numberPosts);

				shopwell.postsFound();

				$nav.removeClass( 'loading' );

				if ( shopwellData.shop_nav_ajax_url_change ) {
					window.history.pushState( null, '', url );
				}
			});
		}
	};

    /**
	 * Check if an element is in view-port or not
	 *
	 * @param jQuery el Targe element to check.
	 * @return boolean
	 */
	shopwell.isVisible = function( el ) {
		if ( el instanceof jQuery ) {
			el = el[0];
		}

		if ( ! el ) {
			return false;
		}

		var rect = el.getBoundingClientRect();

		return rect.bottom > 0 &&
			rect.right > 0 &&
			rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
			rect.top < (window.innerHeight || document.documentElement.clientHeight);
	};

	shopwell.changeCatalogElementsFiltered = function () {
        shopwell.$body.on( 'shopwell_products_filter_request_success', function (e, response ) {
            var $html            = $(response),
                $products_header = shopwell.$body.find( '.page-header--products' ),
				$top_category    = shopwell.$body.find( '.catalog-top-categories' ),
                $toolbar         = shopwell.$body.find( '.catalog-toolbar' ),
                $posts_found     = shopwell.$body.find( '.shopwell-posts-found' ),
                $navigation      = shopwell.$body.find( '.woocommerce-navigation' );

            if ( $html.find( '.page-header--products' ) ) {
                if ( $products_header.length ) {
					$products_header.replaceWith( $html.find( '.page-header--products' ) );
                } else {
                    shopwell.$body.find('.site-content-container').before( $html.find( '.page-header--products' ) );
                }
            } else {
                shopwell.$body.find( '.page-header--products' ).remove();
            }

			if ( $html.find( '.catalog-top-categories' ).length ) {
                $top_category.replaceWith($html.find( '.catalog-top-categories' ));

				if( $top_category.hasClass( 'catalog-top-categories__layout-v1' ) ) {
                	shopwell.topCategories();
				}
            }

			if ( $html.find( '.catalog-toolbar' ).length ) {
                $toolbar.find( '.shopwell-result-count' ).replaceWith( $html.find( '.shopwell-result-count' ) );
            }

            if ( $navigation.length ) {
                $navigation.replaceWith( $html.find( '.woocommerce-navigation' ) );
            } else {
                shopwell.$body.find( '.site-main' ).append( $html.find( '.woocommerce-navigation' ) );
            }

			if ( $html.find( '.shopwell-posts-found' ).length ) {
                $posts_found.replaceWith( $html.find( '.shopwell-posts-found' ) );
                shopwell.postsFound();
            } else {
				$posts_found.hide();
			}
        });
	};

	shopwell.postsFound = function () {
		var $found = $( '.shopwell-posts-found__inner' ),
			$foundEls = $found.find( '.count-bar' ),
			$current = $found.find( '.current-post' ).html(),
			$total = $found.find( '.found-post' ).html(),
			pecent = ($current / $total) * 100;

		$foundEls.css( 'width', pecent + '%' );
	};

	shopwell.catalogToolBar = function () {
        var $selector = $('#mobile-filter-sidebar-panel');

        if ($selector.length < 1) {
            return;
        }

        shopwell.$window.on('resize', function () {
            if (shopwell.$window.width() > 991) {
                if ($selector.hasClass('offscreen-panel')) {
                    $selector.removeClass('offscreen-panel offscreen-panel--side-left').removeAttr('style');
                }
            } else {
                $selector.addClass('offscreen-panel offscreen-panel--side-left');
            }

        }).trigger('resize');

		// Add count filter activated
		var item = $selector.find('.products-filter__activated-items > a').length;

		if ( item > 0 ) {
			$('.mobile-catalog-toolbar__filter-button').append('<span class="count">(' + item + ')</span>');
		}

    };

	shopwell.catalogOrderBy = function () {
		var $selector = $('#mobile-orderby-modal'),
			$orderForm = $('.catalog-toolbar__toolbar .woocommerce-ordering, .catalog-toolbar--top .woocommerce-ordering');

		$selector.find('.mobile-orderby-list').on('click', 'a', function (e) {
            e.preventDefault();

			var value = $(this).data('id'),
				title = $(this).data('title');

			// Click selectd item popup order list
			$selector.find('.mobile-orderby-list .selected').removeClass('selected');
			$(this).addClass( 'selected' );

			// Change text button sort by
			$('.mobile-catalog-toolbar__sort-button .name').html(title);

			// Select content form order
			$orderForm.find('option:selected').attr("selected", false);
			$orderForm.find('option[value='+ value +']').attr("selected", "selected");

			$orderForm.trigger( 'submit' );
        });

		// Active Item
		var activeName = $orderForm.find('option:selected').text(),
			activeVal = $orderForm.find('option:selected').val();

		$('.mobile-catalog-toolbar__sort-button .name').html(activeName);
		$selector.find('.mobile-orderby-list a[data-id='+ activeVal +']').addClass('selected');

    };

	shopwell.scrollFilterSidebar = function () {
        shopwell.$body.on('shopwell_products_filter_before_send_request', function () {
            if( ! $(".woocommerce-shop .content-area").length ) {
                return;
            }

			var $height = 0;

			shopwell.$window.on( 'resize', function () {
				if ( shopwell.$window.width() < 991 ) {
					$( '#mobile-filter-sidebar-panel' ).removeClass( 'offscreen-panel--open' ).fadeOut();
				} else {
					var $sticky 	= $( document.body ).hasClass('shopwell-header-sticky') ? $( '#site-header .header-sticky' ).outerHeight() : 0,
						$wpadminbar = $('#wpadminbar').is(":visible") ? $('#wpadminbar').height() : 0;

						$height 	= $sticky + $wpadminbar;
				}
			}).trigger( 'resize' );

			$( document.body ).removeAttr('style');
			$( document.body ).removeClass( 'offcanvas-opened' );

            $('html,body').stop().animate({
                    scrollTop: $(".woocommerce-shop .content-area").offset().top - $height
                },
                'slow');
        });
    };

	shopwell.stickySidebar = function() {
        if( ! $.fn.stick_in_parent ) {
            return;
        }

        var offset_top = 0;

        if( shopwell.$body.hasClass('admin-bar') ) {
            offset_top += 32;
        }

        if( shopwell.$header.find('.site-header__section').hasClass('shopwell-header-sticky') ) {
            offset_top +=shopwell.$header.find('.header-sticky').height();
        }

        shopwell.$window.on('resize', function () {
            if (shopwell.$window.width() < 992) {
                $( '#mobile-filter-sidebar-panel' ).trigger("sticky_kit:detach");
            } else {
                $( '#mobile-filter-sidebar-panel' ).stick_in_parent({
                    offset_top: offset_top,
					inner_scrolling: false
                });
            }
        }).trigger('resize');
    }

    /**
     * Document ready
     */
    $(function () {
        shopwell.init();
    });

})(jQuery);