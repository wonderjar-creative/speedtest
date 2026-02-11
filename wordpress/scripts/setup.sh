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
echo "[1/13] Waiting for WordPress..."
until wp core is-installed --url="$URL" 2>/dev/null; do
  # Try to install if not installed yet
  wp core install --url="$URL" --title="Elevation Design Studio" --admin_user="admin" --admin_password="admin123" --admin_email="admin@example.com" --skip-email 2>/dev/null || sleep 2
done
echo "✓ WordPress installed"

# Configure site settings
echo ""
echo "[2/13] Configuring settings..."
wp option update blogdescription "Architecture & Interior Design" --url="$URL"
wp rewrite structure '/%postname%/' --hard --url="$URL"
echo "✓ Settings configured"

# Install and activate theme
echo ""
echo "[3/13] Activating theme..."
wp theme activate elevation-theme --url="$URL" || echo "Theme not found - activate manually"
echo "✓ Theme step complete"

# Install required plugins
echo ""
echo "[4/13] Installing plugins..."

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
# Rename the default CF7 form and set demo mode
CF7_ID=$(wp post list --post_type=wpcf7_contact_form --posts_per_page=1 --field=ID --url="$URL" 2>/dev/null)
if [ -n "$CF7_ID" ]; then
  wp post update "$CF7_ID" --post_title="Contact Form" --url="$URL" 2>/dev/null
  wp post meta update "$CF7_ID" _additional_settings "demo_mode: on" --url="$URL" 2>/dev/null
fi
echo "  ✓ Contact Form 7"

echo ""
echo "[5/13] Installing WPGraphQL for Rank Math..."
wp plugin install https://github.com/developer-developer/developer-developer-developer/archive/refs/heads/master.zip --activate --url="$URL" 2>/dev/null || echo "  ! WPGraphQL for Rank Math - install manually"

# Set up basic pages with pattern content
echo ""
echo "[6/13] Creating pages..."
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
echo "[7/13] Creating blog posts..."

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
echo "[8/13] Creating team members..."

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
echo "[9/13] Creating testimonials..."

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

# Create projects
echo ""
echo "[10/13] Creating projects..."

wp post create --post_type=project --post_title="Modern Loft Renovation" \
  --post_status=publish \
  --post_name="modern-loft-renovation" \
  --post_excerpt="Complete transformation of a 1920s industrial loft into a contemporary living space with exposed brick and custom millwork." \
  --post_content='<!-- wp:paragraph -->
<p>This 2,400 square foot LoDo loft had been untouched since its conversion from warehouse space in the early 1990s. The owners wanted a modern, open living environment that preserved the industrial character — the original brick walls, timber beams, and cast iron columns — while adding warmth and livability.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Design Approach</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We opened up the floor plan by removing non-structural partition walls, creating a single flowing space from the entry through the living area to the kitchen. Custom walnut millwork defines zones without blocking sightlines — a floating media wall separates living from dining, while a built-in bookcase frames the home office nook.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The kitchen features a 12-foot waterfall island in honed Calacatta marble, contrasting with blackened steel shelving and matte black fixtures. Underfoot, the original maple flooring was sanded, repaired, and refinished in a natural matte.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Results</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The renovation took five months. The result is a space that honors its industrial past while feeling distinctly contemporary — open, warm, and built for how the owners actually live.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Denver, CO","project_type":"Residential","square_footage":"2400","year_completed":"2023","photo_url":"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Modern Loft Renovation"

wp post create --post_type=project --post_title="Tech Startup HQ" \
  --post_status=publish \
  --post_name="tech-startup-hq" \
  --post_excerpt="Open-plan workspace for 200+ employees featuring collaboration zones, quiet rooms, and biophilic design elements." \
  --post_content='<!-- wp:paragraph -->
