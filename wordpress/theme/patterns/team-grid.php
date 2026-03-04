<?php
/**
 * Title: Team Grid
 * Slug: elevation-theme/team-grid
 * Categories: featured, team
 * Keywords: team, members, people
 *
 * @package ElevationTheme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50)">
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center">Meet Our Team</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
<p class="has-text-align-center has-gray-500-color has-text-color">The talented people behind every project</p>
<!-- /wp:paragraph -->

<!-- wp:query {"queryId":1,"query":{"postType":"team_member","perPage":4,"order":"asc","orderBy":"menu_order"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-query" style="margin-top:var(--wp--preset--spacing--50)">
<!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"grid","columnCount":4}} -->
<!-- wp:pattern {"slug":"elevation-theme/team-card"} /-->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph {"align":"center","textColor":"gray-500"} -->
<p class="has-text-align-center has-gray-500-color has-text-color">No team members found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</div>
<!-- /wp:group -->
