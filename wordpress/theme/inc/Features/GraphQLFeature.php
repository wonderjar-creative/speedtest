<?php
/**
 * GraphQL Feature.
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

		// Add blocksJSON field to ContentNode — parsed blocks in frontend-compatible format.
		register_graphql_field(
			'ContentNode',
			'blocksJSON',
			array(
				'type'        => 'String',
				'description' => 'JSON-encoded block data in frontend-compatible format.',
				'resolve'     => function ( $post ) {
					// Use get_post() instead of $post->contentRaw because WPGraphQL
					// gates contentRaw behind edit_posts capability, returning null
					// for unauthenticated/public requests.
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					$wp_post     = get_post( $post->databaseId );
					$content     = $wp_post->post_content ?? '';
					$blocks      = parse_blocks( $content );
					$registry    = \WP_Block_Type_Registry::get_instance();
					$transformed = $this->transform_blocks( $blocks, $registry );
					return wp_json_encode( $transformed );
				},
			)
		);

		// Add templateSlug field to ContentNode.
		register_graphql_field(
			'ContentNode',
			'templateSlug',
			array(
				'type'        => 'String',
				'description' => 'The template slug assigned to this content.',
				'resolve'     => function ( $post ) {
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					$template = get_page_template_slug( $post->databaseId );
					if ( $template ) {
						$template = str_replace( '.html', '', $template );
						$template = str_replace( 'templates/', '', $template );
					}
					return $template ?: '';
				},
			)
		);

		// Add block data field to ContentNode (legacy).
		register_graphql_field(
			'ContentNode',
			'blocksData',
			array(
				'type'        => 'String',
				'description' => 'JSON-encoded raw block data for the content.',
				'resolve'     => function ( $post ) {
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					$wp_post = get_post( $post->databaseId );
					$content = $wp_post->post_content ?? '';
					$blocks  = parse_blocks( $content );
					return wp_json_encode( $blocks );
				},
			)
		);
	}

	/**
	 * Transform parse_blocks() output to frontend-compatible format.
	 *
	 * @param array                     $blocks   Raw blocks from parse_blocks().
	 * @param \WP_Block_Type_Registry $registry Block type registry.
	 * @return array Transformed blocks.
	 */
	private function transform_blocks( array $blocks, \WP_Block_Type_Registry $registry ): array {
		return array_values(
			array_filter(
				array_map(
					function ( $block ) use ( $registry ) {
						if ( empty( $block['blockName'] ) ) {
							return null;
						}

						$block_type = $registry->get_registered( $block['blockName'] );
						$is_dynamic = $block_type && $block_type->is_dynamic();

						$dynamic_content = null;
						if ( $is_dynamic ) {
							$dynamic_content = render_block( $block );
						}

						$inner_blocks = array();
						if ( ! empty( $block['innerBlocks'] ) ) {
							$inner_blocks = $this->transform_blocks( $block['innerBlocks'], $registry );
						}

						return array(
							'name'           => $block['blockName'],
							'attributes'     => ! empty( $block['attrs'] ) ? $block['attrs'] : new \stdClass(),
							'innerBlocks'    => $inner_blocks,
							'saveContent'    => $block['innerHTML'] ?? '',
							'dynamicContent' => $dynamic_content,
							'isDynamic'      => $is_dynamic,
						);
					},
					$blocks
				)
			)
		);
	}
}
