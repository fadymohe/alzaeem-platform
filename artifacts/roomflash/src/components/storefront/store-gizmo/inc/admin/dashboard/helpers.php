<?php
/**
 * Contains various functions that may be potentially used throughout
 * the theme.
 *
 * @package     Shopwell
 * @author      Peregrine Themes
 * @since       1.0.0
 */

/**
 * Do not allow direct script access.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if we're on a Shopwell admin page.
 *
 * @since 1.0.0
 * @param boolean|string $base current screen base.
 * @param string         $slug page slug.
 * @return boolean
 */
function shopwell_is_admin_page( $base = false, $slug = 'shopwell' ) {

	if ( false === $base ) {
		$base = get_current_screen()->base;
	}

	return false !== strpos( $base, $slug );
}

/**
 * Print admin notice.
 *
 * @since 1.0.0
 * @param array $args array of options.
 * @return boolean|void
 */
function shopwell_print_notice( $args ) {

	$defaults = array(
		'type'           => 'success',
		'title'          => '',
		'message'        => '',
		'is_dismissible' => true,
		'message_id'     => '',
		'expires'        => 0,
		'display_on'     => array(),
		'action_link'    => '',
		'action_text'    => '',
		'action_class'   => '',
		'action_data'    => array(),
	);

	$args = wp_parse_args( $args, $defaults );

	if ( shopwell_is_notice_dismissed( $args['message_id'] ) ) {
		return false;
	}

	if ( ! empty( $args['display_on'] ) ) {

		$base    = get_current_screen()->base;
		$display = false;

		foreach ( $args['display_on'] as $page ) {
			if ( false !== strpos( $base, $page ) ) {
				$display = true;
			}
		}

		if ( ! $display ) {
			return false;
		}
	}

	$shopwell_is_dismissible = $args['is_dismissible'] ? ' is-dismissible' : '';
	$has_action              = $args['action_link'] && $args['action_text'];
	?>

	<div id="<?php echo esc_attr( $args['message_id'] ); ?>" class="notice shopwell-notice shopwell-notice-card notice-<?php echo esc_attr( $args['type'] ); ?><?php echo esc_attr( $shopwell_is_dismissible ); ?>">

		<?php if ( $args['title'] ) : ?>
			<h3 class="shopwell-notice-title"><?php echo esc_html( $args['title'] ); ?></h3>
		<?php endif; ?>

		<p class="shopwell-notice-message"><?php echo ( wp_kses_post( $args['message'] ) ); ?></p>

		<?php if ( $has_action ) : ?>

			<?php
			$action_class = trim( 'shopwell-notice-btn ' . $args['action_class'] );
			$action_attrs = '';

			if ( ! empty( $args['action_data'] ) && is_array( $args['action_data'] ) ) {
				foreach ( $args['action_data'] as $data_key => $data_value ) {
					$action_attrs .= ' data-' . esc_attr( $data_key ) . '="' . esc_attr( $data_value ) . '"';
				}
			}
			?>
			<p class="shopwell-notice-action">
				<a href="<?php echo esc_url( $args['action_link'] ); ?>" class="<?php echo esc_attr( $action_class ); ?>"<?php echo $action_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> role="button">
					<span class="shopwell-notice-spinner"></span>
					<span class="shopwell-notice-action-text" role="status" aria-live="polite"><?php echo esc_html( $args['action_text'] ); ?></span>
				</a>
			</p><!-- END .shopwell-notice-action -->
		<?php endif; ?>

		<style>
			/* Scoped to this notice's id - our admin.css doesn't load on core screens
			   (Dashboard, Themes) where this notice also needs to render correctly. */
			#<?php echo esc_attr( $args['message_id'] ); ?> {
				display: block;
				position: relative;
				background: #fff;
				border: 1px solid #e0e0e0;
				border-left: 1px solid #e0e0e0;
				border-radius: 8px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
				padding: 20px 44px 20px 24px;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .notice-dismiss {
				top: 14px;
				right: 14px;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-title {
				margin: 0 0 6px;
				font-size: 18px;
				font-weight: 600;
				color: #111827;
				line-height: 1.4;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-message {
				margin: 0<?php echo $has_action ? ' 0 16px' : ''; ?>;
				color: #66717f;
				font-size: 14px;
				line-height: 1.5;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-message a {
				color: #0068c8;
				text-decoration: none;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-message a:hover,
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-message a:focus {
				color: #0178e6;
				text-decoration: underline;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-action {
				margin: 0;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				background: #0068c8;
				color: #fff;
				font-size: 13px;
				font-weight: 600;
				line-height: 1.693;
				text-decoration: none;
				padding: 8px 20px;
				border-radius: 4px;
				border: none;
				min-height: auto;
				box-shadow: none;
				text-shadow: none;
				-webkit-transition: background-color .15s ease;
				transition: background-color .15s ease;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-btn:hover,
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-btn:focus {
				background: #0178e6;
				color: #fff;
				box-shadow: none;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-btn.in-progress {
				opacity: .75;
				pointer-events: none;
			}
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-spinner { display: none; width: 14px; height: 14px; margin: 0 6px 0 0; vertical-align: text-bottom; border-radius: 50%; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; animation: shopwell-notice-spin .8s linear infinite; }
			#<?php echo esc_attr( $args['message_id'] ); ?> .shopwell-notice-spinner.is-active { display: inline-block; }
			@keyframes shopwell-notice-spin { to { transform: rotate( 360deg ); } }
		</style>
	</div>

	<script type="text/javascript">
		jQuery( document ).ready( function ( $ ) {

			var msgid = "<?php echo esc_attr( $args['message_id'] ); ?>";
			var $el   = $( '#' + msgid );

			$el.on( 'click', '.notice-dismiss', function ( event ) {

				var expires = "<?php echo esc_attr( $args['expires'] ); ?>";
				var nonce = "<?php echo esc_attr( wp_create_nonce( 'shopwell_dismiss_notice' ) ); ?>";

				$.post( ajaxurl, {
					action: 		'shopwell_dismiss_notice',
					msgid: 			msgid,
					expires: 		expires,
					_ajax_nonce: 	nonce,
				} );

				$el.fadeTo( 100, 0, function() {
					$el.slideUp( 100, function() {
						$el.remove();
					});
				});
			} );
		} );
	</script>
	<?php
}

/**
 * Check if admin notice is dismissed.
 *
 * @since 1.0.0
 * @param array $id Notice ID.
 * @return boolean
 */
function shopwell_is_notice_dismissed( $id ) {

	if ( false !== get_transient( 'shopwell_notice_' . $id ) ) {
		return true;
	}

	return false;
}

/**
 * Ajax handler to dismiss admin notice.
 *
 * @since 1.0.0
 * @return void
 */
function shopwell_dismiss_notice() {

	check_ajax_referer( 'shopwell_dismiss_notice' );

	if ( ! isset( $_POST['msgid'] ) ) {
		die;
	}

	$message_id = sanitize_text_field( wp_unslash( $_POST['msgid'] ) );
	$expires    = isset( $_POST['expires'] ) ? intval( wp_unslash( $_POST['expires'] ) ) : 0;

	$message              = (array) get_transient( 'shopwell_notice_' . $message_id );
	$message['time']      = time();
	$message['dismissed'] = true;

	set_transient( 'shopwell_notice_' . $message_id, $message, $expires );
	die;
}
add_action( 'wp_ajax_shopwell_dismiss_notice', 'shopwell_dismiss_notice' );

/**
 * Print admin icon.
 *
 * @since 1.0.0
 * @param string $icon             Icon name.
 * @param string $tooltip          Tooltip text.
 * @param string $tooltip_position Position of the tooltip.
 * @return void
 */
function shopwell_print_admin_icon( $icon = 'info', $tooltip = '', $tooltip_position = 'right-tooltip' ) {

	$svg_icon = '<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 9h-2V7h2v2zm0 2h-2v6h2v-6zm-1-7c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8m0-2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/></svg>';

	if ( '' !== $tooltip ) {
		$tooltip = '<span class="shopwell-tooltip ' . esc_attr( $tooltip_position ) . '">' . esc_html( $tooltip ) . '</span>';
	}

	if ( 'warning' === $icon ) {
		echo '<i class="shopwell-warning-icon">' . $svg_icon . $tooltip . '</i>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	} elseif ( 'info' === $icon ) {
		echo '<i class="shopwell-info-icon">' . $svg_icon . $tooltip . '</i>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

/**
 * Check if currently using block editor page.
 *
 * @since 1.0.0
 * @return boolean
 */
function shopwell_is_block_editor() {

	if ( function_exists( 'is_gutenberg_page' ) && is_gutenberg_page() ) {
		// The Gutenberg plugin is on.
		return true;
	}

	$current_screen = get_current_screen();
	if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
		// Gutenberg page on 5+.
		return true;
	}

	return false;
}

/**
 * Print help icon with a link to documentation.
 *
 * @param  array $args Optional parameters.
 * @param  bool  $echo Return or print the link.
 * @since  1.0.0
 * @return void|string
 */
function shopwell_help_link( $args = array(), $echo = true ) {

	if ( ! apply_filters( 'shopwell_display_help_links', true ) ) {
		return;
	}

	$defaults = array(
		'link'  => '',
		'class' => array(),
	);

	$args = wp_parse_args( $args, $defaults );

	$args['class']   = (array) $args['class'];
	$args['class'][] = 'shopwell-help-link';

	$class = trim( implode( ' ', $args['class'] ) );

	$icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>';

	$output = sprintf(
		'<a href="%1$s" rel="nofollow" target="_blank" class="%2$s"><span class="shopwell-help-icon">%4$s</span>%3$s</a>',
		esc_url( $args['link'] ),
		esc_attr( $class ),
		esc_html__( 'How to use', 'shopwell' ),
		$icon
	);

	if ( $echo ) {
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	} else {
		return $output;
	}
}
