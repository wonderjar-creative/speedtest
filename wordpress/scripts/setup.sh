#!/bin/bash
# WordPress Setup Script
# Run with: docker-compose exec wpcli sh /scripts/setup.sh

set -e

# All wp commands need --url to avoid HTTP_HOST errors
URL="http://localhost:8080"

echo "========================================="
echo "  WordPress Setup Script"
echo "========================================="

# Wait for WordPress to be ready
echo ""
echo "[1/9] Waiting for WordPress..."
until wp core is-installed --url="$URL" 2>/dev/null; do
  # Try to install if not installed yet
  wp core install --url="$URL" --title="Elevation Design Studio" --admin_user="admin" --admin_password="admin123" --admin_email="admin@example.com" --skip-email 2>/dev/null || sleep 2
done
echo "✓ WordPress installed"

# Configure site settings
echo ""
echo "[2/9] Configuring settings..."
wp option update blogdescription "Architecture & Interior Design" --url="$URL"
wp rewrite structure '/%postname%/' --hard --url="$URL"
echo "✓ Settings configured"

# Install and activate theme
echo ""
echo "[3/9] Activating theme..."
wp theme activate elevation-theme --url="$URL" || echo "Theme not found - activate manually"
echo "✓ Theme step complete"

# Install required plugins
echo ""
echo "[4/9] Installing plugins..."

# WPGraphQL - Required for headless
wp plugin install wp-graphql --activate --url="$URL"
echo "  ✓ WPGraphQL"

# WPGraphQL JWT Authentication - Required for preview/auth
wp plugin install https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/refs/heads/master.zip --activate --url="$URL" || echo "  ! JWT Auth - install manually from GitHub"
echo "  ✓ WPGraphQL JWT Auth"

# Rank Math SEO
wp plugin install seo-by-rank-math --activate --url="$URL"
echo "  ✓ Rank Math SEO"

# WP Super Cache - Basic caching
wp plugin install wp-super-cache --activate --url="$URL"
echo "  ✓ WP Super Cache"

# Contact Form 7
wp plugin install contact-form-7 --activate --url="$URL"
echo "  ✓ Contact Form 7"

# Smart Slider 3 (free version)
wp plugin install smart-slider-3 --activate --url="$URL"
echo "  ✓ Smart Slider 3"

echo ""
echo "[5/9] Installing WPGraphQL for Rank Math..."
wp plugin install https://github.com/developer-developer/developer-developer-developer/archive/refs/heads/master.zip --activate --url="$URL" 2>/dev/null || echo "  ! WPGraphQL for Rank Math - install manually"

# Set up basic pages with pattern content
echo ""
echo "[6/9] Creating pages..."
wp post create --post_type=page --post_title="Home" --post_status=publish --post_name="home" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-home"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="About" --post_status=publish --post_name="about" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-about"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Services" --post_status=publish --post_name="services" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-services"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Portfolio" --post_status=publish --post_name="portfolio" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-portfolio"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Contact" --post_status=publish --post_name="contact" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-contact"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Blog" --post_status=publish --post_name="blog" --url="$URL" || true

# Set homepage and blog page
HOMEPAGE_ID=$(wp post list --post_type=page --name=home --field=ID --url="$URL")
BLOG_ID=$(wp post list --post_type=page --name=blog --field=ID --url="$URL")
if [ -n "$HOMEPAGE_ID" ]; then
  wp option update show_on_front page --url="$URL"
  wp option update page_on_front "$HOMEPAGE_ID" --url="$URL"
  echo "✓ Homepage set"
fi
if [ -n "$BLOG_ID" ]; then
  wp option update page_for_posts "$BLOG_ID" --url="$URL"
  echo "✓ Blog page set"
fi

# Create blog posts
echo ""
echo "[7/9] Creating blog posts..."

wp post create --post_type=post --post_title="5 Design Trends Shaping Denver Homes in 2024" \
  --post_status=publish \
  --post_name="design-trends-denver-2024" \
  --post_excerpt="From biophilic design to warm minimalism, here are the trends transforming Colorado living spaces this year." \
  --post_content='<!-- wp:paragraph -->