<p>A fast-growing Boulder tech company needed a headquarters that could scale with them — flexible enough for 200+ employees today with room to grow, while reflecting a culture built on collaboration, transparency, and innovation.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Space Planning</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The 18,000 square foot space is organized around a central commons — a double-height atrium with a living green wall, cafe seating, and a presentation stage. Neighborhoods of 20-30 desks radiate outward, each with dedicated focus rooms, phone booths, and informal meeting areas. No employee is more than 60 seconds from a quiet space.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Biophilic Elements</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Over 400 plants are integrated throughout the space, from desk-level succulents to ceiling-hung trailing pothos. The living wall in the commons filters air and creates a visual anchor. Natural materials — oak, felt, cork — appear at every touchpoint. Studies show biophilic design reduces stress and increases productivity by up to 15%.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Boulder, CO","project_type":"Commercial","square_footage":"18000","year_completed":"2023","photo_url":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Tech Startup HQ"

wp post create --post_type=project --post_title="Mountain Retreat" \
  --post_status=publish \
  --post_name="mountain-retreat" \
  --post_excerpt="Luxury mountain home with floor-to-ceiling windows, natural stone, and seamless indoor-outdoor living spaces." \
  --post_content='<!-- wp:paragraph -->
<p>Perched on a south-facing lot at 8,200 feet in Vail, this 4,800 square foot home was designed to disappear into the landscape while commanding panoramic views of the Gore Range. The clients wanted a mountain home that felt modern and light — not the dark timber lodges that dominate the area.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Architecture</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The home is organized as three stacked volumes — a stone-clad base anchoring it to the hillside, a glass-and-steel living level that opens completely to the south, and a cantilevered upper floor with private bedrooms. Floor-to-ceiling triple-glazed windows frame the mountain views while maintaining energy efficiency at altitude.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Materials</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Local Colorado moss rock forms the base and fireplace surround. Interior walls are finished in lime plaster. Wide-plank white oak floors run throughout. The kitchen island is a single slab of leathered quartzite. Every material was chosen for its connection to the mountain environment.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Vail, CO","project_type":"Residential","square_footage":"4800","year_completed":"2022","photo_url":"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Mountain Retreat"

wp post create --post_type=project --post_title="Boutique Hotel Lobby" \
  --post_status=publish \
  --post_name="boutique-hotel-lobby" \
  --post_excerpt="Sophisticated lobby design blending mountain lodge warmth with contemporary luxury for a 45-room boutique hotel." \
  --post_content='<!-- wp:paragraph -->
<p>The Alpenglow Hotel in Aspen needed a lobby that would set the tone for a 45-room boutique experience — warm and inviting enough for apres-ski, sophisticated enough for a summer gala. The existing space was a dated 1980s ski lodge interior with low ceilings and dark paneling.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Transformation</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We opened the ceiling to expose the original timber trusses, adding 6 feet of vertical space. A double-sided fireplace anchors the room, separating the reception area from a lounge with mountain views. Custom furniture mixes leather, sheepskin, and brass with clean contemporary lines.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The check-in desk is a sculptural piece in blackened steel and live-edge walnut. Behind it, a backlit wall of locally quarried marble creates a warm glow. The floor transitions from heated stone at the entry to wide-plank reclaimed oak in the lounge areas.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Aspen, CO","project_type":"Hospitality","square_footage":"3200","year_completed":"2023","photo_url":"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Boutique Hotel Lobby"

wp post create --post_type=project --post_title="Urban Townhouse" \
  --post_status=publish \
  --post_name="urban-townhouse" \
  --post_excerpt="Three-story townhouse redesign maximizing vertical space with an open staircase, rooftop terrace, and smart home integration." \
  --post_content='<!-- wp:paragraph -->
