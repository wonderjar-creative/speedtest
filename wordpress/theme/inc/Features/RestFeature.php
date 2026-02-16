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
 * Registers custom REST API endpoints for headless frontend.
 */
class RestFeature {

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'rest_api_init', array( $this, 'register_endpoints' ) );
	}

	/**
	 * Register REST API endpoints.
	 *
	 * @return void
	 */
	public function register_endpoints(): void {
		// Full structure (used by fetch script at build/dev time).
		register_rest_route(
			'template-structure/v1',
			'/full',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_template_structure' ),
				'permission_callback' => '__return_true',
			)
		);

		// Individual endpoints (used by ISR fetchers at runtime).
		register_rest_route(
			'template-structure/v1',
			'/templates/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_single_template' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/parts/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_single_part' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/patterns/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_single_pattern' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Get full template structure for frontend caching.
	 *
	 * Returns all templates, parts, patterns, and navigation keyed by slug.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_template_structure(): \WP_REST_Response {
		$data = array(
			'templates'  => $this->get_templates(),
			'parts'      => $this->get_template_parts(),
			'patterns'   => $this->get_patterns(),
			'navigation' => $this->get_navigation_menus(),
		);

		return new \WP_REST_Response( $data, 200 );
	}

	/**
	 * Get a single template by slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response
	 */
	public function get_single_template( \WP_REST_Request $request ): \WP_REST_Response {
		$slug      = $request->get_param( 'slug' );
		$templates = $this->get_templates();

		if ( ! isset( $templates[ $slug ] ) ) {
			return new \WP_REST_Response( array( 'error' => 'Template not found' ), 404 );
		}

		return new \WP_REST_Response( $templates[ $slug ], 200 );
	}

	/**
	 * Get a single template part by slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response
	 */
	public function get_single_part( \WP_REST_Request $request ): \WP_REST_Response {
		$slug  = $request->get_param( 'slug' );
		$parts = $this->get_template_parts();

		if ( ! isset( $parts[ $slug ] ) ) {
			return new \WP_REST_Response( array( 'error' => 'Template part not found' ), 404 );
		}

		return new \WP_REST_Response( $parts[ $slug ], 200 );
	}

	/**
	 * Get a single pattern by slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response
	 */
	public function get_single_pattern( \WP_REST_Request $request ): \WP_REST_Response {
		$slug     = $request->get_param( 'slug' );
		$patterns = $this->get_patterns();

		if ( ! isset( $patterns[ $slug ] ) ) {
			return new \WP_REST_Response( array( 'error' => 'Pattern not found' ), 404 );
		}

		return new \WP_REST_Response( $patterns[ $slug ], 200 );
	}

	/**
	 * Transform parse_blocks() output to frontend-compatible format.
	 *
	 * Converts WordPress block format (blockName/attrs/innerHTML) to the
	 * format expected by getBlockComponents (name/attributes/saveContent).
	 *
	 * @param array $blocks Raw blocks from parse_blocks().
	 * @return array Transformed blocks.
	 */
	private function transform_blocks( array $blocks ): array {
		$registry = \WP_Block_Type_Registry::get_instance();

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
							$inner_blocks = $this->transform_blocks( $block['innerBlocks'] );
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

	/**
	 * Get page templates, keyed by slug with parsed blocksJSON.
	 *
	 * @return array
	 */
	private function get_templates(): array {
		$templates = array();

		$templates_dir = get_template_directory() . '/templates';
		if ( is_dir( $templates_dir ) ) {
			$files = glob( $templates_dir . '/*.html' );
			foreach ( $files as $file ) {
				$slug = basename( $file, '.html' );
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file read.
				$content = file_get_contents( $file );
				$blocks  = parse_blocks( $content );

				$templates[ $slug ] = array(
					'slug'       => $slug,
					'blocksJSON' => wp_json_encode( $this->transform_blocks( $blocks ) ),
				);
			}
		}

		return $templates;
	}

	/**
	 * Get template parts, keyed by slug with parsed blocksJSON.
	 *
	 * @return array
	 */
	private function get_template_parts(): array {
		$template_parts = array();

		$parts_dir = get_template_directory() . '/parts';
		if ( is_dir( $parts_dir ) ) {
			$files = glob( $parts_dir . '/*.html' );
			foreach ( $files as $file ) {
				$slug = basename( $file, '.html' );
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file read.
				$content = file_get_contents( $file );
				$blocks  = parse_blocks( $content );

				$template_parts[ $slug ] = array(
					'slug'       => $slug,
					'blocksJSON' => wp_json_encode( $this->transform_blocks( $blocks ) ),
				);
			}
		}

		return $template_parts;
	}

	/**
	 * Get block patterns, keyed by slug with parsed blocksJSON.
	 *
	 * @return array
	 */
	private function get_patterns(): array {
		$patterns = array();

		$patterns_dir = get_template_directory() . '/patterns';
		if ( is_dir( $patterns_dir ) ) {
			$files = glob( $patterns_dir . '/*.php' );
			foreach ( $files as $file ) {
				$slug = basename( $file, '.php' );

				ob_start();
				include $file;
				$content = ob_get_clean();

				$blocks = parse_blocks( $content );

				$patterns[ $slug ] = array(
					'slug'       => $slug,
					'blocksJSON' => wp_json_encode( $this->transform_blocks( $blocks ) ),
				);
			}
		}

		return $patterns;
	}

	/**
	 * Get navigation menus, keyed by slug.
	 *
	 * @return array
	 */
	private function get_navigation_menus(): array {
		$menus = array();

		$nav_menus = wp_get_nav_menus();
		foreach ( $nav_menus as $menu ) {
			$items = wp_get_nav_menu_items( $menu->term_id );

			$menus[ $menu->slug ] = array(
				'id'    => $menu->term_id,
				'name'  => $menu->name,
				'slug'  => $menu->slug,
				'items' => $items ? $this->format_menu_items( $items ) : array(),
			);
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
				return array(
					'id'      => $item->ID,
					'title'   => $item->title,
					'url'     => $item->url,
					'target'  => $item->target,
					'parent'  => (int) $item->menu_item_parent,
					'classes' => implode( ' ', $item->classes ),
				);
			},
			$items
		);
	}
}
