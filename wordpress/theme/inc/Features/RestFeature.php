<?php
/**
 * REST API Feature.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc\Features;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST Feature class.
 *
 * Registers custom REST API endpoints.
 */
class RestFeature {

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'rest_api_init', [ $this, 'register_endpoints' ] );
	}

	/**
	 * Register REST API endpoints.
	 *
	 * @return void
	 */
	public function register_endpoints(): void {
		register_rest_route(
			'template-structure/v1',
			'/full',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_template_structure' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Get template structure for frontend caching.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_template_structure(): \WP_REST_Response {
		$data = [
			'templateParts' => $this->get_template_parts(),
			'patterns'      => $this->get_patterns(),
			'navigation'    => $this->get_navigation_menus(),
		];

		return new \WP_REST_Response( $data, 200 );
	}

	/**
	 * Get template parts.
	 *
	 * @return array
	 */
	private function get_template_parts(): array {
		$template_parts = [];

		$parts_dir = get_template_directory() . '/parts';
		if ( is_dir( $parts_dir ) ) {
			$files = glob( $parts_dir . '/*.html' );
			foreach ( $files as $file ) {
				$slug    = basename( $file, '.html' );
				$content = file_get_contents( $file );

				$template_parts[] = [
					'slug'    => $slug,
					'content' => $content,
				];
			}
		}

		return $template_parts;
	}

	/**
	 * Get block patterns.
	 *
	 * @return array
	 */
	private function get_patterns(): array {
		$patterns = [];

		$patterns_dir = get_template_directory() . '/patterns';
		if ( is_dir( $patterns_dir ) ) {
			$files = glob( $patterns_dir . '/*.php' );
			foreach ( $files as $file ) {
				$slug = basename( $file, '.php' );

				// Get pattern content.
				ob_start();
				include $file;
				$content = ob_get_clean();

				$patterns[] = [
					'slug'    => $slug,
					'content' => $content,
				];
			}
		}

		return $patterns;
	}

	/**
	 * Get navigation menus.
	 *
	 * @return array
	 */
	private function get_navigation_menus(): array {
		$menus = [];

		$nav_menus = wp_get_nav_menus();
		foreach ( $nav_menus as $menu ) {
			$items = wp_get_nav_menu_items( $menu->term_id );

			$menus[] = [
				'id'    => $menu->term_id,
				'name'  => $menu->name,
				'slug'  => $menu->slug,
				'items' => $items ? $this->format_menu_items( $items ) : [],
			];
		}

		return $menus;
	}

	/**
	 * Format menu items for API response.
	 *
	 * @param array $items Menu items.
	 * @return array
	 */
	private function format_menu_items( array $items ): array {
		return array_map(
			function ( $item ) {
				return [
					'id'       => $item->ID,
					'title'    => $item->title,
					'url'      => $item->url,
					'target'   => $item->target,
					'parent'   => (int) $item->menu_item_parent,
					'classes'  => implode( ' ', $item->classes ),
				];
			},
			$items
		);
	}
}
