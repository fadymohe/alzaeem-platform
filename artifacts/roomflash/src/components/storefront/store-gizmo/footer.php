<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Shopwell
 */

$shopwell_footer_options            = \Shopwell\Helper::get_option( 'footer_options' );
$shopwell_footer_copyright_textarea = \Shopwell\Helper::get_option( 'footer_copyright_textarea' );
?>

<?php do_action( 'shopwell_before_site_content_close' ); ?>
</div><!-- #content -->

<?php do_action( 'shopwell_before_open_site_footer' ); ?>

<?php if ( ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'footer' ) ) && $shopwell_footer_options == '2' ) : ?>
	<footer id="site-footer" class="site-footer">
		<?php do_action( 'shopwell_footer' ); ?>
	</footer>
<?php else : ?>
	<footer id="site-footer" class="site-footer site-footer-widget">
		<div class="container clearfix">
			
		<?php
			$footer_widget_id = 'footer-widget';

			if ( is_active_sidebar( $footer_widget_id ) ) : ?>
				<div class="footer-main">
					<?php dynamic_sidebar( $footer_widget_id ); ?>
				</div>
			<?php elseif ( current_user_can( 'edit_theme_options' ) ) : ?>
				<div class="footer-main">
					<div class="shopwell-no-widget">
						<div class="widget-title"><?php esc_html_e( 'Footer widget.', 'shopwell' ); ?></div>
						<p class="no-widget-text">
							<?php
							$customizer_url = admin_url( 'customize.php?autofocus[section]=sidebar-widgets-' . $footer_widget_id );
							$widgets_url    = admin_url( 'widgets.php' );
							$link_url       = is_customize_preview() ? $customizer_url : $widgets_url;
							?>
							<a href="<?php echo esc_url( $link_url ); ?>" class="shopwell-set-widget" data-sidebar-id="<?php echo esc_attr( $footer_widget_id ); ?>">
								<?php esc_html_e( 'Click here to assign a widget.', 'shopwell' ); ?>
							</a>
						</p>
					</div>
				</div>
			<?php endif; ?>

			
			<?php if ( ! empty( $shopwell_footer_copyright_textarea ) ) { ?>
			<div class="footer-copyright">
				<div class="copyright"><?php echo wp_kses_post( apply_filters( 'shopwell_dynamic_strings', $shopwell_footer_copyright_textarea ) ); ?></div>
			</div>
			<?php } ?>
		</div>
	</footer>
<?php endif; ?>
<?php do_action( 'shopwell_after_close_site_footer' ); ?>

</div><!-- #page -->

<?php do_action( 'shopwell_after_site' ); ?>

<?php wp_footer(); ?>

</body>
</html>