<p>This 2,100 square foot Highlands townhouse had a common problem — tall and narrow with each floor feeling disconnected. The owners wanted the home to feel more open and connected while adding a usable rooftop space and modern smart home features throughout.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Vertical Connection</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The key move was replacing the enclosed staircase with an open steel-and-glass structure that runs the full three stories. A skylight at the top floods all levels with natural light. Each floor now has visual and acoustic connection to the others, transforming the home from three stacked apartments into one cohesive space.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Smart Integration</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Every system is controlled through a unified smart home platform — lighting, climate, shades, security, audio. Motorized blackout shades, zoned HVAC, and circadian-rhythm lighting adjust automatically based on time of day and occupancy. The rooftop terrace includes a built-in grill, heated seating, and weatherproof speakers with views of downtown Denver.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Denver, CO","project_type":"Residential","square_footage":"2100","year_completed":"2024","photo_url":"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Urban Townhouse"

wp post create --post_type=project --post_title="Creative Agency Office" \
  --post_status=publish \
  --post_name="creative-agency-office" \
  --post_excerpt="Vibrant workspace for a 50-person creative agency with writable walls, flexible meeting pods, and a rooftop lounge." \
  --post_content='<!-- wp:paragraph -->
<p>A Denver-based advertising agency was outgrowing their WeWork space and needed a permanent home that reflected their creative energy. The brief was clear: no beige, no cubicles, and the space itself should be a portfolio piece that impresses clients on arrival.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Creative Zones</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The 8,500 square foot space is divided into neighborhoods rather than departments. Writable walls and mobile whiteboards allow any surface to become a brainstorming canvas. Four meeting pods — each themed and soundproofed — can be booked for focused sessions. A material library and model shop give the design team hands-on workspace.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Culture Spaces</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The entry opens into a gallery wall showcasing the agency'"'"'s best work, rotated quarterly. A full kitchen and bar area anchors the social zone, doubling as event space for client presentations and team celebrations. The rooftop lounge with artificial turf, string lights, and mountain views has become the agency'"'"'s signature recruiting tool.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Denver, CO","project_type":"Commercial","square_footage":"8500","year_completed":"2024","photo_url":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Creative Agency Office"

wp post create --post_type=project --post_title="Lakeside Villa" \
  --post_status=publish \
  --post_name="lakeside-villa" \
  --post_excerpt="Custom lakefront home with panoramic views, an infinity pool, and sustainable materials throughout." \
  --post_content='<!-- wp:paragraph -->
<p>Set on a one-acre lakefront lot in Grand Lake, this 5,200 square foot home was designed from the ground up as a year-round family retreat. The clients — a couple with three teenage children — wanted a home that could host large gatherings while still feeling intimate for everyday living.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Lake Living</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The home is oriented to maximize lake views from every major room. A wraparound covered deck extends the living space outdoors, with an infinity-edge pool that visually merges with the lake beyond. The lower level walks out directly to a private dock and fire pit area.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Sustainability</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Despite its size, the home is net-zero ready. A 15kW solar array on the south-facing garage roof, geothermal heating and cooling, and a super-insulated envelope keep energy costs minimal. Rainwater collection feeds the landscape irrigation. All wood is FSC-certified, sourced from Colorado mills where possible.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Grand Lake, CO","project_type":"Residential","square_footage":"5200","year_completed":"2022","photo_url":"https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Lakeside Villa"

wp post create --post_type=project --post_title="Farm-to-Table Restaurant" \
  --post_status=publish \
  --post_name="farm-to-table-restaurant" \
  --post_excerpt="Rustic-modern dining space with reclaimed wood, open kitchen concept, and an intimate 80-seat layout." \
  --post_content='<!-- wp:paragraph -->
