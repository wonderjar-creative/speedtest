<?php
/**
 * Theme functions and definitions.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

use ElevationTheme\Inc\Theme;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define version constant.
 */
define( 'ELEVATION_THEME_VERSION', '0.1.0' );

/**
 * Include Composer's autoloader.
 */
require_once __DIR__ . '/vendor/autoload.php';

/**
 * Run the theme.
 */
Theme::get_instance()->run();
