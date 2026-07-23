<?php
/**
 * SecurityFeature class file.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc\Features;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Baseline hardening for a headless backend.
 *
 * Owns app-level concerns only: security headers, REST user-enumeration
 * blocking, and generator hiding. XML-RPC, login protection, and rate limiting
 * are handled at the Cloudflare edge, not here.
 */
class SecurityFeature {

	/**
	 * Hook declarations for this feature.
	 *
	 * Headers register on init, not send_headers: the REST API dispatches on
	 * parse_request and WPGraphQL's Router intercepts equally early, and both
	 * die() before send_headers fires from WP::main(). init covers every request.
	 *
	 * @return array
	 */
	public function hooks(): array {
		return array(
			array( 'action', 'init', 'add_security_headers' ),
			array( 'action', 'init', 'remove_unnecessary_headers' ),
			array( 'action', 'init', 'remove_wp_version_head' ),
			array( 'filter', 'the_generator', 'hide_wp_version' ),
			array( 'filter', 'rest_endpoints', 'restrict_user_endpoints' ),
		);
	}

	/**
	 * Send baseline security headers.
	 *
	 * @return void
	 */
	public function add_security_headers(): void {
		if ( headers_sent() ) {
			return;
		}

		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'Referrer-Policy: strict-origin-when-cross-origin' );
		header( 'Permissions-Policy: geolocation=(), microphone=(), camera=()' );
	}

	/**
	 * Remove header/discovery output that leaks information or is unused headless.
	 *
	 * @return void
	 */
	public function remove_unnecessary_headers(): void {
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
		remove_action( 'wp_head', 'rest_output_link_wp_head' );
		remove_action( 'template_redirect', 'rest_output_link_header', 11 );
	}

	/**
	 * Stop advertising the WordPress version via wp_head.
	 *
	 * @return void
	 */
	public function remove_wp_version_head(): void {
		remove_action( 'wp_head', 'wp_generator' );
	}

	/**
	 * Blank the generator string used by feeds and other non-wp_head output.
	 *
	 * @return string
	 */
	public function hide_wp_version(): string {
		return '';
	}

	/**
	 * Gate the REST user endpoints behind list_users to block enumeration.
	 *
	 * @param array $endpoints The REST API endpoints.
	 * @return array
	 */
	public function restrict_user_endpoints( array $endpoints ): array {
		$routes = array( '/wp/v2/users', '/wp/v2/users/(?P<id>[\d]+)' );

		foreach ( $routes as $route ) {
			if ( ! isset( $endpoints[ $route ] ) ) {
				continue;
			}

			foreach ( $endpoints[ $route ] as $key => $endpoint ) {
				if ( is_array( $endpoint ) && isset( $endpoint['callback'] ) ) {
					$endpoints[ $route ][ $key ]['permission_callback'] = function () {
						return current_user_can( 'list_users' );
					};
				}
			}
		}

		return $endpoints;
	}
}
