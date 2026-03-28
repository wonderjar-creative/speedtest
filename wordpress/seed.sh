#!/bin/sh
#
# seed.sh — Reproducible content seed for Elevation Design Studio
#
# Reads content from data/*.json files.
# Usage: make seed (from project root)
# Reset:  make seed-reset && make seed
#

set -eu

WP="wp --allow-root"
DATA="/tmp/data"

# PHP helper: extract a field from a JSON array item by index
# Usage: json_field <file> <index> <field>
json_field() {
  php -r "\$d=json_decode(file_get_contents('$1'),true); echo \$d[$2]['$3'] ?? '';"
}

# PHP helper: extract a nested meta field
# Usage: json_meta <file> <index> <meta_key>
json_meta() {
  php -r "\$d=json_decode(file_get_contents('$1'),true); echo \$d[$2]['meta']['$3'] ?? '';"
}

# PHP helper: count items in a JSON array
json_count() {
  php -r "echo count(json_decode(file_get_contents('$1'),true));"
}

# PHP helper: extract a field from a JSON object (not array)
json_obj_field() {
  php -r "\$d=json_decode(file_get_contents('$1'),true); echo \$d['$2'] ?? '';"
}

echo "=== Elevation Design Studio — Content Seed ==="
echo ""

# -------------------------------------------------------------------
# 0. Pre-flight
# -------------------------------------------------------------------
echo "→ Checking WordPress installation..."
if ! $WP core is-installed 2>/dev/null; then
  echo "  Installing WordPress..."
  SITE_URL="${WP_HOME:-http://localhost:8080}"
  $WP core install \
    --url="$SITE_URL" \
    --title="Elevation Design Studio" \
    --admin_user="admin" \
    --admin_password="admin" \
    --admin_email="admin@example.com" \
    --skip-email
fi

# -------------------------------------------------------------------
# 1. Theme & settings
# -------------------------------------------------------------------
echo "→ Activating theme and configuring settings..."
$WP theme activate elevation-theme 2>/dev/null || true
$WP rewrite structure '/%postname%/' --hard 2>/dev/null || true
$WP option update blogname "Elevation Design Studio"
$WP option update blogdescription "Architecture & Interior Design in Denver"
$WP option update timezone_string "America/Denver"

# -------------------------------------------------------------------
# 2. Pages (from data/pages.json)
# -------------------------------------------------------------------
echo "→ Creating pages..."

PAGE_COUNT=$(json_count "$DATA/pages.json")
i=0
while [ "$i" -lt "$PAGE_COUNT" ]; do
  slug=$(json_field "$DATA/pages.json" "$i" "slug")
  title=$(json_field "$DATA/pages.json" "$i" "title")
  content=$(json_field "$DATA/pages.json" "$i" "content")

  existing=$($WP post list --post_type=page --name="$slug" --format=ids 2>/dev/null || true)
  if [ -n "$existing" ]; then
    echo "  Page '$title' already exists (ID: $existing), skipping." >&2
    # Store page IDs by slug for later use
    eval "PAGE_ID_$(echo "$slug" | tr '-' '_')=$existing"
  else
    if [ -n "$content" ]; then
      id=$($WP post create --post_type=page --post_title="$title" --post_name="$slug" --post_status=publish --post_content="$content" --porcelain)
    else
      id=$($WP post create --post_type=page --post_title="$title" --post_name="$slug" --post_status=publish --porcelain)
    fi
    echo "  Created page: $title (ID: $id)" >&2
    eval "PAGE_ID_$(echo "$slug" | tr '-' '_')=$id"
  fi
  i=$((i + 1))
done

# Set front page and posts page
$WP option update show_on_front page
$WP option update page_on_front "$PAGE_ID_home"
$WP option update page_for_posts "$PAGE_ID_blog"

echo ""

# -------------------------------------------------------------------
# 3. Projects (from data/projects.json)
# -------------------------------------------------------------------
echo "→ Creating projects..."

