<?php
/**
 * Title: Header
 * Slug: elevation-theme/header
 * Categories: header
 * Keywords: header, navigation, logo
 * Block Types: core/template-part/header
 *
 * @package ElevationTheme
 */

// Resolve the primary navigation by slug so the pattern survives image rebuilds —
// the wp_navigation post ID is environment-specific and not safe to hardcode.
$elevation_nav      = get_page_by_path( 'primary', OBJECT, 'wp_navigation' );
$elevation_nav_ref  = $elevation_nav ? (int) $elevation_nav->ID : 0;
$elevation_nav_attr = $elevation_nav_ref ? '"ref":' . $elevation_nav_ref . ',' : '';

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--50)"><!-- wp:group {"style":{"spacing":{"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group" style="margin-top:0;margin-bottom:0"><!-- wp:site-title {"style":{"typography":{"fontWeight":"700"},"spacing":{"margin":{"top":"0","bottom":"0"}}},"textColor":"gray-900"} /-->

<!-- wp:navigation {<?php echo $elevation_nav_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>"textColor":"gray-900","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","justifyContent":"right"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->