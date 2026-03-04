<?php
/**
 * Title: Testimonial Card
 * Slug: elevation-theme/testimonial-card
 * Categories: testimonials
 * Keywords: testimonial, review, card
 * Block Types: core/post-template
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}},"backgroundColor":"gray-100","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-gray-100-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40)">
<!-- wp:paragraph {"textColor":"primary","fontSize":"sm","metadata":{"bindings":{"content":{"source":"elevation/post-meta","args":{"key":"rating"}}}}} -->
<p class="has-primary-color has-text-color has-sm-font-size"></p>
<!-- /wp:paragraph -->

<!-- wp:post-content {"style":{"typography":{"fontStyle":"italic"}},"textColor":"gray-900"} /-->

<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--30)">
<!-- wp:post-featured-image {"width":"50px","height":"50px","scale":"cover","className":"is-style-rounded","style":{"border":{"radius":"50%"}}} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:paragraph {"textColor":"gray-900","fontSize":"sm","metadata":{"bindings":{"content":{"source":"elevation/post-meta","args":{"key":"author_name"}}}}} -->
<p class="has-gray-900-color has-text-color has-sm-font-size"><strong></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"textColor":"gray-500","fontSize":"sm","metadata":{"bindings":{"content":{"source":"elevation/post-meta","args":{"key":"author_role"}}}}} -->
<p class="has-gray-500-color has-text-color has-sm-font-size"></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
