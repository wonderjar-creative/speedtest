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
 * The blocksJSON field is provided by the WPGraphQL Gutenberg plugin.
 */
class GraphQLFeature {

	/**
	 * Hook declarations for this feature.
	 *
	 * Returns an empty array when WPGraphQL isn't active, so nothing gets wired up.
	 *
	 * @return array
	 */
	public function hooks(): array {
		if ( ! class_exists( 'WPGraphQL' ) ) {
			return array();
		}

		return array(
			array( 'action', 'graphql_register_types', 'register_types' ),
		);
	}

	/**
	 * Register custom GraphQL types and fields.
	 *
	 * @return void
	 */
	public function register_types(): void {
		$this->register_project_fields();
		$this->register_team_member_fields();
		$this->register_testimonial_fields();

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

		// Add templateSlug field to Page type.
		register_graphql_field(
			'Page',
			'templateSlug',
			array(
				'type'        => 'String',
				'description' => 'The template file slug (e.g., "page-header-absolute-no-title").',
				'resolve'     => function ( $post ) {
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					return $this->get_template_slug( $post->databaseId, 'page' );
				},
			)
		);

		// Add templateSlug field to Post type.
		register_graphql_field(
			'Post',
			'templateSlug',
			array(
				'type'        => 'String',
				'description' => 'The template file slug (e.g., "single").',
				'resolve'     => function ( $post ) {
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
					return $this->get_template_slug( $post->databaseId, 'post' );
				},
			)
		);
	}

	/**
	 * Register GraphQL fields for the Project CPT.
	 *
	 * @return void
	 */
	private function register_project_fields(): void {
		$fields = array(
			'location'       => array(
				'type' => 'String',
				'key'  => 'location',
			),
			'projectType'    => array(
				'type' => 'String',
				'key'  => 'project_type',
			),
			'squareFootage'  => array(
				'type' => 'Int',
				'key'  => 'square_footage',
			),
			'yearCompleted'  => array(
				'type' => 'Int',
				'key'  => 'year_completed',
			),
			'photoUrl'       => array(
				'type' => 'String',
				'key'  => 'photo_url',
			),
		);

		foreach ( $fields as $field_name => $config ) {
			register_graphql_field(
				'Project',
				$field_name,
				array(
					'type'        => $config['type'],
					'description' => "Project {$field_name} meta field.",
					'resolve'     => function ( $post ) use ( $config ) {
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
						$value = get_post_meta( $post->databaseId, $config['key'], true );
						return 'Int' === $config['type'] ? (int) $value : $value;
					},
				)
			);
		}
	}

	/**
	 * Register GraphQL fields for the TeamMember CPT.
	 *
	 * @return void
	 */
	private function register_team_member_fields(): void {
		$fields = array(
			'position' => array(
				'type' => 'String',
				'key'  => 'position',
			),
			'bio'      => array(
				'type' => 'String',
				'key'  => 'bio',
			),
			'photoUrl' => array(
				'type' => 'String',
				'key'  => 'photo_url',
			),
			'order'    => array(
				'type' => 'Int',
				'key'  => 'order',
			),
		);

		foreach ( $fields as $field_name => $config ) {
			register_graphql_field(
				'TeamMember',
				$field_name,
				array(
					'type'        => $config['type'],
					'description' => "Team member {$field_name} meta field.",
					'resolve'     => function ( $post ) use ( $config ) {
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
						$value = get_post_meta( $post->databaseId, $config['key'], true );
						return 'Int' === $config['type'] ? (int) $value : $value;
					},
				)
			);
		}
	}

	/**
	 * Register GraphQL fields for the Testimonial CPT.
	 *
	 * @return void
	 */
	private function register_testimonial_fields(): void {
		$fields = array(
			'authorName' => array(
				'type' => 'String',
				'key'  => 'author_name',
			),
			'authorRole' => array(
				'type' => 'String',
				'key'  => 'author_role',
			),
			'rating'     => array(
				'type' => 'Int',
				'key'  => 'rating',
			),
			'photoUrl'   => array(
				'type' => 'String',
				'key'  => 'photo_url',
			),
		);

		foreach ( $fields as $field_name => $config ) {
			register_graphql_field(
				'Testimonial',
				$field_name,
				array(
					'type'        => $config['type'],
					'description' => "Testimonial {$field_name} meta field.",
					'resolve'     => function ( $post ) use ( $config ) {
						// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- WPGraphQL model property.
						$value = get_post_meta( $post->databaseId, $config['key'], true );
						return 'Int' === $config['type'] ? (int) $value : $value;
					},
				)
			);
		}
	}

	/**
	 * Get the template slug for a post.
	 *
	 * Retrieves the template slug from post meta and normalizes it.
	 * For block themes, the template is stored without .php extension.
	 *
	 * @param int    $post_id   The post ID.
	 * @param string $post_type The post type ('page' or 'post').
	 * @return string The template slug or default template for the post type.
	 */
	private function get_template_slug( int $post_id, string $post_type = 'page' ): string {
		$template = get_post_meta( $post_id, '_wp_page_template', true );

		// If no template or default, return the default for this post type.
		if ( empty( $template ) || 'default' === $template ) {
			return 'post' === $post_type ? 'single' : 'page';
		}

		// Remove .php extension if present (classic themes).
		$slug = preg_replace( '/\.php$/', '', $template );

		// Remove any path prefix (e.g., "templates/").
		$slug = basename( $slug );

		return $slug;
	}
}
