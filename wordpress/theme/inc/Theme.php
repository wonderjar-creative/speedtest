<?php
/**
 * Main Theme class.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc;

use ElevationTheme\Inc\Features\BlockBindingsFeature;
use ElevationTheme\Inc\Features\BlockExtensionsFeature;
use ElevationTheme\Inc\Features\GraphQLFeature;
use ElevationTheme\Inc\Features\PostTypesFeature;
use ElevationTheme\Inc\Features\RestFeature;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme class.
 *
 * Singleton that owns the hook Loader, asset handler, and feature modules,
 * wires every callback through the Loader, and runs them.
 */
class Theme {

	/**
	 * The single instance of this class.
	 *
	 * @var Theme|null
	 */
	private static $instance = null;

	/**
	 * The hook loader.
	 *
	 * @var Loader
	 */
	private $loader;

	/**
	 * The asset handler.
	 *
	 * @var Assets
	 */
	private $assets;

	/**
	 * Feature instances.
	 *
	 * @var array
	 */
	private $features = array();

	/**
	 * Get the singleton instance.
	 *
	 * @return Theme
	 */
	public static function get_instance(): Theme {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Private constructor to prevent direct instantiation.
	 */
	private function __construct() {
		$this->loader   = new Loader();
		$this->assets   = new Assets();
		$this->features = array(
			new PostTypesFeature(),
			new RestFeature(),
			new GraphQLFeature(),
			new BlockBindingsFeature(),
			new BlockExtensionsFeature(),
		);
	}

	/**
	 * Run the theme.
	 *
	 * @return void
	 */
	public function run(): void {
		$this->define_hooks();
		$this->loader->run();
	}

	/**
	 * Wire all theme, asset, and feature callbacks into the Loader.
	 *
	 * @return void
	 */
	private function define_hooks(): void {
		$this->loader->add_action( 'after_setup_theme', $this, 'theme_setup' );
		$this->loader->add_action( 'wp_enqueue_scripts', $this->assets, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $this->assets, 'enqueue_scripts' );

		foreach ( $this->features as $feature ) {
			foreach ( $feature->hooks() as $hook ) {
				$type          = $hook[0];
				$name          = $hook[1];
				$callback      = $hook[2];
				$priority      = $hook[3] ?? 10;
				$accepted_args = $hook[4] ?? 1;

				if ( 'action' === $type ) {
					$this->loader->add_action( $name, $feature, $callback, $priority, $accepted_args );
				} else {
					$this->loader->add_filter( $name, $feature, $callback, $priority, $accepted_args );
				}
			}
		}
	}

	/**
	 * Theme setup.
	 *
	 * @return void
	 */
	public function theme_setup(): void {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );

		// Block editor support.
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'editor-styles' );
		add_theme_support( 'responsive-embeds' );
	}

	/**
	 * Get the loader instance.
	 *
	 * @return Loader
	 */
	public function get_loader(): Loader {
		return $this->loader;
	}
}
