<?php
/**
 * Title: Footer
 * Slug: elevation-theme/footer
 * Categories: footer
 * Keywords: footer, copyright, social
 * Block Types: core/template-part/footer
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"backgroundColor":"gray-900","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-gray-900-background-color has-background" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)">
    <!-- wp:columns -->
    <div class="wp-block-columns">
        <!-- wp:column {"width":"50%"} -->
        <div class="wp-block-column" style="flex-basis:50%">
            <!-- wp:heading {"level":3,"textColor":"white","fontSize":"lg"} -->
            <h3 class="wp-block-heading has-white-color has-text-color has-lg-font-size">Elevation Design Studio</h3>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"textColor":"gray-400"} -->
            <p class="has-gray-400-color has-text-color">Architecture &amp; Interior Design<br>Denver, Colorado</p>
            <!-- /wp:paragraph -->

            <!-- wp:social-links {"iconColor":"gray-400","iconColorValue":"#9ca3af","className":"is-style-logos-only","style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}}} -->
            <ul class="wp-block-social-links has-icon-color is-style-logos-only" style="margin-top:var(--wp--preset--spacing--30)">
                <!-- wp:social-link {"url":"#","service":"instagram"} /-->
                <!-- wp:social-link {"url":"#","service":"linkedin"} /-->
                <!-- wp:social-link {"url":"#","service":"pinterest"} /-->
            </ul>
            <!-- /wp:social-links -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"25%"} -->
        <div class="wp-block-column" style="flex-basis:25%">
            <!-- wp:heading {"level":4,"textColor":"white","fontSize":"md"} -->
            <h4 class="wp-block-heading has-white-color has-text-color has-md-font-size">Quick Links</h4>
            <!-- /wp:heading -->

            <!-- wp:list {"textColor":"gray-400","style":{"typography":{"lineHeight":"2"}}} -->
            <ul class="has-gray-400-color has-text-color" style="line-height:2">
                <li><a href="/about">About Us</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/portfolio">Portfolio</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <!-- /wp:list -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"25%"} -->
        <div class="wp-block-column" style="flex-basis:25%">
            <!-- wp:heading {"level":4,"textColor":"white","fontSize":"md"} -->
            <h4 class="wp-block-heading has-white-color has-text-color has-md-font-size">Contact</h4>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"textColor":"gray-400"} -->
            <p class="has-gray-400-color has-text-color">hello@elevationdesign.co<br>(303) 555-0123</p>
            <!-- /wp:paragraph -->

            <!-- wp:paragraph {"textColor":"gray-400"} -->
            <p class="has-gray-400-color has-text-color">1234 Design District<br>Denver, CO 80202</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->

    <!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|40"}}},"backgroundColor":"gray-700"} -->
    <hr class="wp-block-separator has-text-color has-gray-700-color has-alpha-channel-opacity has-gray-700-background-color has-background" style="margin-top:var(--wp--preset--spacing--50);margin-bottom:var(--wp--preset--spacing--40)"/>
    <!-- /wp:separator -->

    <!-- wp:paragraph {"align":"center","textColor":"gray-500","fontSize":"sm"} -->
    <p class="has-text-align-center has-gray-500-color has-text-color has-sm-font-size">&copy; 2024 Elevation Design Studio. All rights reserved.</p>
    <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
