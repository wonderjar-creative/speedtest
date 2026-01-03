<?php
/**
 * Theme functions and definitions.
 *
 * @package ProjectTheme
 * @since 1.0.0
 */

use ProjectTheme\Inc\Theme;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define version constant.
 */
define( 'PROJECT_THEME_VERSION', '1.0.0' );

/**
 * Include Composer's autoloader.
 */
require_once __DIR__ . '/vendor/autoload.php';

/**
 * Run the theme.
 */
Theme::get_instance()->run();
