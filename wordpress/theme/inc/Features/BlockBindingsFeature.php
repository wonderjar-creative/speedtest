<?php
/**
 * Block Bindings Feature.
 *
 * Registers a custom block bindings source so core/paragraph (and other blocks)
 * can bind their content to CPT meta fields.
 *
 * @package ElevationTheme
 * @since 0.2.0
 */

namespace ElevationTheme\Inc\Features;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * BlockBindings Feature class.
 */
class BlockBindingsFeature {

	/**
	 * Hook declarations for this feature.
	 *
	 * @return array
	 */
	public function hooks(): array {
		return array(
			array( 'action', 'init', 'register_bindings_source' ),
		);
	}

	/**
	 * Register the elevation/post-meta block bindings source.
	 *
	 * @return void
	 */
	public function register_bindings_source(): void {
		if ( ! function_exists( 'register_block_bindings_source' ) ) {
			return;
		}

		register_block_bindings_source(
			'elevation/post-meta',
			array(
				'label'              => __( 'Elevation Post Meta', 'elevation-theme' ),
				'get_value_callback' => array( $this, 'get_value' ),
				'uses_context'       => array( 'postId', 'postType' ),
			)
		);
	}

	/**
	 * Resolve a bound meta value for a block.
	 *
	 * @param array    $source_args    The binding source arguments (contains 'key').
	 * @param WP_Block $block_instance The block instance with context.
	 * @param string   $attribute_name The attribute being bound (e.g. 'content').
	 * @return string|null
	 */
	public function get_value( array $source_args, $block_instance, string $attribute_name ) {
		$key = $source_args['key'] ?? '';
		if ( empty( $key ) ) {
			return null;
		}

		$post_id = $block_instance->context['postId'] ?? 0;
		if ( ! $post_id ) {
			return null;
		}

		$value = get_post_meta( $post_id, $key, true );

		// Convert rating integer to star characters.
		if ( 'rating' === $key && is_numeric( $value ) ) {
			$rating = max( 0, min( 5, (int) $value ) );
			return str_repeat( '★', $rating );
		}

		return (string) $value;
	}
}
