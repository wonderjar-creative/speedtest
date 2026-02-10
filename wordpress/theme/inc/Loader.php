<?php
/**
 * Loader class.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc;

use ElevationTheme\Inc\Features\RestFeature;
use ElevationTheme\Inc\Features\GraphQLFeature;
use ElevationTheme\Inc\Features\PostTypesFeature;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Loader class.
 *
 * Registers all hooks and loads feature modules.
 */
class Loader {

	/**
	 * Feature instances.
	 *
	 * @var array
	 */
	private $features = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->load_features();
	}

	/**
	 * Load feature modules.
	 *
	 * @return void
	 */
	private function load_features(): void {
		$this->features = array(
			new PostTypesFeature(),
			new RestFeature(),
			new GraphQLFeature(),
		);
	}

	/**
	 * Run all hooks.
	 *
	 * @return void
	 */
	public function run(): void {
		// Theme setup.
		add_action( 'after_setup_theme', array( $this, 'theme_setup' ) );

		// Enqueue styles and scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// Run feature hooks.
		foreach ( $this->features as $feature ) {
			$feature->register();
		}
	}

	/**
	 * Theme setup.
	 *
	 * @return void
	 */
	public function theme_setup(): void {
		// Add theme support.
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );

		// Block editor support.
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'editor-styles' );
		add_theme_support( 'responsive-embeds' );
	}

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
			[],
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
	}
}
