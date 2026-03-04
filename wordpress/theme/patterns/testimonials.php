<?php
/**
 * Title: Testimonials
 * Slug: elevation-theme/testimonials
 * Categories: featured, testimonials
 * Keywords: testimonials, reviews, quotes
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center">What Our Clients Say</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
<p class="has-text-align-center has-gray-500-color has-text-color">Hear from the people who have trusted us with their spaces</p>
<!-- /wp:paragraph -->

<!-- wp:query {"queryId":2,"query":{"postType":"testimonial","perPage":3,"order":"desc","orderBy":"date"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-query" style="margin-top:var(--wp--preset--spacing--50)">
<!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:pattern {"slug":"elevation-theme/testimonial-card"} /-->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
<p class="has-text-align-center has-gray-500-color has-text-color">No testimonials found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</div>
<!-- /wp:group -->