<p>Root & Bloom is a farm-to-table restaurant in Old Town Fort Collins that needed a space as thoughtful as its menu. The chef-owner wanted diners to feel connected to the food'"'"'s origins — the farms, the seasons, the craft — through the architecture and design of the restaurant itself.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Design Concept</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The 2,800 square foot space is organized around an open kitchen as the visual centerpiece. A 16-foot reclaimed barn wood communal table runs parallel to the kitchen pass, giving diners a front-row seat to the cooking. The remaining 60 seats are arranged in intimate groupings — banquettes along the brick walls, four-tops by the windows, a private dining alcove for 8.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Materials Story</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Every material has provenance. The communal table is from a 100-year-old barn in Loveland. Light fixtures are hand-blown by a Fort Collins glass artist. Ceramic tiles behind the bar were made by a local potter using Colorado clay. The concrete floors are polished and sealed, warm underfoot from radiant heating — durable enough for restaurant traffic while feeling refined.</p>
<!-- /wp:paragraph -->' \
  --meta_input='{"location":"Fort Collins, CO","project_type":"Hospitality","square_footage":"2800","year_completed":"2024","photo_url":"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"}' \
  --url="$URL" || true
echo "  ✓ Farm-to-Table Restaurant"

# Create project type taxonomy terms and assign to projects
echo ""
echo "[11/13] Assigning project types..."

# Create terms
wp term create project_type "Residential" --url="$URL" 2>/dev/null || true
wp term create project_type "Commercial" --url="$URL" 2>/dev/null || true
wp term create project_type "Hospitality" --url="$URL" 2>/dev/null || true

# Assign terms based on the project_type meta already set
PROJECTS='modern-loft-renovation|Residential
tech-startup-hq|Commercial
mountain-retreat|Residential
boutique-hotel-lobby|Hospitality
urban-townhouse|Residential
creative-agency-office|Commercial
lakeside-villa|Residential
farm-to-table-restaurant|Hospitality'

echo "$PROJECTS" | while IFS='|' read -r SLUG TERM; do
  PID=$(wp post list --post_type=project --name="$SLUG" --field=ID --url="$URL" 2>/dev/null)
  if [ -n "$PID" ]; then
    wp post term set "$PID" project_type "$TERM" --url="$URL" 2>/dev/null
    echo "  ✓ $SLUG → $TERM"
  fi
done
echo "✓ Project types assigned"

# Create navigation menu
echo ""
echo "[12/13] Creating navigation menu..."

wp menu create "Primary" --url="$URL" || true

# Home (top-level)
wp menu item add-post "Primary" "$(wp post list --post_type=page --name=home --field=ID --url="$URL")" --title="Home" --url="$URL" || true

# About (with submenus)
ABOUT_ID=$(wp menu item add-post "Primary" "$(wp post list --post_type=page --name=about --field=ID --url="$URL")" --title="About" --porcelain --url="$URL") || true
if [ -n "$ABOUT_ID" ]; then
  wp menu item add-custom "Primary" "Our Story" "/about/" --parent-id="$ABOUT_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Our Team" "/team/" --parent-id="$ABOUT_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Awards & Recognition" "/about/#awards" --parent-id="$ABOUT_ID" --url="$URL" || true
fi

# Services (with submenus)
SERVICES_ID=$(wp menu item add-post "Primary" "$(wp post list --post_type=page --name=services --field=ID --url="$URL")" --title="Services" --porcelain --url="$URL") || true
if [ -n "$SERVICES_ID" ]; then
  wp menu item add-custom "Primary" "Residential Design" "/services/#residential" --parent-id="$SERVICES_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Commercial Interiors" "/services/#commercial" --parent-id="$SERVICES_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Renovation & Remodeling" "/services/#renovation" --parent-id="$SERVICES_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Consultation" "/services/#consultation" --parent-id="$SERVICES_ID" --url="$URL" || true
fi

# Portfolio (with submenus)
PORTFOLIO_ID=$(wp menu item add-custom "Primary" "Portfolio" "/projects/" --porcelain --url="$URL") || true
if [ -n "$PORTFOLIO_ID" ]; then
  wp menu item add-custom "Primary" "All Projects" "/projects/" --parent-id="$PORTFOLIO_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Residential" "/project-type/residential/" --parent-id="$PORTFOLIO_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Commercial" "/project-type/commercial/" --parent-id="$PORTFOLIO_ID" --url="$URL" || true
  wp menu item add-custom "Primary" "Hospitality" "/project-type/hospitality/" --parent-id="$PORTFOLIO_ID" --url="$URL" || true
