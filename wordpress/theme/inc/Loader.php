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
	private array $features = [];

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
		$this->features = [
			new RestFeature(),
			new GraphQLFeature(),
		];
	}

	/**
	 * Run all hooks.
	 *
	 * @return void
	 */
	public function run(): void {
		// Theme setup.
		add_action( 'after_setup_theme', [ $this, 'theme_setup' ] );

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
		add_theme_support( 'html5', [ 'search-form', 'gallery', 'caption', 'style', 'script' ] );

		// Block editor support.
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'editor-styles' );
		add_theme_support( 'responsive-embeds' );
	}
}
