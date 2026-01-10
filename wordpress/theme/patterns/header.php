<?php
/**
 * Title: Header
 * Slug: elevation-theme/header
 * Categories: header
 * Keywords: header, navigation, logo
 * Block Types: core/template-part/header
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50)">
    <!-- wp:group {"style":{"spacing":{"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
    <div class="wp-block-group" style="margin-top:0;margin-bottom:0;max-width:1400px;margin-left:auto;margin-right:auto;width:100%">
        <!-- wp:site-title {"style":{"typography":{"fontWeight":"700"},"spacing":{"margin":{"top":"0","bottom":"0"}}},"textColor":"gray-900"} /-->

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