PROJECT_COUNT=$(json_count "$DATA/projects.json")
i=0
while [ "$i" -lt "$PROJECT_COUNT" ]; do
  slug=$(json_field "$DATA/projects.json" "$i" "slug")
  title=$(json_field "$DATA/projects.json" "$i" "title")
  excerpt=$(json_field "$DATA/projects.json" "$i" "excerpt")
  image_url=$(json_field "$DATA/projects.json" "$i" "featured_image")

  existing=$($WP post list --post_type=project --name="$slug" --format=ids 2>/dev/null || true)
  if [ -n "$existing" ]; then
    echo "  Project '$title' already exists, skipping."
  else
    id=$($WP post create --post_type=project --post_title="$title" --post_name="$slug" --post_excerpt="$excerpt" --post_status=publish --porcelain)

    # Set meta fields
    for key in location project_type square_footage year_completed; do
      val=$(json_meta "$DATA/projects.json" "$i" "$key")
      if [ -n "$val" ]; then
        $WP post meta update "$id" "$key" "$val"
      fi
    done

    # Import featured image (download first — Unsplash URLs lack extensions)
    if [ -n "$image_url" ]; then
      curl -sL -o "/tmp/$slug.jpg" "$image_url"
      img_id=$($WP media import "/tmp/$slug.jpg" --title="$title" --porcelain 2>/dev/null || true)
      if [ -n "$img_id" ]; then
        $WP post meta update "$id" _thumbnail_id "$img_id"
      fi
      rm -f "/tmp/$slug.jpg"
    fi

    echo "  Created project: $title (ID: $id)"
  fi
  i=$((i + 1))
done

echo ""

# -------------------------------------------------------------------
# 4. Team Members (from data/team.json)
# -------------------------------------------------------------------
echo "→ Creating team members..."

TEAM_COUNT=$(json_count "$DATA/team.json")
i=0
while [ "$i" -lt "$TEAM_COUNT" ]; do
  slug=$(json_field "$DATA/team.json" "$i" "slug")
  title=$(json_field "$DATA/team.json" "$i" "title")
  image_url=$(json_field "$DATA/team.json" "$i" "featured_image")

  existing=$($WP post list --post_type=team_member --name="$slug" --format=ids 2>/dev/null || true)
  if [ -n "$existing" ]; then
    echo "  Team member '$title' already exists, skipping."
  else
    id=$($WP post create --post_type=team_member --post_title="$title" --post_name="$slug" --post_status=publish --porcelain)

    for key in position bio order; do
      val=$(json_meta "$DATA/team.json" "$i" "$key")
      if [ -n "$val" ]; then
        $WP post meta update "$id" "$key" "$val"
      fi
    done

    if [ -n "$image_url" ]; then
      img_id=$($WP media import "$image_url" --title="$title" --porcelain 2>/dev/null || true)
      if [ -n "$img_id" ]; then
        $WP post meta update "$id" _thumbnail_id "$img_id"
      fi
    fi

    echo "  Created team member: $title (ID: $id)"
  fi
  i=$((i + 1))
done

echo ""

# -------------------------------------------------------------------
# 5. Testimonials (from data/testimonials.json)
# -------------------------------------------------------------------
echo "→ Creating testimonials..."

TEST_COUNT=$(json_count "$DATA/testimonials.json")
i=0
while [ "$i" -lt "$TEST_COUNT" ]; do
  slug=$(json_field "$DATA/testimonials.json" "$i" "slug")
  title=$(json_field "$DATA/testimonials.json" "$i" "title")
  image_url=$(json_field "$DATA/testimonials.json" "$i" "featured_image")

  existing=$($WP post list --post_type=testimonial --name="$slug" --format=ids 2>/dev/null || true)
  if [ -n "$existing" ]; then
    echo "  Testimonial '$title' already exists, skipping."
  else
    id=$($WP post create --post_type=testimonial --post_title="$title" --post_name="$slug" --post_status=publish --porcelain)

    for key in author_name author_role rating; do
      val=$(json_meta "$DATA/testimonials.json" "$i" "$key")
      if [ -n "$val" ]; then
        $WP post meta update "$id" "$key" "$val"
      fi
    done

    if [ -n "$image_url" ]; then
      img_id=$($WP media import "$image_url" --title="$title" --porcelain 2>/dev/null || true)
      if [ -n "$img_id" ]; then
        $WP post meta update "$id" _thumbnail_id "$img_id"
      fi
    fi

    echo "  Created testimonial: $title (ID: $id)"
  fi
  i=$((i + 1))
done

echo ""

# -------------------------------------------------------------------
# 6. Blog Posts (from data/posts.json)
# -------------------------------------------------------------------
echo "→ Creating blog posts..."

POST_COUNT=$(json_count "$DATA/posts.json")
i=0
while [ "$i" -lt "$POST_COUNT" ]; do
  slug=$(json_field "$DATA/posts.json" "$i" "slug")
  title=$(json_field "$DATA/posts.json" "$i" "title")
  excerpt=$(json_field "$DATA/posts.json" "$i" "excerpt")
  image_url=$(json_field "$DATA/posts.json" "$i" "featured_image")

  existing=$($WP post list --post_type=post --name="$slug" --format=ids 2>/dev/null || true)
  if [ -n "$existing" ]; then
    echo "  Post '$title' already exists, skipping."
  else
    id=$($WP post create --post_type=post --post_title="$title" --post_name="$slug" --post_excerpt="$excerpt" --post_status=publish --porcelain)

    if [ -n "$image_url" ]; then
      img_id=$($WP media import "$image_url" --title="$title" --porcelain 2>/dev/null || true)
      if [ -n "$img_id" ]; then
        $WP post meta update "$id" _thumbnail_id "$img_id"
      fi
    fi

    echo "  Created post: $title (ID: $id)"
  fi
  i=$((i + 1))
