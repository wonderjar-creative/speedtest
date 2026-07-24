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
 * Registers custom REST API endpoints and headless integration hooks.
 */
class RestFeature {

	/**
	 * Hook declarations for this feature.
	 *
	 * @return array
	 */
	public function hooks(): array {
		return array(
			array( 'filter', 'rest_url', 'home_url_as_api_url' ),
			array( 'filter', 'preview_post_link', 'set_headless_preview_link', 10, 2 ),
			array( 'filter', 'rest_prepare_page', 'set_headless_rest_preview_link', 10, 2 ),
			array( 'filter', 'rest_prepare_post', 'set_headless_rest_preview_link', 10, 2 ),
			array( 'action', 'transition_post_status', 'headless_revalidate', 10, 3 ),
			array( 'action', 'rest_api_init', 'register_api_routes' ),
			array( 'filter', 'graphql_response_headers_to_send', 'filter_graphql_cors_headers' ),
			array( 'action', 'rest_api_init', 'replace_rest_cors_handling', 15 ),
		);
	}

	/**
	 * Use site_url instead of home_url for REST API URL.
	 *
	 * @param string $url The REST API URL.
	 * @return string
	 */
	public function home_url_as_api_url( string $url ): string {
		return str_replace( home_url(), site_url(), $url );
	}

	/**
	 * Rewrite preview links to point to the headless frontend.
	 *
	 * @param string   $link The preview link.
	 * @param \WP_Post $post The post being previewed.
	 * @return string
	 */
	public function set_headless_preview_link( string $link, \WP_Post $post ): string {
		if ( ! defined( 'HEADLESS_URL' ) || ! defined( 'HEADLESS_SECRET' ) ) {
			return $link;
		}

		return add_query_arg(
			array(
				'secret' => HEADLESS_SECRET,
				'id'     => $post->ID,
			),
			esc_url_raw( HEADLESS_URL . '/api/preview' )
		);
	}

	/**
	 * Rewrite REST API preview/permalink links to point to the headless frontend.
	 *
	 * @param \WP_REST_Response $response The REST response.
	 * @param \WP_Post          $post     The post.
	 * @return \WP_REST_Response
	 */
	public function set_headless_rest_preview_link( \WP_REST_Response $response, \WP_Post $post ): \WP_REST_Response {
		if ( ! defined( 'HEADLESS_URL' ) ) {
			return $response;
		}

		if ( 'draft' === $post->post_status ) {
			$response->data['link'] = get_preview_post_link( $post );
			return $response;
		}

		if ( 'publish' === $post->post_status ) {
			$permalink = get_permalink( $post );
			if ( false !== stristr( $permalink, get_site_url() ) ) {
				$response->data['link'] = str_ireplace(
					get_site_url(),
					HEADLESS_URL,
					$permalink
				);
			}
		}

		return $response;
	}

	/**
	 * Trigger ISR revalidation on the headless frontend when post status changes.
	 *
	 * @param string $new_status New post status.
	 * @param string $old_status Old post status.
	 * @param object $post       The post object.
	 * @return void
	 */
	public function headless_revalidate( string $new_status, string $old_status, object $post ): void {
		if ( ! defined( 'HEADLESS_URL' ) || ! defined( 'HEADLESS_SECRET' ) ) {
			return;
		}

		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ( defined( 'DOING_CRON' ) && DOING_CRON ) ) {
			return;
		}

		if ( ( 'draft' === $new_status && 'draft' === $old_status ) || 'inherit' === $new_status ) {
			return;
		}

