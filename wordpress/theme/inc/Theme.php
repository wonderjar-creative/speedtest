<?php
/**
 * Main Theme class.
 *
 * @package ProjectTheme
 * @since 1.0.0
 */

namespace ProjectTheme\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme class.
 *
 * Singleton pattern for theme initialization.
 */
class Theme {

	/**
	 * The single instance of this class.
	 *
	 * @var Theme|null
	 */
	private static ?Theme $instance = null;

	/**
	 * The loader instance.
	 *
	 * @var Loader|null
	 */
	private ?Loader $loader = null;

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
		$this->loader = new Loader();
	}

	/**
	 * Run the theme.
	 *
	 * @return void
	 */
	public function run(): void {
		$this->loader->run();
	}

	/**
	 * Get the loader instance.
	 *
	 * @return Loader|null
	 */
	public function get_loader(): ?Loader {
		return $this->loader;
	}
}