<p>Denver homeowners are embracing a new wave of design thinking that balances aesthetics with functionality. After years of the all-white minimalist trend, we are seeing a shift toward warmth, texture, and connection to the natural landscape that makes Colorado so special.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">1. Biophilic Design</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Living walls, natural wood accents, and large windows that frame mountain views are no longer luxury additions — they are becoming standard requests. Biophilic design reduces stress, improves air quality, and creates spaces that feel alive. We have been incorporating reclaimed timber beams and stone sourced from Colorado quarries into nearly every residential project this year.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">2. Warm Minimalism</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The cold, sterile white box is out. Warm minimalism keeps the clean lines but introduces earthy tones — terracotta, sage, warm grays — along with textured fabrics and layered lighting. It is minimalism that actually feels like home.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">3. Indoor-Outdoor Flow</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>With over 300 days of sunshine, Denver homeowners want seamless transitions between interior and exterior spaces. Folding glass walls, covered patios with full kitchens, and heated outdoor living areas extend usable square footage year-round.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">4. Home Office Evolution</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The pandemic home office has matured from a makeshift desk in the guest room to purpose-built spaces with proper acoustics, lighting, and ergonomic design. We are designing dedicated office suites with sound isolation and integrated technology that rival professional workspaces.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">5. Sustainable Materials</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Colorado clients increasingly ask about material sourcing and environmental impact. Recycled steel, bamboo flooring, low-VOC finishes, and energy-efficient systems are not just nice-to-haves — they are deal-breakers for today'"'"'s informed homeowner.</p>
<!-- /wp:paragraph -->' \
  --url="$URL" || true
echo "  ✓ Post: Design Trends"

wp post create --post_type=post --post_title="Behind the Build: Restoring a 1920s Bungalow in Washington Park" \
  --post_status=publish \
  --post_name="restoring-1920s-bungalow-wash-park" \
  --post_excerpt="How we preserved the character of a century-old home while bringing it into the modern era." \
  --post_content='<!-- wp:paragraph -->
<p>When the Andersons purchased their 1926 Craftsman bungalow in Washington Park, they knew it needed work. What they did not expect was just how much history was hiding behind the walls — original lath and plaster, hand-cut oak trim, and a foundation that had settled over nearly a century.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">The Challenge</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Renovation in a historic Denver neighborhood means navigating strict guidelines while meeting modern building codes. The Wash Park neighborhood has specific requirements about exterior modifications, window replacements, and additions. Our team worked closely with the city'"'"'s landmark preservation office to develop a plan that honored the home'"'"'s original character.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Preserving What Matters</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We kept every original element we could — refinishing the hardwood floors rather than replacing them, restoring the built-in cabinetry in the dining room, and repairing the original windows with period-accurate hardware. The fireplace surround, original to 1926, was carefully cleaned and repointed.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Modern Comfort, Vintage Soul</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Behind the scenes, every system was updated — new HVAC with zoned climate control, updated electrical throughout, and a complete kitchen renovation that maintained the Craftsman aesthetic with modern appliances and quartz countertops. The original butler'"'"'s pantry was converted into a coffee bar that the Andersons use every morning.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The project took eight months from demo to move-in. The result is a home that feels both timeless and thoroughly modern — exactly the balance our clients were looking for.</p>
<!-- /wp:paragraph -->' \
  --url="$URL" || true
echo "  ✓ Post: Wash Park Bungalow"

wp post create --post_type=post --post_title="Commercial vs. Residential Design: What Business Owners Need to Know" \
  --post_status=publish \
  --post_name="commercial-vs-residential-design" \
  --post_excerpt="The design process for a commercial space is fundamentally different from a home. Here is why that matters for your project." \
  --post_content='<!-- wp:paragraph -->
<p>When business owners approach us about designing their new office, retail space, or restaurant, they often expect the process to feel similar to a home renovation. It does not — and understanding the differences early saves time, money, and frustration.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Code Compliance is a Different World</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Commercial spaces must meet ADA accessibility requirements, commercial fire codes, occupancy limits, and specific egress requirements. These are not optional and they shape every design decision from door widths to restroom counts. A beautiful design that does not pass inspection is not a design at all.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Traffic Flow Drives Everything</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>In a home, you design for comfort and personal taste. In a commercial space, you design for how people move — customer flow, employee workflow, delivery access, emergency exits. A restaurant where servers collide at the kitchen door or a retail store where customers cannot find the checkout will fail regardless of how good it looks.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Branding is Built Into the Walls</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Your commercial space is a physical expression of your brand. Every material choice, color, lighting decision, and spatial arrangement communicates something to your customers. We work with business owners to translate their brand identity into a three-dimensional experience that reinforces their message at every touchpoint.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">The Timeline is Different</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Commercial projects typically involve more stakeholders, longer permitting processes, and phased construction to minimize business disruption. We build detailed project timelines that account for these realities and keep communication transparent throughout.</p>
<!-- /wp:paragraph -->' \
  --url="$URL" || true
echo "  ✓ Post: Commercial vs Residential"

wp post create --post_type=post --post_title="Why We Chose Sustainable Building Practices (And You Should Too)" \
  --post_status=publish \
  --post_name="sustainable-building-practices" \
  --post_excerpt="Sustainability is not just about the environment — it is about building spaces that perform better, last longer, and cost less to operate." \
  --post_content='<!-- wp:paragraph -->
