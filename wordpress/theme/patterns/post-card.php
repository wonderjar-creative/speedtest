<?php
/**
 * Title: Post Card
 * Slug: elevation-theme/post-card
 * Categories: posts
 * Keywords: blog, post, card
 */
?>
<!-- wp:group {"style":{"spacing":{"blockGap":"0"},"border":{"radius":"0.5rem"},"shadow":"0 4px 6px -1px rgb(0 0 0 / 0.1)"},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group has-white-background-color has-background" style="border-radius:0.5rem;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1)">
    <!-- wp:image {"aspectRatio":"16/9","scale":"cover","style":{"border":{"radius":{"topLeft":"0.5rem","topRight":"0.5rem"}}}} -->
    <figure class="wp-block-image" style="border-top-left-radius:0.5rem;border-top-right-radius:0.5rem"><img alt="" style="aspect-ratio:16/9;object-fit:cover"/></figure>
    <!-- /wp:image -->

    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","right":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"default"}} -->
    <div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)">
        <!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","fontWeight":"600"}},"fontSize":"xs","textColor":"primary"} -->
        <p class="has-primary-color has-text-color has-xs-font-size" style="font-weight:600;text-transform:uppercase">Category</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading {"level":3,"style":{"typography":{"fontWeight":"600"}},"fontSize":"xl"} -->
        <h3 class="wp-block-heading has-xl-font-size" style="font-weight:600">Post Title Goes Here</h3>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"textColor":"gray-500","fontSize":"sm"} -->
        <p class="has-gray-500-color has-text-color has-sm-font-size">A brief excerpt of the post content that gives readers a preview of what to expect...</p>
        <!-- /wp:paragraph -->

        <!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"fontSize":"xs","textColor":"gray-500"} -->
        <div class="wp-block-group has-gray-500-color has-text-color has-xs-font-size">
            <!-- wp:paragraph -->
            <p>Jan 15, 2024</p>
            <!-- /wp:paragraph -->
            <!-- wp:paragraph -->
            <p>By Author Name</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