fi

# Testimonials, Blog, Contact (top-level)
wp menu item add-custom "Primary" "Testimonials" "/testimonials/" --url="$URL" || true
wp menu item add-post "Primary" "$(wp post list --post_type=page --name=blog --field=ID --url="$URL")" --title="Blog" --url="$URL" || true
wp menu item add-post "Primary" "$(wp post list --post_type=page --name=contact --field=ID --url="$URL")" --title="Contact" --url="$URL" || true

wp menu location assign "Primary" primary --url="$URL" 2>/dev/null || true
echo "✓ Navigation menu with submenus created"

# Flush rewrite rules for new CPTs
wp rewrite flush --url="$URL" || true

# Import featured images
echo ""
echo "[13/13] Importing featured images..."

# Upload dir permissions are handled by the fix-permissions service in docker-compose

# Helper: download image, import to media library, set as featured image
set_featured_image() {
  local POST_ID="$1"
  local IMAGE_URL="$2"
  local POST_TITLE="$3"

  if [ -z "$POST_ID" ] || [ -z "$IMAGE_URL" ]; then
    return
  fi

  # Sanitize title to filename
  local FILENAME
  FILENAME=$(echo "$POST_TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')
  FILENAME="${FILENAME}.jpg"

  # Download with proper extension, then import
  if wget -q -O "/tmp/$FILENAME" "$IMAGE_URL" 2>/dev/null; then
    ATTACH_ID=$(wp media import "/tmp/$FILENAME" --title="$POST_TITLE" --porcelain --url="$URL" 2>/dev/null)
    rm -f "/tmp/$FILENAME"
    if [ -n "$ATTACH_ID" ]; then
      wp post meta update "$POST_ID" _thumbnail_id "$ATTACH_ID" --url="$URL" 2>/dev/null
      echo "  ✓ $POST_TITLE"
    else
      echo "  ! Import failed: $POST_TITLE"
    fi
  else
    echo "  ! Download failed: $POST_TITLE"
  fi
}

# Blog post featured images (not stored in meta, assign here)
BLOG_IMAGES='design-trends-denver-2024|https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80
restoring-1920s-bungalow-wash-park|https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80
commercial-vs-residential-design|https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80
sustainable-building-practices|https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80
consultation-process-what-to-expect|https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'

echo "$BLOG_IMAGES" | while IFS='|' read -r SLUG IMG_URL; do
  PID=$(wp post list --post_type=post --name="$SLUG" --field=ID --url="$URL" 2>/dev/null)
  TITLE=$(wp post list --post_type=post --name="$SLUG" --field=post_title --url="$URL" 2>/dev/null)
  set_featured_image "$PID" "$IMG_URL" "$TITLE"
done

# Import featured images for CPTs that store photo_url in meta
for POST_TYPE in project team_member testimonial; do
  wp post list --post_type="$POST_TYPE" --field=ID --url="$URL" 2>/dev/null | while read -r PID; do
    PHOTO_URL=$(wp post meta get "$PID" photo_url --url="$URL" 2>/dev/null)
    TITLE=$(wp post get "$PID" --field=post_title --url="$URL" 2>/dev/null)
    set_featured_image "$PID" "$PHOTO_URL" "$TITLE"
  done
done

echo "✓ Featured images imported"

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
echo "  - 6 Pages (Home, About, Services, Portfolio, Contact, Blog)"
echo "  - 5 Blog Posts (with featured images)"
echo "  - 8 Projects (with featured images)"
echo "  - 5 Team Members (with featured images)"
echo "  - 5 Testimonials (with featured images)"
echo "  - Primary navigation menu"
echo ""