done

echo ""

# -------------------------------------------------------------------
# 7. Gravity Forms contact form
# -------------------------------------------------------------------
echo "→ Creating Gravity Forms contact form..."
GF_ACTIVE=$($WP gf version 2>/dev/null && echo "yes" || echo "no")
if [ "$GF_ACTIVE" = "no" ]; then
  echo "  Gravity Forms not active — skipping form import."
  echo "  Install GF, then re-run: make seed"
elif $WP gf form list 2>/dev/null | grep -q "Contact Form"; then
  echo "  Contact Form already exists, skipping."
else
  $WP gf form import "$DATA/contact-form.json" 2>/dev/null
  echo "  Imported Contact Form."
fi

echo ""

# -------------------------------------------------------------------
# 8. Navigation (from data/navigation.json)
# -------------------------------------------------------------------
echo "→ Creating block navigation..."

NAV_TITLE=$(json_obj_field "$DATA/navigation.json" "title")
NAV_SLUG=$(json_obj_field "$DATA/navigation.json" "slug")

NAV_EXISTS=$($WP post list --post_type=wp_navigation --name="$NAV_SLUG" --format=ids 2>/dev/null || true)
if [ -n "$NAV_EXISTS" ]; then
  echo "  Block navigation already exists (ID: $NAV_EXISTS), skipping."
  NAV_ID="$NAV_EXISTS"
else
  # Extract nav items content and write to temp file (avoids shell escaping)
  php -r "\$d=json_decode(file_get_contents('$DATA/navigation.json'),true); file_put_contents('/tmp/nav-content.html', \$d['items']);"

  NAV_CONTENT=$(cat /tmp/nav-content.html)
  NAV_ID=$($WP post create \
    --post_type=wp_navigation \
    --post_title="$NAV_TITLE" \
    --post_name="$NAV_SLUG" \
    --post_content="$NAV_CONTENT" \
    --post_status=publish \
    --porcelain)
  rm -f /tmp/nav-content.html
  echo "  Created block navigation (ID: $NAV_ID)"
fi

# Update header pattern ref to match this navigation post ID
HEADER_PATTERN="/var/www/html/wp-content/themes/elevation-theme/patterns/header.php"
if [ -f "$HEADER_PATTERN" ]; then
  if grep -q '"ref":' "$HEADER_PATTERN"; then
    sed -i "s/\"ref\":[0-9]*/\"ref\":$NAV_ID/" "$HEADER_PATTERN"
  else
    sed -i "s/wp:navigation {/wp:navigation {\"ref\":$NAV_ID,/" "$HEADER_PATTERN"
  fi
  echo "  Updated header pattern ref to $NAV_ID"
fi

echo ""

# -------------------------------------------------------------------
# 9. Remove default content
# -------------------------------------------------------------------
echo "→ Cleaning up defaults..."

HELLO_WORLD=$($WP post list --post_type=post --name="hello-world" --format=ids 2>/dev/null || true)
if [ -n "$HELLO_WORLD" ]; then
  $WP post delete "$HELLO_WORLD" --force 2>/dev/null || true
  echo "  Deleted default 'Hello World' post."
fi

SAMPLE_PAGE=$($WP post list --post_type=page --name="sample-page" --format=ids 2>/dev/null || true)
if [ -n "$SAMPLE_PAGE" ]; then
  $WP post delete "$SAMPLE_PAGE" --force 2>/dev/null || true
  echo "  Deleted default 'Sample Page'."
fi

echo ""
echo "=== Seed complete! ==="
echo ""
echo "Content created:"
echo "  - 6 pages (Home, About, Services, Portfolio, Contact, Blog)"
echo "  - 6 projects with meta fields and featured images"
echo "  - 4 team members with meta fields and featured images"
echo "  - 3 testimonials with meta fields and featured images"
echo "  - 4 blog posts with featured images"
echo "  - 1 Gravity Forms contact form (if GF active)"
echo "  - Block navigation with submenus"
echo ""
echo "Next steps:"
echo "  1. Install required plugins (WPGraphQL, Gravity Forms, Rank Math)"
echo "  2. Visit http://localhost:8080 to verify"
