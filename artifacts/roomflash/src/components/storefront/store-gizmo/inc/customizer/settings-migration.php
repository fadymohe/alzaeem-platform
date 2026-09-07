<?php
/**
 * Backwards Compatibility for Select Control ID Migration
 *
 * This file provides runtime migration of legacy slug-based values to IDs for select controls.
 * It ensures that even if the auto-migration process fails or is bypassed, the theme can still
 * retrieve and use the correct IDs when rendering the front-end or Customizer.
 *
 * The migration targets specific settings defined in the get_migration_map() method, which should
 * be updated to include any new select controls added in the future.
 *
 * @package Shopwell
 * @author  Peregrine Themes
 * @since    1.0.15
 */

namespace Shopwell\Customizer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Settings_migration
 *
 * Handles runtime migration of legacy slug-based Customizer select values to IDs.
 *
 * @since 1.0.15
 */
class Settings_migration {

	/**
	 * Single instance of this class.
	 *
	 * @var Settings_migration|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @since 1.0.15
	 * @return Settings_migration
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor. Hooks into WordPress.
	 *
	 * @since 1.0.15
	 */
	private function __construct() {
		add_action( 'after_setup_theme', array( $this, 'register_filters' ), 20 );
	}

	/**
	 * Register theme_mod filters for each setting in the migration map.
	 *
	 * @since 1.0.15
	 * @return void
	 */
	public function register_filters() {
		foreach ( $this->get_migration_map() as $setting_id => $config ) {
			add_filter(
				"theme_mod_{$setting_id}",
				function ( $value ) use ( $setting_id, $config ) {
					return $this->maybe_migrate( $value, $setting_id, $config );
				},
				20
			);
		}
	}

	/**
	 * Map of select settings to their migration rules.
	 *
	 * @since 1.0.15
	 * @return array
	 */
	public function get_migration_map() {
		return apply_filters( 'shopwell_migration_map', array(
			'shopwell_blog_trending_tag' => array(
				'type'     => 'term',
				'taxonomy' => 'post_tag',
			),
			'shopwell_blog_featured_tag' => array(
				'type'     => 'term',
				'taxonomy' => 'post_tag',
			),
		) );
	}

	/**
	 * Migrate a setting value from slugs to term IDs if needed.
	 *
	 * @since 1.0.15
	 * @param mixed  $value      Current setting value.
	 * @param string $setting_id Setting ID (unused here, available for logging/extension).
	 * @param array  $config     Migration config ( 'type', 'taxonomy' ).
	 * @return mixed Converted IDs array, original value if already numeric, or empty array on failure.
	 */
	public function maybe_migrate( $value, $setting_id, array $config ) {
		if ( empty( $value ) ) {
			return $value;
		}

		$value_array = $this->normalize_to_array( $value );

		if ( $this->all_numeric( $value_array ) ) {
			return $value;
		}

		$converted = $this->convert_slugs_to_ids( $value_array, $config );

		$converted = array_values( array_unique( array_filter( $converted ) ) );

		return ! empty( $converted ) ? $converted : array();
	}

	/**
	 * Normalize a value to an array of scalar items.
	 *
	 * @since 1.0.15
	 * @param mixed $value Input value, which may be a comma-separated string, an array, or a single scalar.
	 * @return array
	 */
	private function normalize_to_array( $value ) {
		if ( is_string( $value ) ) {
			return array_filter( array_map( 'trim', explode( ',', $value ) ) );
		}

		if ( ! is_array( $value ) ) {
			return array( $value );
		}

		return $value;
	}

	/**
	 * Check whether every item in an array is already a numeric string or integer.
	 *
	 * @since 1.0.15
	 * @param array $items Array of items to check.
	 * @return bool
	 */
	private function all_numeric( array $items ) {
		foreach ( $items as $item ) {
			$str = is_scalar( $item ) ? (string) $item : '';
			if ( '' !== $str && ! ctype_digit( $str ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Convert an array of mixed slug/numeric items to term IDs.
	 *
	 * @since 1.0.15
	 * @param array $items Array of items to convert (may contain slugs or numeric strings).
	 * @param array $config Migration config.
	 * @return int[]
	 */
	private function convert_slugs_to_ids( array $items, array $config ) {
		$converted = array();

		foreach ( $items as $item ) {
			$str = is_scalar( $item ) ? (string) $item : '';

			if ( '' === $str ) {
				continue;
			}

			// Already numeric — keep as-is.
			if ( ctype_digit( $str ) ) {
				$converted[] = (int) $str;
				continue;
			}

			// Resolve slug to ID.
			if ( 'term' === $config['type'] ) {
				$id = $this->resolve_term_id( $str, $config['taxonomy'] );
				if ( $id ) {
					$converted[] = $id;
				}
			}elseif ( 'post' === $config['type'] ) {
				$post = get_page_by_path( $str, OBJECT, $config['post_type'] );
				if ( $post && ! is_wp_error( $post ) ) {
					$converted[] = (int) $post->ID;
				}
			}
		}
		return $converted;
	}

	/**
	 * Attempt to resolve a term slug (or name) to its term ID.
	 *
	 * @since 1.0.15
	 * @param string $slug     Slug or name to look up.
	 * @param string $taxonomy Taxonomy name.
	 * @return int|null Term ID on success, null on failure.
	 */
	private function resolve_term_id( $slug, $taxonomy ) {
		$term = get_term_by( 'slug', $slug, $taxonomy );
		if ( $term && ! is_wp_error( $term ) ) {
			return (int) $term->term_id;
		}

		// Fallback: try by name.
		$term = get_term_by( 'name', $slug, $taxonomy );
		if ( $term && ! is_wp_error( $term ) ) {
			return (int) $term->term_id;
		}

		return null;
	}
}
