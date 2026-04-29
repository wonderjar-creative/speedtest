<?php
/**
 * Block Extensions Feature.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc\Features;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Extensions Feature class.
 *
 * Adds a `priority` boolean attribute to image-bearing blocks so editors
 * can flag the LCP candidate per page. The headless frontend reads this
 * attribute to decide which image gets `priority` on next/image (eager
 * load + <link rel="preload">). The WordPress-rendered slow site ignores
 * the attribute — it only matters for the headless side.
 *
 * Attribute registration must happen in PHP (not just the JS editor
 * filter) so WPGraphQL Gutenberg passes it through to the headless app
 * when serializing block JSON.
 */
class BlockExtensionsFeature {

	/**
	 * Block types that get the `priority` attribute.
	 *
	 * @var array
	 */
	private const PRIORITY_BLOCK_TYPES = array(
		'core/cover',
		'core/image',
		'core/post-featured-image',
	);

	/**
	 * Hook declarations for this feature.
	 *
	 * @return array
	 */
	public function hooks(): array {
		return array(
			array( 'filter', 'register_block_type_args', 'add_priority_attribute', 10, 2 ),
			array( 'action', 'enqueue_block_editor_assets', 'enqueue_editor_script' ),
		);
	}

	/**
	 * Register a `priority` boolean attribute on supported block types.
	 *
	 * @param array  $args       Block type registration args.
	 * @param string $block_type Block type name (e.g. "core/cover").
	 * @return array Modified args.
	 */
	public function add_priority_attribute( array $args, string $block_type ): array {
		if ( ! in_array( $block_type, self::PRIORITY_BLOCK_TYPES, true ) ) {
			return $args;
		}

		$args['attributes']            = $args['attributes'] ?? array();
		$args['attributes']['priority'] = array(
			'type'    => 'boolean',
			'default' => false,
		);

		return $args;
	}

	/**
	 * Enqueue the block editor script that adds the InspectorControls toggle.
	 *
	 * @return void
	 */
	public function enqueue_editor_script(): void {
		wp_enqueue_script(
			'elevation-block-extensions',
			get_template_directory_uri() . '/assets/js/block-extensions.js',
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-hooks', 'wp-i18n', 'wp-compose' ),
			filemtime( get_template_directory() . '/assets/js/block-extensions.js' ),
			true
		);
	}
}
