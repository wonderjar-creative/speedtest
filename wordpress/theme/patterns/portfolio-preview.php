<?php
/**
 * Title: Portfolio Preview
 * Slug: elevation-theme/portfolio-preview
 * Categories: featured, portfolio
 * Keywords: portfolio, gallery, projects
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50)">
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center">Featured Projects</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
<p class="has-text-align-center has-gray-500-color has-text-color">A selection of our recent work</p>
<!-- /wp:paragraph -->

<!-- wp:query {"queryId":3,"query":{"postType":"project","perPage":3,"order":"desc","orderBy":"date"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-query" style="margin-top:var(--wp--preset--spacing--50)">
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

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--50)">
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">View All Projects</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
