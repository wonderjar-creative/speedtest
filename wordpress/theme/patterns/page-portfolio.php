<?php
/**
 * Title: Page: Portfolio
 * Slug: elevation-theme/page-portfolio
 * Categories: pages
 * Keywords: portfolio, projects, gallery
 * Post Types: page
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
<!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center">Our Portfolio</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"gray-500","fontSize":"lg"} -->
<p class="has-text-align-center has-gray-500-color has-text-color has-lg-font-size">Explore our recent projects and transformations</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"0","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull" style="padding-top:0;padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50)">
<!-- wp:query {"queryId":4,"query":{"postType":"project","perPage":9,"order":"desc","orderBy":"date"}} -->
<div class="wp-block-query">
<!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:pattern {"slug":"elevation-theme/project-card"} /-->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
<p class="has-text-align-center has-gray-500-color has-text-color">No projects found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</div>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"elevation-theme/cta"} /-->
