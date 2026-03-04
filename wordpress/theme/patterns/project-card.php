<?php
/**
 * Title: Project Card
 * Slug: elevation-theme/project-card
 * Categories: portfolio
 * Keywords: project, portfolio, card
 * Block Types: core/post-template
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"backgroundColor":"gray-100","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-gray-100-background-color has-background" style="border-radius:8px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
<!-- wp:post-featured-image {"aspectRatio":"4/3","scale":"cover","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px"}}}} /-->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30)">
<!-- wp:post-title {"level":3,"fontSize":"base"} /-->

<!-- wp:post-excerpt {"textColor":"gray-500","fontSize":"sm"} /-->

<!-- wp:paragraph {"textColor":"gray-500","fontSize":"sm","metadata":{"bindings":{"content":{"source":"elevation/post-meta","args":{"key":"location"}}}}} -->
<p class="has-gray-500-color has-text-color has-sm-font-size"></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
