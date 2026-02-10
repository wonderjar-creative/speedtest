<?php
/**
 * Custom Post Types Feature.
 *
 * Registers project, team_member, and testimonial CPTs with meta fields.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc\Features;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * PostTypes Feature class.
 */
class PostTypesFeature {

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', [ $this, 'register_post_types' ] );
		add_action( 'init', [ $this, 'register_meta_fields' ] );
	}

	/**
	 * Register custom post types.
	 *
	 * @return void
	 */
	public function register_post_types(): void {
		// Project CPT.
		register_post_type(
			'project',
			[
				'labels'              => [
					'name'               => 'Projects',
					'singular_name'      => 'Project',
					'add_new_item'       => 'Add New Project',
					'edit_item'          => 'Edit Project',
					'all_items'          => 'All Projects',
					'search_items'       => 'Search Projects',
					'not_found'          => 'No projects found.',
					'not_found_in_trash' => 'No projects found in Trash.',
				],
				'public'              => true,
				'has_archive'         => true,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'project',
				'graphql_plural_name' => 'projects',
				'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
				'menu_icon'           => 'dashicons-portfolio',
				'rewrite'             => [ 'slug' => 'projects' ],
			]
		);

		// Team Member CPT.
		register_post_type(
			'team_member',
			[
				'labels'              => [
					'name'               => 'Team Members',
					'singular_name'      => 'Team Member',
					'add_new_item'       => 'Add New Team Member',
					'edit_item'          => 'Edit Team Member',
					'all_items'          => 'All Team Members',
					'search_items'       => 'Search Team Members',
					'not_found'          => 'No team members found.',
					'not_found_in_trash' => 'No team members found in Trash.',
				],
				'public'              => true,
				'has_archive'         => true,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'teamMember',
				'graphql_plural_name' => 'teamMembers',
				'supports'            => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
				'menu_icon'           => 'dashicons-groups',
				'rewrite'             => [ 'slug' => 'team' ],
			]
		);

		// Testimonial CPT.
		register_post_type(
			'testimonial',
			[
				'labels'              => [
					'name'               => 'Testimonials',
					'singular_name'      => 'Testimonial',
					'add_new_item'       => 'Add New Testimonial',
					'edit_item'          => 'Edit Testimonial',
					'all_items'          => 'All Testimonials',
					'search_items'       => 'Search Testimonials',
					'not_found'          => 'No testimonials found.',
					'not_found_in_trash' => 'No testimonials found in Trash.',
				],
				'public'              => true,
				'has_archive'         => true,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'testimonial',
				'graphql_plural_name' => 'testimonials',
				'supports'            => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
				'menu_icon'           => 'dashicons-format-quote',
				'rewrite'             => [ 'slug' => 'testimonials' ],
			]
		);
	}

	/**
	 * Register meta fields for CPTs.
	 *
	 * @return void
	 */
	public function register_meta_fields(): void {
		// Project meta.
		$project_meta = [
			'location'       => [
				'description' => 'Project location (e.g., Denver, CO)',
				'type'        => 'string',
			],
			'project_type'   => [
				'description' => 'Project type (Residential, Commercial, Hospitality)',
				'type'        => 'string',
			],
			'square_footage' => [
				'description' => 'Square footage of the project',
				'type'        => 'integer',
			],
			'year_completed' => [
				'description' => 'Year the project was completed',
				'type'        => 'integer',
			],
			'photo_url'      => [
				'description' => 'External photo URL (fallback when no featured image)',
				'type'        => 'string',
			],
		];

		foreach ( $project_meta as $key => $args ) {
			register_post_meta(
				'project',
				$key,
				[
					'type'              => $args['type'],
					'description'       => $args['description'],
					'single'            => true,
					'show_in_rest'      => true,
					'show_in_graphql'   => true,
					'sanitize_callback' => 'integer' === $args['type'] ? 'absint' : 'sanitize_text_field',
				]
			);
		}

		// Team Member meta.
		$team_meta = [
			'position'  => [
				'description' => 'Job title or position',
				'type'        => 'string',
			],
			'bio'       => [
				'description' => 'Short biography',
				'type'        => 'string',
			],
			'photo_url' => [
				'description' => 'External photo URL (fallback when no featured image)',
				'type'        => 'string',
			],
			'order'     => [
				'description' => 'Display order',
				'type'        => 'integer',
			],
		];

		foreach ( $team_meta as $key => $args ) {
			register_post_meta(
				'team_member',
				$key,
				[
					'type'              => $args['type'],
					'description'       => $args['description'],
					'single'            => true,
					'show_in_rest'      => true,
					'show_in_graphql'   => true,
					'sanitize_callback' => 'integer' === $args['type'] ? 'absint' : 'sanitize_text_field',
				]
			);
		}

		// Testimonial meta.
		$testimonial_meta = [
			'author_name' => [
				'description' => 'Name of the person giving the testimonial',
				'type'        => 'string',
			],
			'author_role' => [
				'description' => 'Role, company, or location',
				'type'        => 'string',
			],
			'rating'      => [
				'description' => 'Star rating (1-5)',
				'type'        => 'integer',
			],
			'photo_url'   => [
				'description' => 'External photo URL (fallback when no featured image)',
				'type'        => 'string',
			],
		];

		foreach ( $testimonial_meta as $key => $args ) {
			register_post_meta(
				'testimonial',
				$key,
				[
					'type'              => $args['type'],
					'description'       => $args['description'],
					'single'            => true,
					'show_in_rest'      => true,
					'show_in_graphql'   => true,
					'sanitize_callback' => 'integer' === $args['type'] ? 'absint' : 'sanitize_text_field',
				]
			);
		}
	}
}
