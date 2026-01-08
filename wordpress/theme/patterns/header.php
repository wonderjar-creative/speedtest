<?php
/**
 * Title: Header
 * Slug: elevation-theme/header
 * Categories: header
 * Keywords: header, navigation, logo
 * Block Types: core/template-part/header
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-white-background-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
    <!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->
    <div class="wp-block-group">
        <!-- wp:site-title {"style":{"typography":{"fontWeight":"700"}},"textColor":"gray-900"} /-->

        <!-- wp:navigation {"textColor":"gray-700","layout":{"type":"flex","justifyContent":"right"},"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
            <!-- wp:navigation-link {"label":"Home","url":"/","kind":"custom","isTopLevelLink":true} /-->
            <!-- wp:navigation-link {"label":"About","url":"/about","kind":"custom","isTopLevelLink":true} /-->
            <!-- wp:navigation-link {"label":"Services","url":"/services","kind":"custom","isTopLevelLink":true} /-->
            <!-- wp:navigation-link {"label":"Portfolio","url":"/portfolio","kind":"custom","isTopLevelLink":true} /-->
            <!-- wp:navigation-link {"label":"Contact","url":"/contact","kind":"custom","isTopLevelLink":true} /-->
        <!-- /wp:navigation -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
