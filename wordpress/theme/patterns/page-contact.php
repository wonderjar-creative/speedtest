<?php
/**
 * Title: Page: Contact
 * Slug: elevation-theme/page-contact
 * Categories: pages
 * Keywords: contact, form, info
 * Post Types: page
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
    <!-- wp:heading {"textAlign":"center","level":1} -->
    <h1 class="wp-block-heading has-text-align-center">Get in Touch</h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","textColor":"gray-600","fontSize":"lg"} -->
    <p class="has-text-align-center has-gray-600-color has-text-color has-lg-font-size">Ready to start your project? We'd love to hear from you.</p>
    <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"0","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:0;padding-bottom:var(--wp--preset--spacing--60)">
    <!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60"}}}} -->
    <div class="wp-block-columns">
        <!-- wp:column {"width":"60%"} -->
        <div class="wp-block-column" style="flex-basis:60%">
            <!-- wp:heading {"level":2,"fontSize":"xl"} -->
            <h2 class="wp-block-heading has-xl-font-size">Send us a message</h2>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"textColor":"gray-600"} -->
            <p class="has-gray-600-color has-text-color">Fill out the form below and we'll get back to you within 24 hours.</p>
            <!-- /wp:paragraph -->

            <!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
            <div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--40)">
                <!-- wp:shortcode -->
                [contact-form-7 title="Contact Form"]
                <!-- /wp:shortcode -->
            </div>
            <!-- /wp:group -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"40%"} -->
        <div class="wp-block-column" style="flex-basis:40%">
            <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"8px"}},"backgroundColor":"gray-50","layout":{"type":"constrained"}} -->
            <div class="wp-block-group has-gray-50-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40)">
                <!-- wp:heading {"level":3,"fontSize":"lg"} -->
                <h3 class="wp-block-heading has-lg-font-size">Contact Information</h3>
                <!-- /wp:heading -->

                <!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
                <div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--30)">
                    <!-- wp:paragraph {"textColor":"gray-700"} -->
                    <p class="has-gray-700-color has-text-color"><strong>Email</strong><br>hello@elevationdesign.co</p>
                    <!-- /wp:paragraph -->

                    <!-- wp:paragraph {"textColor":"gray-700"} -->
                    <p class="has-gray-700-color has-text-color"><strong>Phone</strong><br>(303) 555-0123</p>
                    <!-- /wp:paragraph -->

                    <!-- wp:paragraph {"textColor":"gray-700"} -->
                    <p class="has-gray-700-color has-text-color"><strong>Address</strong><br>1234 Design District<br>Denver, CO 80202</p>
                    <!-- /wp:paragraph -->
                </div>
                <!-- /wp:group -->

                <!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"backgroundColor":"gray-200"} -->
                <hr class="wp-block-separator has-text-color has-gray-200-color has-alpha-channel-opacity has-gray-200-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--40)"/>
                <!-- /wp:separator -->

                <!-- wp:heading {"level":4,"fontSize":"md"} -->
                <h4 class="wp-block-heading has-md-font-size">Office Hours</h4>
                <!-- /wp:heading -->

                <!-- wp:paragraph {"textColor":"gray-600","fontSize":"sm"} -->
                <p class="has-gray-600-color has-text-color has-sm-font-size">Monday - Friday: 9am - 6pm<br>Saturday: By appointment<br>Sunday: Closed</p>
                <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->
