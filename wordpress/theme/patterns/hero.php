<?php
/**
 * Title: Hero
 * Slug: elevation-theme/hero
 * Categories: featured, banner
 * Keywords: hero, banner, header
 *
 * @package ElevationTheme
 */

$hero_url = get_theme_file_uri( 'assets/hero.jpg' );
?>
<!-- wp:cover {"url":"<?php echo esc_url( $hero_url ); ?>","dimRatio":60,"overlayColor":"gray-900","isUserOverlayColor":true,"minHeight":80,"minHeightUnit":"vh","align":"full","priority":true,"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<div class="wp-block-cover alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);min-height:80vh"><span aria-hidden="true" class="wp-block-cover__background has-gray-900-background-color has-background-dim-60 has-background-dim"></span><img class="wp-block-cover__image-background" alt="Modern architecture interior" src="<?php echo esc_url( $hero_url ); ?>" data-object-fit="cover"/>
<div class="wp-block-cover__inner-container">
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3rem, calc(2.704rem + 1.481vw), 4rem)"}},"textColor":"white"} -->
<h1 class="wp-block-heading has-text-align-center has-white-color has-text-color" style="font-size:clamp(3rem, calc(2.704rem + 1.481vw), 4rem)">Elevation Design Studio</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}},"textColor":"white"} -->
<p class="has-text-align-center has-white-color has-text-color" style="font-size:1.25rem">Architecture &amp; Interior Design that elevates your space</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","textColor":"gray-300"} -->
<p class="has-text-align-center has-gray-300-color has-text-color">Award-winning residential and commercial design across Colorado since 2010</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)">
<!-- wp:button {"backgroundColor":"primary","textColor":"white","url":"/portfolio"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-white-color has-primary-background-color has-text-color has-background wp-element-button" href="/portfolio">View Our Work</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline","url":"/contact"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/contact">Contact Us</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
</div>
<!-- /wp:cover -->