<p>When we founded Elevation Design Studio in 2010, sustainable building was considered a premium add-on — something eco-conscious clients requested and everyone else ignored. Fourteen years later, it is simply good building practice.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">The Business Case for Sustainability</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Energy-efficient buildings cost less to operate. Full stop. A well-insulated envelope, high-performance windows, and right-sized HVAC systems reduce utility bills by 30-50% compared to conventional construction. In Colorado'"'"'s climate — with extreme temperature swings and intense sun — this adds up fast.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">What We Do Differently</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Every Elevation project starts with a sustainability assessment. We evaluate the site'"'"'s solar orientation, prevailing winds, and existing vegetation before drawing a single line. We prioritize locally sourced materials — Colorado stone, regionally milled lumber, recycled steel from Front Range suppliers — which reduces transportation emissions and supports the local economy.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Materials Matter</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We have phased out materials with high embodied carbon wherever alternatives exist. Concrete is used only where structurally necessary. We specify FSC-certified wood, zero-VOC paints and finishes, and insulation made from recycled content. These choices do not compromise quality — they improve it.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Building sustainably is not a trend. It is a responsibility we take seriously on every project, and our clients consistently tell us it is one of the reasons they chose to work with us.</p>
<!-- /wp:paragraph -->' \
  --url="$URL" || true
echo "  ✓ Post: Sustainable Building"

wp post create --post_type=post --post_title="The Consultation Process: What to Expect When You Work With Us" \
  --post_status=publish \
  --post_name="consultation-process-what-to-expect" \
  --post_excerpt="From the first phone call to the final walkthrough, here is how we guide clients through every step of their design project." \
  --post_content='<!-- wp:paragraph -->
<p>Starting a design project can feel overwhelming. Whether you are building from scratch, renovating a space you love, or designing a commercial environment, the process involves hundreds of decisions. Our job is to make those decisions feel manageable and even enjoyable.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 1: Discovery Call</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Every project starts with a 30-minute phone call. We want to understand your vision, your timeline, and your budget range. This is not a sales pitch — it is a conversation to determine whether we are the right fit for each other. About half of our projects come from referrals, and we want every client relationship to start on honest footing.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 2: Site Visit and Assessment</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If the discovery call goes well, we schedule an on-site visit. For renovations, we assess the existing structure, note what is worth preserving, and identify potential challenges. For new builds, we evaluate the lot, orientation, views, and access. We document everything with photos and measurements.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 3: Concept Development</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Using our site assessment and your input, we develop two to three concept directions. These include mood boards, rough floor plans, and material palettes. We present these in person and collaborate to refine the direction that resonates most.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 4: Design and Documentation</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Once the concept is approved, we produce full construction documents — detailed drawings, material specifications, and 3D renderings that show exactly what the finished space will look like. Sarah Kim, our visualization artist, creates photorealistic renderings that eliminate guesswork.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 5: Build and Beyond</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>During construction, our project manager James Wright oversees every detail. We conduct regular site visits, coordinate with contractors, and handle any changes that arise. After the final walkthrough, we stay available for questions and adjustments as you settle into your new space.</p>
<!-- /wp:paragraph -->' \
  --url="$URL" || true
echo "  ✓ Post: Consultation Process"

# Create team members
echo ""
echo "[8/9] Creating team members..."

wp post create --post_type=team_member --post_title="David Chen" \
  --post_status=publish \
  --post_name="david-chen" \
  --post_content="David founded Elevation Design Studio in 2010 after two decades of designing award-winning residential and commercial projects across Colorado. His approach blends modernist principles with deep respect for the natural landscape, creating spaces that feel both striking and grounded. He holds a Master of Architecture from the University of Colorado Denver and is a LEED-accredited professional." \
  --meta_input='{"position":"Principal Architect","bio":"20+ years of experience in sustainable residential and commercial architecture across the Front Range.","photo_url":"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80","order":"1"}' \
  --url="$URL" || true
echo "  ✓ David Chen"

wp post create --post_type=team_member --post_title="Maria Rodriguez" \
  --post_status=publish \
  --post_name="maria-rodriguez" \
  --post_content="Maria brings 15 years of interior design expertise with a focus on creating warm, livable spaces that reflect each client's personality. NCIDQ certified and passionate about color theory, she has a gift for balancing bold design choices with timeless comfort. Before joining Elevation, she led the residential interiors division at a top Denver firm." \
  --meta_input='{"position":"Lead Interior Designer","bio":"Specializes in blending modern aesthetics with warm, livable spaces. NCIDQ certified with a passion for color theory.","photo_url":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80","order":"2"}' \
  --url="$URL" || true
echo "  ✓ Maria Rodriguez"

