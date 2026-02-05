<?php
/**
 * Title: Post Grid
 * Slug: elevation-theme/post-grid
 * Categories: posts
 * Keywords: blog, posts, grid, archive
 */
?>
<!-- wp:query {"queryId":1,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"layout":{"type":"default"}} -->
<div class="wp-block-query">
    <!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
        <!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"},"border":{"radius":"0.5rem"}},"backgroundColor":"white","layout":{"type":"default"}} -->
        <div class="wp-block-group has-white-background-color has-background" style="border-radius:0.5rem">
            <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":{"topLeft":"0.5rem","topRight":"0.5rem"}}}} /-->

            <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"default"}} -->
            <div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
                <!-- wp:post-terms {"term":"category","style":{"typography":{"textTransform":"uppercase","fontWeight":"600"}},"fontSize":"xs","textColor":"primary"} /-->

                <!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontWeight":"600"}},"fontSize":"lg"} /-->

                <!-- wp:post-excerpt {"excerptLength":20,"moreText":"","showMoreOnNewLine":false,"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"textColor":"gray-500","fontSize":"sm"} /-->

                <!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"fontSize":"xs","textColor":"gray-500"} -->
                <div class="wp-block-group has-gray-500-color has-text-color has-xs-font-size">
                    <!-- wp:post-date /-->
                    <!-- wp:post-author {"showAvatar":false} /-->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
        </div>
        <!-- /wp:group -->
    <!-- /wp:post-template -->

    <!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|60"}}}} -->
        <!-- wp:query-pagination-previous /-->
        <!-- wp:query-pagination-numbers /-->
        <!-- wp:query-pagination-next /-->
    <!-- /wp:query-pagination -->

    <!-- wp:query-no-results -->
        <!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
        <p class="has-text-align-center has-gray-500-color has-text-color">No posts found.</p>
        <!-- /wp:paragraph -->
    <!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
