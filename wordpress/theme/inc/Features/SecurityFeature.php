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
 * Owns app-level concerns only: security headers, username enumeration blocking
 * (REST user endpoints, author archives, and the users sitemap), and generator
 * hiding. XML-RPC, login protection, and rate limiting are volumetric problems
 * the application cannot see, so they are handled at the Cloudflare edge.
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
			// Priority 0: core's redirect_canonical runs on template_redirect at 10
			// and turns ?author=N into a 301 to /author/<username>/, which is the
			// leak. Refusing the request first means it never gets to redirect.
			array( 'action', 'template_redirect', 'disable_author_archives', 0 ),
			array( 'filter', 'wp_sitemaps_add_provider', 'remove_users_sitemap', 10, 2 ),
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
	 * Gate the REST user READ endpoints behind list_users to block enumeration.
	 *
	 * Write handlers are deliberately left alone. Core gates those with
	 * create_users, edit_user, and delete_user, and enforces role comparison
	 * guards on top. Overwriting them with a list_users check would hand any
	 * custom role that holds list_users the ability to create, edit, or delete
	 * accounts over REST, which is a privilege escalation rather than hardening.
	 *
	 * At the rest_endpoints filter, $endpoint['methods'] is still the raw
	 * registered form, a comma separated string such as 'POST, PUT, PATCH',
	 * not the POST => true keyed array core builds later inside
	 * WP_REST_Server::get_routes(). A keyed lookup here never matches, so the
	 * string is parsed into a flat verb list instead (an array form is
	 * tolerated defensively in case core's normalization ever moves earlier).
	 *
	 * @param array $endpoints The REST API endpoints.
	 * @return array
	 */
	public function restrict_user_endpoints( array $endpoints ): array {
		$routes = array( '/wp/v2/users', '/wp/v2/users/(?P<id>[\d]+)' );
		$writes = array( 'POST', 'PUT', 'PATCH', 'DELETE' );

		foreach ( $routes as $route ) {
			if ( ! isset( $endpoints[ $route ] ) ) {
				continue;
			}

			foreach ( $endpoints[ $route ] as $key => $endpoint ) {
				if ( ! is_array( $endpoint ) || ! isset( $endpoint['callback'] ) ) {
					continue;
				}

				$allowed = array();
				$raw     = isset( $endpoint['methods'] ) ? $endpoint['methods'] : '';
				foreach ( (array) $raw as $mkey => $mval ) {
					$token   = is_string( $mkey ) ? $mkey : (string) $mval;
					$allowed = array_merge( $allowed, preg_split( '/[\s,]+/', strtoupper( $token ), -1, PREG_SPLIT_NO_EMPTY ) );
				}

				if ( array_intersect( $writes, $allowed ) ) {
					continue; // Leave core's create_users, edit_user, delete_user checks in place.
				}

				$endpoints[ $route ][ $key ]['permission_callback'] = function () {
					return current_user_can( 'list_users' );
				};
			}
		}

		return $endpoints;
	}

	/**
	 * Turn author archives into 404s.
	 *
	 * Requesting ?author=1 makes core redirect to /author/<username>/, which
	 * hands out a valid username to brute force. Author archives render nothing
	 * on a headless backend, so refusing them closes the most commonly scanned
	 * enumeration vector. Author fields over REST and GraphQL are unaffected.
	 *
	 * @return void
	 */
	public function disable_author_archives(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only check of a public query arg.
		if ( ! is_author() && ! isset( $_GET['author'] ) ) {
			return;
		}

		global $wp_query;

		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}

	/**
	 * Drop the users provider from core sitemaps.
	 *
	 * The wp-sitemap-users-1.xml file publishes an index of author archives,
	 * which is an enumeration vector in its own right and is meaningless on a
	 * headless backend.
	 *
	 * @param mixed  $provider The sitemap provider.
	 * @param string $name     The provider name.
	 * @return mixed False to drop the provider, otherwise the provider.
	 */
	public function remove_users_sitemap( $provider, $name ) {
		return ( 'users' === $name ) ? false : $provider;
	}
}
