<?php
/**
 * Title: Hero
 * Slug: elevation-theme/hero
 * Categories: featured, banner
 * Keywords: hero, banner, header
 */
?>
<!-- wp:cover {"url":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80","dimRatio":60,"overlayColor":"gray-900","isUserOverlayColor":true,"minHeight":600,"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<div class="wp-block-cover alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);min-height:600px">
    <span aria-hidden="true" class="wp-block-cover__background has-gray-900-background-color has-background-dim-60 has-background-dim"></span>
    <img class="wp-block-cover__image-background" alt="Modern architecture interior" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" data-object-fit="cover"/>
    <div class="wp-block-cover__inner-container">
        <!-- wp:group {"layout":{"type":"constrained"}} -->
        <div class="wp-block-group">
            <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"4rem"}},"textColor":"white"} -->
            <h1 class="wp-block-heading has-text-align-center has-white-color has-text-color" style="font-size:4rem">Elevation Design Studio</h1>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}},"textColor":"gray-300"} -->
            <p class="has-text-align-center has-gray-300-color has-text-color" style="font-size:1.25rem">Architecture &amp; Interior Design that elevates your space</p>
            <!-- /wp:paragraph -->

            <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
            <div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)">
                <!-- wp:button {"backgroundColor":"primary","textColor":"white"} -->
                <div class="wp-block-button"><a class="wp-block-button__link has-white-color has-primary-background-color has-text-color has-background wp-element-button">View Our Work</a></div>
                <!-- /wp:button -->

                <!-- wp:button {"className":"is-style-outline"} -->
                <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">Contact Us</a></div>
                <!-- /wp:button -->
            </div>
            <!-- /wp:buttons -->
        </div>
        <!-- /wp:group -->
    </div>
</div>
<!-- /wp:cover -->
