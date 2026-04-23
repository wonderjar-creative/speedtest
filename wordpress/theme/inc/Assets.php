<?php
/**
 * Assets class.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Assets class.
 *
 * Handles theme style and script enqueuing.
 */
class Assets {

	/**
	 * Enqueue theme styles.
	 *
	 * @return void
	 */
	public function enqueue_styles(): void {
		// Google Fonts — loaded render-blocking (typical slow WP site).
		wp_enqueue_style(
			'elevation-google-fonts',
			'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
			array(),
			'1.0.0'
		);

		wp_enqueue_style(
			'elevation-theme-styles',
			get_template_directory_uri() . '/assets/css/theme.css',
			array( 'elevation-google-fonts' ),
			filemtime( get_template_directory() . '/assets/css/theme.css' )
		);
	}

	/**
	 * Enqueue theme scripts.
	 *
	 * Loads jQuery (render-blocking) + custom theme JS.
	 *
	 * @return void
	 */
	public function enqueue_scripts(): void {
		// Ensure jQuery is loaded (WP includes it, render-blocking in <head>).
		wp_enqueue_script( 'jquery' );

		// Theme JS — depends on jQuery, loaded in footer.
		wp_enqueue_script(
			'elevation-theme-scripts',
			get_template_directory_uri() . '/assets/js/elevation-theme.js',
			array( 'jquery' ),
			filemtime( get_template_directory() . '/assets/js/elevation-theme.js' ),
			true
		);

		// Parent notification for iframe sync (comparison app).
		wp_enqueue_script(
			'parent-notify',
			get_template_directory_uri() . '/assets/js/parent-notify.js',
			array(),
			'1.0.0',
			true
		);
	}
}
