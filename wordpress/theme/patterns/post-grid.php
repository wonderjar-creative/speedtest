<?php
/**
 * Title: Post Grid
 * Slug: elevation-theme/post-grid
 * Categories: posts, query
 * Keywords: posts, grid, blog, archive
 * Block Types: core/query
 */
?>
<!-- wp:query {"queryId":1,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"align":"wide","layout":{"type":"default"}} -->
<div class="wp-block-query alignwide">
    <!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"grid","columnCount":3}} -->
    <!-- wp:pattern {"slug":"elevation-theme/post-card"} /-->
    <!-- /wp:post-template -->

    <!-- wp:query-pagination {"paginationArrow":"arrow","style":{"spacing":{"margin":{"top":"var:preset|spacing|60"}}},"layout":{"type":"flex","justifyContent":"center"}} -->
    <!-- wp:query-pagination-previous /-->
    <!-- wp:query-pagination-numbers /-->
    <!-- wp:query-pagination-next /-->
    <!-- /wp:query-pagination -->

    <!-- wp:query-no-results -->
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
        <!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
        <p class="has-text-align-center has-gray-500-color has-text-color">No posts found. Check back soon for new content.</p>
        <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
    <!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
