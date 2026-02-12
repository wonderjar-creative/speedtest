<?php
/**
 * REST API Feature.
 *
 * Registers custom REST API endpoints for template structure,
 * block data, and navigation. Ported from wonderjar-frontend
 * template architecture.
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
		add_action( 'rest_api_init', array( $this, 'register_endpoints' ) );
		add_filter( 'preview_post_link', array( $this, 'set_headless_preview_link' ), 10, 2 );
		add_action( 'transition_post_status', array( $this, 'headless_revalidate' ), 10, 3 );
	}

	/**
	 * Register REST API endpoints.
	 *
	 * @return void
	 */
	public function register_endpoints(): void {
		$this->add_cors_headers();
		$this->register_template_structure_routes();
		$this->register_block_routes();
	}

	/**
	 * Register template structure routes.
	 *
	 * Provides endpoints for fetching templates, template parts, and patterns
	 * as normalized block JSON for the headless frontend.
	 *
	 * @return void
	 */
	private function register_template_structure_routes(): void {
		register_rest_route(
			'template-structure/v1',
			'/full',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_full_template_structure' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/templates/(?P<slug>[a-zA-Z0-9-_]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_template_by_slug' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/parts/(?P<slug>[a-zA-Z0-9-_]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_part_by_slug' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/patterns/(?P<slug>[a-zA-Z0-9-_]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_pattern_by_slug' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Register block-specific routes.
	 *
	 * @return void
	 */
	private function register_block_routes(): void {
		register_rest_route(
			'blocks/v1',
			'/navigation/(?P<id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_navigation_data' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Get full template structure.
	 *
	 * Returns all templates, template parts, and patterns as normalized
	 * block JSON. Used by the frontend for ISR caching at build time.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_full_template_structure(): \WP_REST_Response {
		$base   = get_template_directory();
		$dirs   = array(
			'templates' => $base . '/templates',
			'parts'     => $base . '/parts',
			'patterns'  => $base . '/patterns',
		);
		$result = array();

		foreach ( $dirs as $type => $dir ) {
			if ( ! is_dir( $dir ) ) {
				continue;
			}

			$files = array_filter(
				scandir( $dir ),
				function ( $f ) use ( $type ) {
					if ( 'patterns' === $type ) {
						return ! in_array( $f, array( '.', '..' ), true )
							&& in_array( pathinfo( $f, PATHINFO_EXTENSION ), array( 'php', 'html' ), true );
					}
					return ! in_array( $f, array( '.', '..' ), true )
						&& 'html' === pathinfo( $f, PATHINFO_EXTENSION );
				}
			);

			$result[ $type ] = array();

			foreach ( $files as $file ) {
				$slug    = pathinfo( $file, PATHINFO_FILENAME );
				$content = $this->read_theme_file( $dir . '/' . $file );
				if ( false === $content ) {
					continue;
				}

				$content = $this->clean_content( $content );
				$blocks  = $this->parse_and_normalize( $content );

				$result[ $type ][ $slug ] = array(
					'slug'       => $slug,
					'content'    => $content,
					'blocks'     => $blocks,
					'blocksJSON' => wp_json_encode( $blocks ),
				);
			}
		}

		return new \WP_REST_Response( $result, 200 );
	}

	/**
	 * Get a single template by slug.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_template_by_slug( \WP_REST_Request $request ) {
		$slug = $request->get_param( 'slug' );
		$file = get_template_directory() . '/templates/' . $slug . '.html';

		return $this->get_structure_item( $slug, $file );
	}

	/**
	 * Get a single template part by slug.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_part_by_slug( \WP_REST_Request $request ) {
		$slug = $request->get_param( 'slug' );
		$file = get_template_directory() . '/parts/' . $slug . '.html';

		return $this->get_structure_item( $slug, $file );
	}

	/**
	 * Get a single pattern by slug.
	 *
	 * Supports both .php and .html pattern files.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_pattern_by_slug( \WP_REST_Request $request ) {
		$slug     = $request->get_param( 'slug' );
		$base_dir = get_template_directory() . '/patterns';

		// Check .php first, then .html.
		$file_php  = $base_dir . '/' . $slug . '.php';
		$file_html = $base_dir . '/' . $slug . '.html';

		if ( file_exists( $file_php ) ) {
			return $this->get_structure_item( $slug, $file_php );
		} elseif ( file_exists( $file_html ) ) {
			return $this->get_structure_item( $slug, $file_html );
		}

		return new \WP_Error(
			'pattern_not_found',
			sprintf( 'Pattern "%s" not found.', $slug ),
			array( 'status' => 404 )
		);
	}

	/**
	 * Get navigation data from a wp_navigation post.
	 *
	 * @param \WP_REST_Request $request The REST request with 'id' parameter.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_navigation_data( \WP_REST_Request $request ) {
		$nav_id   = $request->get_param( 'id' );
		$nav_post = get_post( $nav_id );

		if ( ! $nav_post || 'wp_navigation' !== $nav_post->post_type ) {
			return new \WP_Error(
				'navigation_not_found',
				'Navigation with the specified ID not found.',
				array( 'status' => 404 )
			);
		}

		$blocks = parse_blocks( $nav_post->post_content );
		$blocks = self::render_dynamic_blocks( $blocks );
		$blocks = self::normalize_block_keys( $blocks );

		return new \WP_REST_Response(
			array(
				'id'     => $nav_post->ID,
				'title'  => $nav_post->post_title,
				'blocks' => array_values( $blocks ),
			),
			200
		);
	}

	// ──────────────────────────────────────────────
	// Internal helpers
	// ──────────────────────────────────────────────

	/**
	 * Get a single structure item (template, part, or pattern).
	 *
	 * @param string $slug The item slug.
	 * @param string $file The file path.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function get_structure_item( string $slug, string $file ) {
		$content = $this->read_theme_file( $file );
		if ( false === $content ) {
			return new \WP_Error(
				'not_found',
				sprintf( 'Item "%s" not found.', $slug ),
				array( 'status' => 404 )
			);
		}

		$content = $this->clean_content( $content );
		$blocks  = $this->parse_and_normalize( $content );

		return new \WP_REST_Response(
			array(
				'slug'       => $slug,
				'content'    => $content,
				'blocks'     => $blocks,
				'blocksJSON' => wp_json_encode( $blocks ),
			),
			200
		);
	}

	/**
	 * Read a theme file. For .php files, captures the output buffer.
	 *
	 * @param string $file The file path.
	 * @return string|false File content or false on failure.
	 */
	private function read_theme_file( string $file ) {
		if ( ! file_exists( $file ) ) {
			return false;
		}

		if ( 'php' === pathinfo( $file, PATHINFO_EXTENSION ) ) {
			ob_start();
			include $file;
			return ob_get_clean();
		}

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file read.
		return file_get_contents( $file );
	}

	/**
	 * Clean block markup content.
	 *
	 * Removes PHP docblocks and normalizes line breaks.
	 *
	 * @param string $content Raw content.
	 * @return string Cleaned content.
	 */
	private function clean_content( string $content ): string {
		// Remove PHP docblock if present.
		if ( preg_match( '/<\?php(.*?)\?>/s', $content, $matches ) ) {
			$content = str_replace( $matches[0], '', $content );
		}

		// Normalize line breaks.
		$content = preg_replace( '/\r\n|\r|\n/', '', $content );
		$content = preg_replace( '/\n{2,}/', "\n", $content );

		return trim( $content );
	}

	/**
	 * Parse content into blocks and normalize.
	 *
	 * @param string $content Block markup content.
	 * @return array Normalized block array.
	 */
	private function parse_and_normalize( string $content ): array {
		$blocks = parse_blocks( $content );
		$blocks = self::render_dynamic_blocks( $blocks );
		$blocks = self::normalize_block_keys( $blocks );
		return array_values( $blocks );
	}

	/**
	 * Check if a block type is dynamic (has a render callback).
	 *
	 * Template parts and patterns are excluded since we resolve
	 * them on the frontend.
	 *
	 * @param string $block_name The block name.
	 * @return bool
	 */
	private static function is_dynamic_block( string $block_name ): bool {
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );

		// Template parts and patterns are resolved client-side.
		if ( 'core/template-part' === $block_name || 'core/pattern' === $block_name ) {
			return false;
		}

		return $block_type && $block_type->is_dynamic();
	}

	/**
	 * Render dynamic blocks and tag them.
	 *
	 * Dynamic blocks (those with server-side render callbacks) get their
	 * rendered HTML stored in a `dynamicContent` property.
	 *
	 * @param array $blocks Parsed blocks.
	 * @return array Blocks with dynamic content rendered.
	 */
	private static function render_dynamic_blocks( array $blocks ): array {
		return array_map(
			function ( $block ) {
				if ( ! empty( $block['blockName'] ) && self::is_dynamic_block( $block['blockName'] ) ) {
					$block['isDynamic']      = true;
					$block['dynamicContent'] = render_block( $block );
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = array_values( self::render_dynamic_blocks( $block['innerBlocks'] ) );
				}

				return $block;
			},
			$blocks
		);
	}

	/**
	 * Normalize block keys for frontend consumption.
	 *
	 * Converts WordPress internal block property names to a cleaner
	 * format used by the headless frontend:
	 *   blockName  → name
	 *   attrs      → attributes
	 *   innerHTML  → saveContent
	 *
	 * @param array $blocks Blocks to normalize.
	 * @return array Normalized blocks.
	 */
	private static function normalize_block_keys( array $blocks ): array {
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
					$block['innerBlocks'] = array_values( self::normalize_block_keys( $block['innerBlocks'] ) );
				}

				return $block;
			},
			$blocks
		);
	}

	/**
	 * Customize the preview link to point to the headless frontend.
	 *
	 * @param string   $link Original preview link.
	 * @param \WP_Post $post The post object.
	 * @return string Modified preview link.
	 */
	public function set_headless_preview_link( string $link, \WP_Post $post ): string {
		if ( ! defined( 'HEADLESS_URL' ) ) {
			return $link;
		}

		return add_query_arg(
			array(
				'secret' => defined( 'HEADLESS_SECRET' ) ? HEADLESS_SECRET : '',
				'id'     => $post->ID,
			),
			esc_url_raw( HEADLESS_URL . '/api/preview' )
		);
	}

	/**
	 * Trigger ISR revalidation on the headless frontend when content changes.
	 *
	 * @param string $new_status New post status.
	 * @param string $old_status Old post status.
	 * @param object $post       The post object.
	 * @return void
	 */
	public function headless_revalidate( string $new_status, string $old_status, object $post ): void {
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ( defined( 'DOING_CRON' ) && DOING_CRON ) ) {
			return;
		}

		if ( ( 'draft' === $new_status && 'draft' === $old_status ) || 'inherit' === $new_status ) {
			return;
		}

		if ( ! defined( 'HEADLESS_URL' ) || ! defined( 'HEADLESS_SECRET' ) ) {
			return;
		}

		$data = wp_json_encode( array( 'tags' => array( 'wordpress' ) ) );

		$response = wp_remote_request(
			HEADLESS_URL . '/api/revalidate/',
			array(
				'method'  => 'PUT',
				'body'    => $data,
				'headers' => array(
					'X-Headless-Secret-Key' => HEADLESS_SECRET,
					'Content-Type'          => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- Intentional logging.
			error_log( 'Headless revalidation failed: ' . $response->get_error_message() );
		}
	}

	/**
	 * Add CORS headers for headless frontend access.
	 *
	 * @return void
	 */
	private function add_cors_headers(): void {
		$allowed_origins = array( 'http://localhost:3000' );

		if ( defined( 'HEADLESS_URL' ) ) {
			$allowed_origins[] = HEADLESS_URL;
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Sanitized below.
		$origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_ORIGIN'] ) ) : '';

		if ( empty( $origin ) ) {
			return;
		}

		if ( in_array( $origin, $allowed_origins, true ) ) {
			header( 'Access-Control-Allow-Origin: ' . $origin );
			header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
			header( 'Access-Control-Allow-Credentials: true' );
			header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With' );
			header( 'Access-Control-Max-Age: 86400' );
		}
	}
}
