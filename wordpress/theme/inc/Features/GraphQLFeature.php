<?php
/**
 * GraphQL Feature.
 *
 * Extends WPGraphQL schema with custom fields for the headless frontend.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc\Features;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * GraphQL Feature class.
 *
 * Extends WPGraphQL schema with custom fields.
 */
class GraphQLFeature {

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register(): void {
		// Only register if WPGraphQL is active.
		if ( ! class_exists( 'WPGraphQL' ) ) {
			return;
		}

		add_action( 'graphql_register_types', array( $this, 'register_types' ) );
	}

	/**
	 * Register custom GraphQL types and fields.
	 *
	 * @return void
	 */
	public function register_types(): void {
		$this->register_page_fields();
		$this->register_template_slug_field();
		$this->register_blocks_data_field();
	}

	/**
	 * Register page-specific boolean fields.
	 *
	 * @return void
	 */
	private function register_page_fields(): void {
		// Add isPostsPage field to Page type.
		register_graphql_field(
			'Page',
			'isPostsPage',
			array(
				'type'        => 'Boolean',
				'description' => 'Whether this page is set as the posts page.',
				'resolve'     => function ( $post ) {
					$posts_page_id = get_option( 'page_for_posts' );
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					return $post->databaseId === (int) $posts_page_id;
				},
			)
		);

		// Add isFrontPage field to Page type.
		register_graphql_field(
			'Page',
			'isFrontPage',
			array(
				'type'        => 'Boolean',
				'description' => 'Whether this page is set as the front page.',
				'resolve'     => function ( $post ) {
					$front_page_id = get_option( 'page_on_front' );
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					return $post->databaseId === (int) $front_page_id;
				},
			)
		);
	}

	/**
	 * Register templateSlug field on Page and Post types.
	 *
	 * Exposes the actual template file slug (e.g., "page", "single",
	 * "page-no-title") rather than the human-readable title.
	 *
	 * @return void
	 */
	private function register_template_slug_field(): void {
		$types = array(
			'Page' => 'page',
			'Post' => 'post',
		);

		foreach ( $types as $graphql_type => $default ) {
			register_graphql_field(
				$graphql_type,
				'templateSlug',
				array(
					'type'        => 'String',
					'description' => 'The template file slug for this content.',
					'resolve'     => function ( $post ) use ( $default ) {
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL property.
						return $this->get_template_slug( $post->databaseId, $default );
					},
				)
			);
		}
	}

	/**
	 * Register blocksData field on ContentNode.
	 *
	 * Returns normalized block JSON matching the format used by
	 * the REST template endpoints (name, attributes, saveContent).
	 *
	 * @return void
	 */
	private function register_blocks_data_field(): void {
		register_graphql_field(
			'ContentNode',
			'blocksData',
			array(
				'type'        => 'String',
				'description' => 'Normalized JSON-encoded block data for the content.',
				'resolve'     => function ( $post ) {
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					$blocks = parse_blocks( $post->contentRaw ?? '' );
					$blocks = $this->normalize_block_keys( $blocks );
					return wp_json_encode( array_values( $blocks ) );
				},
			)
		);
	}

	/**
	 * Get the template slug for a post.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $default The default template for the post type.
	 * @return string The template slug.
	 */
	private function get_template_slug( int $post_id, string $default = 'page' ): string {
		$template = get_post_meta( $post_id, '_wp_page_template', true );

		if ( empty( $template ) || 'default' === $template ) {
			return 'post' === $default ? 'single' : 'page';
		}

		// Remove .php extension if present (classic themes).
		$slug = preg_replace( '/\.php$/', '', $template );

		// Remove any path prefix.
		$slug = basename( $slug );

		return $slug;
	}

	/**
	 * Normalize block keys for frontend consumption.
	 *
	 * Matches the format from RestFeature::normalize_block_keys().
	 *
	 * @param array $blocks Blocks to normalize.
	 * @return array Normalized blocks.
	 */
	private function normalize_block_keys( array $blocks ): array {
		return array_map(
			function ( $block ) {
				if ( isset( $block['blockName'] ) && ! isset( $block['name'] ) ) {
					$block['name'] = $block['blockName'];
					unset( $block['blockName'] );
				}

				if ( isset( $block['attrs'] ) && ! isset( $block['attributes'] ) ) {
					$block['attributes'] = $block['attrs'];
					unset( $block['attrs'] );
				}

				if ( isset( $block['innerHTML'] ) && ! isset( $block['saveContent'] ) ) {
					$block['saveContent'] = $block['innerHTML'];
					unset( $block['innerHTML'] );
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = array_values( $this->normalize_block_keys( $block['innerBlocks'] ) );
				}

				return $block;
			},
			$blocks
		);
	}
}