		$data = wp_json_encode(
			array(
				'tags' => array( 'wordpress' ),
			)
		);

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
			error_log( $response->get_error_message() );
		}
	}

	/**
	 * Register all REST API routes.
	 *
	 * @return void
	 */
	public function register_api_routes(): void {
		$this->register_template_structure_routes();
		$this->register_block_routes();
	}

	/**
	 * Allowed frontend origins.
	 *
	 * Derived from the HEADLESS_URL constant, with localhost allowed for local
	 * dev. Preserves the site's existing derivation (staging URLs also allow the
	 * production and www variants).
	 *
	 * @return string[]
	 */
	public function allowed_origins(): array {
		$origins = array( 'http://localhost:3000' );

		if ( defined( 'HEADLESS_URL' ) && HEADLESS_URL ) {
			$headless  = untrailingslashit( HEADLESS_URL );
			$origins[] = $headless;

			if ( false !== strpos( $headless, 'staging.' ) ) {
				$origins[] = str_replace( 'staging.', '', $headless );
				$origins[] = str_replace( 'staging.', 'www.', $headless );
			} else {
				$origins[] = str_replace( 'https://', 'https://www.', $headless );
			}
		}

		return array_unique( $origins );
	}

	/**
	 * The request's Origin, if it is on the allowlist.
	 *
	 * @return string|null The allowed origin, or null when absent or disallowed.
	 */
	private function resolve_allowed_origin(): ?string {
		$origin = isset( $_SERVER['HTTP_ORIGIN'] )
			? esc_url_raw( wp_unslash( $_SERVER['HTTP_ORIGIN'] ) )
			: '';

		if ( ! $origin ) {
			return null;
		}

		$origin = untrailingslashit( $origin );

		return in_array( $origin, $this->allowed_origins(), true ) ? $origin : null;
	}

	/**
	 * Replace WPGraphQL's wildcard CORS headers with the allowlist.
	 *
	 * @param array $headers Headers WPGraphQL intends to send.
	 * @return array
	 */
	public function filter_graphql_cors_headers( array $headers ): array {
		unset( $headers['Access-Control-Allow-Origin'] );
		unset( $headers['Access-Control-Allow-Credentials'] );

		$headers['Vary'] = 'Origin';

		$origin = $this->resolve_allowed_origin();

		if ( ! $origin ) {
			return $headers;
		}

		$headers['Access-Control-Allow-Origin']      = $origin;
		$headers['Access-Control-Allow-Credentials'] = 'true';

		return $headers;
	}

	/**
	 * Swap core's origin-reflecting CORS handler for the allowlist.
	 *
	 * Core registers rest_send_cors_headers on rest_pre_serve_request from
	 * rest_api_init at priority 10. This runs at 15 so the filter exists to remove.
	 *
	 * @return void
	 */
	public function replace_rest_cors_handling(): void {
		remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
		add_filter( 'rest_pre_serve_request', array( $this, 'send_rest_cors_headers' ) );
	}

	/**
	 * Emit REST CORS headers for allowed origins only.
	 *
	 * The methods, headers, and max-age match what this site sent before the
	 * allowlist was introduced. The vulnerability was which ORIGINS were trusted,
	 * not which verbs or headers were permitted, so narrowing those would break
	 * live browser calls (X-Requested-With is sent by jQuery by default) and cost
	 * a preflight round trip on every request. X-WP-Nonce and the exposed
	 * pagination headers are the only additions.
	 *
	 * @param bool $served Whether the request has already been served.
	 * @return bool Unmodified, so the REST server continues as normal.
	 */
	public function send_rest_cors_headers( $served ) {
		header( 'Vary: Origin', false );

		$origin = $this->resolve_allowed_origin();

		if ( $origin ) {
			header( 'Access-Control-Allow-Origin: ' . $origin );
			header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce' );
			header( 'Access-Control-Allow-Credentials: true' );
			header( 'Access-Control-Max-Age: 86400' );
			header( 'Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages, Link' );
		}

		return $served;
	}

	/**
	 * Register template structure REST routes.
	 *
	 * @return void
	 */
	private function register_template_structure_routes(): void {
		// Full structure (used by fetch script at build/dev time).
		register_rest_route(
			'template-structure/v1',
			'/full',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_full_template_structure' ),
				'permission_callback' => '__return_true',
			)
		);

		// Individual endpoints (used by ISR fetchers at runtime).
		register_rest_route(
			'template-structure/v1',
			'/templates/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_template_structure_template' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/parts/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_template_structure_part' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'template-structure/v1',
			'/patterns/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_template_structure_pattern' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Register block-related REST routes.
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

		register_rest_route(
			'blocks/v1',
			'/navigation/slug/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_navigation_data_by_slug' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Get navigation block data by wp_navigation post slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return array|\WP_Error
	 */
	public function get_navigation_data_by_slug( \WP_REST_Request $request ) {
		$slug     = $request->get_param( 'slug' );
		$nav_post = get_page_by_path( $slug, OBJECT, 'wp_navigation' );

		if ( ! $nav_post ) {
			return new \WP_Error(
				'navigation_not_found',
				'Navigation with the specified slug not found',
				array( 'status' => 404 )
			);
		}

		$blocks = parse_blocks( $nav_post->post_content );
		$blocks = self::render_dynamic_blocks( $blocks );
		$blocks = self::normalize_block_keys( $blocks );

		return array(
			'id'     => $nav_post->ID,
			'title'  => $nav_post->post_title,
			'blocks' => array_values( $blocks ),
		);
	}

	/**
	 * Get full template structure for frontend caching.
	 *
	 * @return array
	 */
	public function get_full_template_structure(): array {
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
					if ( '.' === $f || '..' === $f ) {
						return false;
					}
					$ext = pathinfo( $f, PATHINFO_EXTENSION );
					if ( 'patterns' === $type ) {
						return in_array( $ext, array( 'php', 'html' ), true );
					}
					return 'html' === $ext;
				}
			);

			$result[ $type ] = array();
			foreach ( $files as $file ) {
				$slug      = pathinfo( $file, PATHINFO_FILENAME );
				$file_path = $dir . '/' . $file;

				$content = self::read_template_file( $file_path );
				if ( false === $content ) {
					continue;
				}

				$content = self::strip_php_docblock( $content );
				$content = self::normalize_line_breaks( $content );

				$blocks = parse_blocks( trim( $content ) );
				$blocks = self::render_dynamic_blocks( $blocks );
				$blocks = self::normalize_block_keys( $blocks );
				$blocks = array_values( $blocks );

				$result[ $type ][ $slug ] = array(
					'slug'       => $slug,
					'content'    => $content,
					'blocks'     => $blocks,
					'blocksJSON' => wp_json_encode( $blocks ),
				);
			}
		}

		return $result;
	}

	/**
	 * Get a single template by slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return array|\WP_REST_Response
	 */
	public function get_template_structure_template( \WP_REST_Request $request ) {
		$slug = $request['slug'];
		$file = get_template_directory() . '/templates/' . $slug . '.html';

		return $this->get_single_structure_item( $file, $slug );
	}

	/**
	 * Get a single template part by slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return array|\WP_REST_Response
	 */
	public function get_template_structure_part( \WP_REST_Request $request ) {
		$slug = $request['slug'];
		$file = get_template_directory() . '/parts/' . $slug . '.html';

		return $this->get_single_structure_item( $file, $slug );
	}

	/**
	 * Get a single pattern by slug.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return array|\WP_REST_Response
	 */
	public function get_template_structure_pattern( \WP_REST_Request $request ) {
		$slug      = $request['slug'];
		$base      = get_template_directory() . '/patterns';
		$file_html = $base . '/' . $slug . '.html';
		$file_php  = $base . '/' . $slug . '.php';

		if ( file_exists( $file_html ) ) {
			return $this->get_single_structure_item( $file_html, $slug );
		} elseif ( file_exists( $file_php ) ) {
			return $this->get_single_structure_item( $file_php, $slug );
		}

		return new \WP_REST_Response( array( 'error' => 'Pattern not found' ), 404 );
	}

	/**
	 * Parse a single template/part/pattern file and return structured data.
	 *
	 * @param string $file File path.
	 * @param string $slug The slug.
	 * @return array|\WP_REST_Response
	 */
	private function get_single_structure_item( string $file, string $slug ) {
		if ( ! file_exists( $file ) ) {
			return new \WP_REST_Response( array( 'error' => 'Not found' ), 404 );
		}

		$content = self::read_template_file( $file );
		if ( false === $content ) {
			return new \WP_REST_Response( array( 'error' => 'Could not read file' ), 500 );
		}

		$content = self::strip_php_docblock( $content );
		$content = self::normalize_line_breaks( $content );

		$blocks = parse_blocks( trim( $content ) );
		$blocks = self::render_dynamic_blocks( $blocks );
		$blocks = self::normalize_block_keys( $blocks );
		$blocks = array_values( $blocks );

		return array(
			'slug'       => $slug,
			'content'    => $content,
			'blocks'     => $blocks,
			'blocksJSON' => wp_json_encode( $blocks ),
		);
	}

	/**
	 * Get navigation block data by post ID.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return array|\WP_Error
	 */
	public function get_navigation_data( \WP_REST_Request $request ) {
		$nav_id   = $request->get_param( 'id' );
		$nav_post = get_post( $nav_id );

		if ( ! $nav_post || 'wp_navigation' !== $nav_post->post_type ) {
			return new \WP_Error(
				'navigation_not_found',
				'Navigation with the specified ID not found',
				array( 'status' => 404 )
			);
		}

		$content = $nav_post->post_content;
		$blocks  = parse_blocks( $content );
		$blocks  = self::render_dynamic_blocks( $blocks );
		$blocks  = self::normalize_block_keys( $blocks );

		return array(
			'id'     => $nav_post->ID,
			'title'  => $nav_post->post_title,
			'blocks' => array_values( $blocks ),
		);
	}

	/**
	 * Read a template/pattern file, executing PHP if needed.
	 *
	 * For .php files, uses output buffering to execute inline PHP
	 * (e.g. <?php echo date('Y'); ?>) before returning the content.
	 *
	 * @param string $file_path Absolute file path.
	 * @return string|false File content or false on failure.
	 */
	private static function read_template_file( string $file_path ) {
		if ( ! file_exists( $file_path ) ) {
			return false;
		}

		if ( '.php' === substr( $file_path, -4 ) ) {
			ob_start();
			include $file_path;
			return ob_get_clean();
		}

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file read.
		return file_get_contents( $file_path );
	}

	/**
	 * Strip PHP docblock header from pattern files.
	 *
	 * @param string $content File content.
	 * @return string
	 */
	private static function strip_php_docblock( string $content ): string {
		if ( preg_match( '/<\?php(.*?)\?>/s', $content, $matches ) ) {
			$content = str_replace( $matches[0], '', $content );
		}
		return $content;
	}

	/**
	 * Normalize line breaks in template content.
	 *
	 * @param string $content File content.
	 * @return string
	 */
	private static function normalize_line_breaks( string $content ): string {
		$content = preg_replace( '/\r\n|\r|\n/', '', $content );
		$content = preg_replace( '/\n{2,}/', "\n", $content );
		return $content;
	}

	/**
	 * Check if a block is dynamic (server-rendered).
	 *
	 * Excludes template-part and pattern blocks since those are resolved
	 * on the frontend, not rendered server-side.
	 *
	 * @param string $block_name The block name.
	 * @return bool
	 */
	private static function is_dynamic_block( string $block_name ): bool {
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );

		// Template parts and patterns are resolved on the frontend.
		if ( 'core/template-part' === $block_name || 'core/pattern' === $block_name ) {
			return false;
		}

		return $block_type && $block_type->is_dynamic();
	}

	/**
	 * Render dynamic blocks and tag them with isDynamic/dynamicContent.
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

				if ( isset( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = array_values( self::render_dynamic_blocks( $block['innerBlocks'] ) );
				}

				return $block;
			},
			$blocks
		);
	}

	/**
	 * Normalize WordPress block keys to frontend-compatible format.
	 *
	 * BlockName -> name, attrs -> attributes, innerHTML -> saveContent.
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

				if ( isset( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = array_values( self::normalize_block_keys( $block['innerBlocks'] ) );
				}

				return $block;
			},
			$blocks
		);
	}
}
