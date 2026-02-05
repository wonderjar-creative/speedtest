<?php
/**
 * Title: Post Card
 * Slug: elevation-theme/post-card
 * Categories: posts
 * Keywords: post, card, blog
 */
?>
<!-- wp:group {"className":"post-card","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}},"border":{"radius":"8px","width":"1px","color":"#e5e7eb"}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group post-card has-border-color has-white-background-color has-background" style="border-color:#e5e7eb;border-width:1px;border-radius:8px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
    <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px","bottomLeft":"0px","bottomRight":"0px"}}}} /-->

    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
        <!-- wp:post-terms {"term":"category","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.05em"}},"textColor":"primary"} /-->

        <!-- wp:post-title {"isLink":true,"style":{"typography":{"fontSize":"1.125rem","fontWeight":"600","lineHeight":"1.4"}},"textColor":"gray-900"} /-->

        <!-- wp:post-excerpt {"moreText":"","excerptLength":20,"style":{"typography":{"fontSize":"0.875rem"}},"textColor":"gray-500"} /-->

        <!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
        <div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--20)">
            <!-- wp:post-date {"style":{"typography":{"fontSize":"0.75rem"}},"textColor":"gray-500"} /-->
            <!-- wp:read-more {"content":"Read More →","style":{"typography":{"fontSize":"0.75rem","fontWeight":"500"}},"textColor":"primary"} /-->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
