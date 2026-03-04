<?php
/**
 * Title: Team Card
 * Slug: elevation-theme/team-card
 * Categories: team
 * Keywords: team, member, card
 * Block Types: core/post-template
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30)">
<!-- wp:post-featured-image {"width":"180px","height":"180px","scale":"cover","className":"is-style-rounded","style":{"border":{"radius":"50%"}}} /-->

<!-- wp:post-title {"textAlign":"center","level":3,"fontSize":"lg"} /-->

<!-- wp:paragraph {"align":"center","textColor":"primary","fontSize":"sm","metadata":{"bindings":{"content":{"source":"elevation/post-meta","args":{"key":"position"}}}}} -->
<p class="has-text-align-center has-primary-color has-text-color has-sm-font-size"></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","textColor":"gray-500","fontSize":"sm","metadata":{"bindings":{"content":{"source":"elevation/post-meta","args":{"key":"bio"}}}}} -->
<p class="has-text-align-center has-gray-500-color has-text-color has-sm-font-size"></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
