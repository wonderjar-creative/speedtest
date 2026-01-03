# Content Structure - Elevation Design Studio

## Pages

### Homepage (/)
- **Template:** Front Page
- **Sections:**
  - Hero (title, tagline, CTA button, background image)
  - Services Overview (3-4 cards)
  - Featured Projects (3 portfolio items)
  - About Preview (short text + image)
  - Testimonials (2-3 quotes)
  - Contact CTA

### About (/about)
- Company story (~500 words)
- Our Philosophy section
- Team members (3-4 people)
- Awards/Recognition list

### Services (/services)
- Page intro
- Service cards:
  1. Residential Design
  2. Commercial Interiors
  3. Renovation & Remodeling
  4. Consultation Services

### Portfolio (/portfolio)
- Archive page for Projects CPT
- Grid layout with filtering

### Contact (/contact)
- Contact form (CF7)
- Office information
- Map embed
- Social links

---

## Custom Post Type: Projects

```php
// projects CPT registration (for reference)
register_post_type('project', [
    'labels' => [...],
    'public' => true,
    'has_archive' => true,
    'menu_icon' => 'dashicons-portfolio',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'show_in_graphql' => true,
    'graphql_single_name' => 'project',
    'graphql_plural_name' => 'projects',
]);
```

### Project Fields (ACF or Custom Fields)
- **location:** Text (e.g., "Denver, CO")
- **project_type:** Select (Residential, Commercial)
- **square_footage:** Number
- **year_completed:** Number
- **gallery:** Gallery field (6-10 images)

### Sample Projects
1. Mountain View Residence - Modern home renovation
2. Urban Loft Transformation - Downtown apartment
3. Lakeside Retreat - Vacation home
4. Tech Startup HQ - Office space
5. Boutique Hotel Lobby - Commercial hospitality
6. Historic Building Revival - Mixed use

---

## Menus

### Primary Navigation
- Home
- About
- Services
- Portfolio
- Contact

### Footer Navigation
- Privacy Policy
- Terms of Service

---

## Widget Areas
- Footer (3 columns)
- Sidebar (not used)

---

## Images Required

### Hero Images
- [ ] Homepage hero (architecture/interior, 1920x1080)
- [ ] About page header (team/office, 1920x600)
- [ ] Services page header (design process, 1920x600)
- [ ] Contact page header (office exterior, 1920x600)

### Team Photos
- [ ] Sarah Mitchell - Principal Designer
- [ ] James Chen - Senior Architect
- [ ] Emily Rodriguez - Interior Designer
- [ ] Michael Thompson - Project Manager

### Portfolio Project Images
- [ ] 6-10 images per project
- [ ] Featured image for each (800x600)
- [ ] Gallery images (various sizes)

### Service Images
- [ ] Residential Design
- [ ] Commercial Interiors
- [ ] Renovation
- [ ] Consultation

### Testimonial Headshots
- [ ] 3 client photos (150x150)

---

## GraphQL Queries Reference

### Get All Projects
```graphql
query GetProjects {
  projects(first: 10) {
    nodes {
      id
      title
      slug
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      projectFields {
        location
        projectType
        yearCompleted
      }
    }
  }
}
```

### Get Single Project
```graphql
query GetProject($slug: ID!) {
  project(id: $slug, idType: SLUG) {
    title
    content
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    projectFields {
      location
      projectType
      squareFootage
      yearCompleted
      gallery {
        sourceUrl
        altText
      }
    }
  }
}
```

### Get Page Content
```graphql
query GetPage($slug: ID!) {
  page(id: $slug, idType: URI) {
    title
    content
  }
}
```
