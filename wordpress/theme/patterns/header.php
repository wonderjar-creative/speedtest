<?php
/**
 * Title: Header
 * Slug: elevation-theme/header
 * Categories: header
 * Keywords: header, navigation, logo
 * Block Types: core/template-part/header
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull has-white-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--50)">
<!-- wp:group {"style":{"spacing":{"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group" style="margin-top:0;margin-bottom:0">
<!-- wp:site-title {"style":{"typography":{"fontWeight":"700"},"spacing":{"margin":{"top":"0","bottom":"0"}}},"textColor":"gray-900"} /-->

<!-- wp:navigation {"textColor":"gray-900","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","justifyContent":"right"}} -->
<!-- wp:navigation-link {"label":"Home","url":"/","kind":"custom","isTopLevelLink":true} /-->

<!-- wp:navigation-submenu {"label":"About","url":"/about","kind":"custom"} -->
<!-- wp:navigation-link {"label":"Our Story","url":"/about","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Our Team","url":"/team/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Awards & Recognition","url":"/about#awards","kind":"custom"} /-->
<!-- /wp:navigation-submenu -->

<!-- wp:navigation-submenu {"label":"Services","url":"/services","kind":"custom"} -->
<!-- wp:navigation-link {"label":"Residential Design","url":"/services#residential","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Commercial Interiors","url":"/services#commercial","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Renovation & Remodeling","url":"/services#renovation","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Consultation","url":"/services#consultation","kind":"custom"} /-->
<!-- /wp:navigation-submenu -->

<!-- wp:navigation-submenu {"label":"Portfolio","url":"/projects/","kind":"custom"} -->
<!-- wp:navigation-link {"label":"All Projects","url":"/projects/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Residential","url":"/projects/?type=residential","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Commercial","url":"/projects/?type=commercial","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Hospitality","url":"/projects/?type=hospitality","kind":"custom"} /-->
<!-- /wp:navigation-submenu -->

<!-- wp:navigation-link {"label":"Testimonials","url":"/testimonials/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Blog","url":"/blog","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Contact","url":"/contact","kind":"custom","isTopLevelLink":true} /-->
<!-- /wp:navigation -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
