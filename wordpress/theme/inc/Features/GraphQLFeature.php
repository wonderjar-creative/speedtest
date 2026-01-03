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

		add_action( 'graphql_register_types', [ $this, 'register_types' ] );
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
			[
				'type'        => 'Boolean',
				'description' => 'Whether this page is set as the posts page.',
				'resolve'     => function ( $post ) {
					$posts_page_id = get_option( 'page_for_posts' );
					return $post->databaseId === (int) $posts_page_id;
				},
			]
		);

		// Add isFrontPage field to Page type.
		register_graphql_field(
			'Page',
			'isFrontPage',
			[
				'type'        => 'Boolean',
				'description' => 'Whether this page is set as the front page.',
				'resolve'     => function ( $post ) {
					$front_page_id = get_option( 'page_on_front' );
					return $post->databaseId === (int) $front_page_id;
				},
			]
		);

		// Add block data field to ContentNode.
		register_graphql_field(
			'ContentNode',
			'blocksData',
			[
				'type'        => 'String',
				'description' => 'JSON-encoded block data for the content.',
				'resolve'     => function ( $post ) {
					$blocks = parse_blocks( $post->contentRaw ?? '' );
					return wp_json_encode( $blocks );
				},
			]
		);
	}
}
