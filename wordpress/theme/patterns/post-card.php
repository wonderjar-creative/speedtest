<?php
/**
 * Title: Post Card
 * Slug: elevation-theme/post-card
 * Categories: posts
 * Keywords: post, card, blog
 * Block Types: core/post-template
 */
?>
<!-- wp:group {"className":"post-card","style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}},"border":{"radius":"8px"}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group post-card has-white-background-color has-background" style="border-radius:8px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
    <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px","bottomLeft":"0px","bottomRight":"0px"}}}} /-->

    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"default"}} -->
    <div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)">
        <!-- wp:post-terms {"term":"category","style":{"typography":{"textTransform":"uppercase","fontWeight":"600"}},"fontSize":"xs","textColor":"primary"} /-->

        <!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem","lineHeight":"1.4"},"spacing":{"margin":{"top":"var:preset|spacing|20"}}}} /-->

        <!-- wp:post-excerpt {"moreText":"","excerptLength":20,"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"textColor":"gray-500","fontSize":"sm"} /-->

        <!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"},"fontSize":"xs","textColor":"gray-500"} -->
        <div class="wp-block-group has-gray-500-color has-text-color has-xs-font-size" style="margin-top:var(--wp--preset--spacing--30)">
            <!-- wp:post-date /-->
            <!-- wp:post-author {"showAvatar":false} /-->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