wp post create --post_type=team_member --post_title="James Wright" \
  --post_status=publish \
  --post_name="james-wright" \
  --post_content="James keeps every Elevation project on time and on budget. With a PMP certification and a background in construction management, he bridges the gap between design vision and build reality. He coordinates directly with contractors, handles permitting, and ensures that what gets built matches what was designed — down to every detail." \
  --meta_input='{"position":"Project Manager","bio":"Keeps every project on time and on budget. PMP certified with a background in construction management.","photo_url":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80","order":"3"}' \
  --url="$URL" || true
echo "  ✓ James Wright"

wp post create --post_type=team_member --post_title="Sarah Kim" \
  --post_status=publish \
  --post_name="sarah-kim" \
  --post_content="Sarah creates photorealistic 3D renderings that bring designs to life before a single wall goes up. Her visualizations help clients see exactly what their finished space will look like — from the way light falls across a room at different times of day to the texture of specific materials. She works in Unreal Engine and has a background in architectural photography." \
  --meta_input='{"position":"3D Visualization Artist","bio":"Creates photorealistic renderings that bring designs to life before construction begins.","photo_url":"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80","order":"4"}' \
  --url="$URL" || true
echo "  ✓ Sarah Kim"

wp post create --post_type=team_member --post_title="Marcus Thompson" \
  --post_status=publish \
  --post_name="marcus-thompson" \
  --post_content="Marcus leads all of Elevation's commercial projects, from boutique retail spaces to restaurant buildouts and corporate offices. He spent eight years at a national architecture firm before joining the team, bringing deep expertise in commercial building codes, ADA compliance, and multi-stakeholder project coordination. His designs prioritize traffic flow and brand expression." \
  --meta_input='{"position":"Commercial Design Lead","bio":"Eight years at a national firm before joining Elevation. Expert in commercial codes, ADA, and brand-driven spatial design.","photo_url":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80","order":"5"}' \
  --url="$URL" || true
echo "  ✓ Marcus Thompson"

# Create testimonials
echo ""
echo "[9/9] Creating testimonials..."

wp post create --post_type=testimonial --post_title="Sarah Mitchell" \
  --post_status=publish \
  --post_name="sarah-mitchell" \
  --post_content="Elevation Design transformed our dated living space into a modern oasis. Their attention to detail is unmatched and they made the entire process feel effortless." \
  --meta_input='{"author_name":"Sarah Mitchell","author_role":"Homeowner, Denver","rating":"5","photo_url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"}' \
  --url="$URL" || true
echo "  ✓ Sarah Mitchell"

wp post create --post_type=testimonial --post_title="James Torres" \
  --post_status=publish \
  --post_name="james-torres" \
  --post_content="Professional, creative, and easy to work with. Our new office space has boosted team morale significantly. They truly understood our brand and culture." \
  --meta_input='{"author_name":"James Torres","author_role":"CEO, TechStart Inc., Boulder","rating":"5","photo_url":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"}' \
  --url="$URL" || true
echo "  ✓ James Torres"

wp post create --post_type=testimonial --post_title="Emily Hartwell" \
  --post_status=publish \
  --post_name="emily-hartwell" \
  --post_content="Our mountain home renovation exceeded every expectation. The Elevation team balanced rustic charm with modern comfort perfectly. We couldn't be happier." \
  --meta_input='{"author_name":"Emily Hartwell","author_role":"Homeowner, Vail","rating":"5","photo_url":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"}' \
  --url="$URL" || true
echo "  ✓ Emily Hartwell"

wp post create --post_type=testimonial --post_title="Rachel Nguyen" \
  --post_status=publish \
  --post_name="rachel-nguyen" \
  --post_content="We hired Elevation for our restaurant buildout in RiNo and they nailed it. The space tells our story before customers even open the menu. Marcus and the team understood exactly what we needed." \
  --meta_input='{"author_name":"Rachel Nguyen","author_role":"Owner, Pho & Fire, RiNo","rating":"5","photo_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}' \
  --url="$URL" || true
echo "  ✓ Rachel Nguyen"

wp post create --post_type=testimonial --post_title="Tom and Lisa Brennan" \
  --post_status=publish \
  --post_name="tom-lisa-brennan" \
  --post_content="From the first consultation to the final walkthrough, Elevation made us feel like our project was the only one that mattered. The kitchen renovation came in on budget and ahead of schedule." \
  --meta_input='{"author_name":"Tom and Lisa Brennan","author_role":"Homeowners, Cherry Creek","rating":"5","photo_url":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"}' \
  --url="$URL" || true
echo "  ✓ Tom and Lisa Brennan"

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "WordPress: http://localhost:8080"
echo "Admin:     http://localhost:8080/wp-admin"
echo "GraphQL:   http://localhost:8080/graphql"
echo ""
echo "Login: admin / admin123"
echo ""
echo "Content created:"
echo "  - 5 Pages (Home, About, Services, Portfolio, Contact, Blog)"
echo "  - 5 Blog Posts"
echo "  - 5 Team Members"
echo "  - 5 Testimonials"
echo ""
