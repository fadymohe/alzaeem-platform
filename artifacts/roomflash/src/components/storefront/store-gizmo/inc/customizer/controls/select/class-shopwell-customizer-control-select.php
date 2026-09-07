<?php
/**
 * Shopwell Customizer custom select control class.
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

if ( ! class_exists( 'Shopwell_Customizer_Control_Select' ) ) :
	/**
	 * Shopwell Customizer custom select control class.
	 */
	class Shopwell_Customizer_Control_Select extends Shopwell_Customizer_Control {

		/**
		 * The control type.
		 *
		 * @var string
		 */
		public $type = 'shopwell-select';

		/**
		 * Placeholder text.
		 *
		 * @since 1.0.0
		 * @var string|false
		 */
		public $placeholder = false;

		/**
		 * Select2 flag.
		 *
		 * @since 1.0.0
		 * @var boolean
		 */
		public $is_select2 = false;

		/**
		 * Data source.
		 *
		 * @since 1.0.0
		 * @var string|false
		 */
		public $data_source = false;

		/**
		 * Source from where we will show data like custom taxonomy.
		 *
		 * @var boolean
		 */
		public $data_source_name = null;

		/**
		 * Multiple items.
		 *
		 * @since 1.0.0
		 * @var boolean
		 */
		public $multiple = false;

		/**
		 * Set the default typography options.
		 *
		 * @since 1.0.0
		 * @param WP_Customize_Manager $manager Customizer bootstrap instance.
		 * @param string               $id      Control ID.
		 * @param array                $args    Default parent's arguments.
		 */
		public function __construct( $manager, $id, $args = array() ) {

			parent::__construct( $manager, $id, $args );

			if ( $this->is_select2 && $this->data_source ) {
				$selected_values = $this->value();

				if ( ! is_array( $selected_values ) ) {
					$selected_values = $selected_values ? explode( ',', (string) $selected_values ) : array();
				}

				$selected_values = array_filter( array_map( 'trim', $selected_values ) );
				$selected_values = array_unique( $selected_values );

				if ( ! empty( $selected_values ) ) {
					$selected_ids = array_map( 'intval', $selected_values );
					$choices      = array();

					switch ( $this->data_source ) {
						case 'category':
							$args  = array(
								'taxonomy'   => $this->data_source_name ?? 'category',
								'hide_empty' => false,
								'include'    => $selected_ids,
							);
							$terms = get_terms( $args );

							if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
								foreach ( $terms as $term ) {
									$choices[ $term->term_id ] = $term->name;
								}
							}

							break;

						case 'tags':
							$args  = array(
								'taxonomy'   => 'post_tag',
								'hide_empty' => false,
								'include'    => $selected_ids,
							);
							$terms = get_terms( $args );

							if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
								foreach ( $terms as $term ) {
									$choices[ $term->term_id ] = $term->name;
								}
							}

							break;

						case 'page':
							$pages = get_posts(
								array(
									'post_type'      => 'page',
									'post_status'    => 'publish',
									'posts_per_page' => count( $selected_ids ),
									'post__in'       => $selected_ids,
									'orderby'        => 'post__in',
								)
							);

							if ( ! empty( $pages ) ) {
								foreach ( $pages as $page ) {
									$choices[ $page->ID ] = $page->post_title;
								}
							}
							break;
						case 'post':
							$posts = get_posts(
								array(
									'post_type'      => 'post',
									'post_status'    => 'publish',
									'posts_per_page' => count( $selected_ids ),
									'post__in'       => $selected_ids,
									'orderby'        => 'post__in',
								)
							);

							if ( ! empty( $posts ) ) {
								foreach ( $posts as $post ) {
									$choices[ $post->ID ] = $post->post_title;
								}
							}

							break;

						default:
							if( post_type_exists( $this->data_source ) ) {
								$posts = get_posts(
									array(
										'post_type'      => $this->data_source,
										'post_status'    => 'publish',
										'posts_per_page' => count( $selected_ids ),
										'post__in'       => $selected_ids,
										'orderby'        => 'post__in',
									)
								);

								if ( ! empty( $posts ) ) {
									foreach ( $posts as $post ) {
										$choices[ $post->ID ] = $post->post_title;
									}
								}
							}
							break;
					}
					$this->choices = $choices;
				}
			}
		}

		/**
		 * Refresh the parameters passed to the JavaScript via JSON.
		 *
		 * @see WP_Customize_Control::to_json()
		 */
		public function to_json() {
			parent::to_json();

			$this->json['choices']     = $this->choices;
			$this->json['placeholder'] = $this->placeholder;
			$this->json['is_select2']  = $this->is_select2;
			$this->json['multiple']    = $this->multiple ? ' multiple="multiple"' : '';
			$this->json['data_source']      = $this->data_source;
			$this->json['data_source_name'] = $this->data_source_name;
			$this->json['nonce']            = wp_create_nonce( 'shopwell_customizer_nonce' );

			if ( $this->multiple ) {
				$this->json['value'] = implode( ',', (array) $this->json['value'] );
			}
		}

		/**
		 * Enqueue control related scripts/styles.
		 *
		 * @access public
		 */
		public function enqueue() {

			parent::enqueue();

			if ( $this->is_select2 ) {

				// Script debug.
				$shopwell_suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

				/**
				 * Enqueue select2 stylesheet.
				 */
				wp_enqueue_style(
					'shopwell-select2-style',
					SHOPWELL_THEME_URI . '/inc/admin/dashboard/assets/css/select2' . $shopwell_suffix . '.css',
					false,
					SHOPWELL_THEME_VERSION,
					'all'
				);

				/**
				 * Enqueue select2 script.
				 */
				wp_enqueue_script(
					'shopwell-select2-js',
					SHOPWELL_THEME_URI . '/inc/admin/dashboard/assets/js/libs/select2' . $shopwell_suffix . '.js',
					array( 'jquery' ),
					SHOPWELL_THEME_VERSION,
					true
				);
			}
		}

		/**
		 * An Underscore (JS) template for this control's content (but not its container).
		 *
		 * Class variables for this control class are available in the `data` JS object;
		 * export custom variables by overriding {@see WP_Customize_Control::to_json()}.
		 *
		 * @see WP_Customize_Control::print_template()
		 */
		protected function content_template() {
			?>
			<div class="shopwell-control-wrapper shopwell-select-wrapper">

			<label>
				<# if ( data.label ) { #>
					<div class="customize-control-title">
						<span>{{{ data.label }}}</span>

						<# if ( data.description ) { #>
							<i class="shopwell-info-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle">
									<circle cx="12" cy="12" r="10"></circle>
									<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
									<line x1="12" y1="17" x2="12" y2="17"></line>
								</svg>
								<span class="shopwell-tooltip">{{{ data.description }}}</span>
							</i>
						<# } #>
					</div>
				<# } #>

				<select class="shopwell-select-control" {{{ data.link }}}{{{ data.multiple }}}>

					<# if ( ! data.is_select2 ) { #>
						<!-- Regular select: render all choices -->
						<# for ( key in data.choices ) { #>
							<option title="{{ data.choices[ key ] }}" value="{{ key }}" <# if ( key === data.value ) { #> selected="selected" <# } #>>{{ data.choices[ key ] }}</option>
						<# } #>
					<# } else { #>
						<!-- Select2: render selected values only (rest loaded via AJAX or static) -->
						<# if ( data.value ) { #>
							<# var selectedChoices = data.value ? data.value.toString().split( ',' ) : []; #>
							<# _.each( selectedChoices, function( choice ) { #>
								<# var label = data.choices && data.choices[ choice ] ? data.choices[ choice ] : choice; #>
								<option value="{{ choice }}" selected="selected">{{ label }}</option>
							<# } ) #>
						<# } #>
					<# } #>

				</select>

			</label>

			</div><!-- END .shopwell-control-wrapper -->
			<?php
		}
	}
endif;
