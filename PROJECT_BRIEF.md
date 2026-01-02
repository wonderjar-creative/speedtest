# PROJECT BRIEF: Denver Headless Speed Test

## Overview

| Field | Value |
|-------|-------|
| Project | Speed Test POC |
| Purpose | Marketing demo proving headless performance benefits |
| Timeline | 1-2 weeks |
| Type | Internal tool (not client work) |
| URL | speedtest.denverheadless.com |

## The Concept

Split-screen comparison showing:
- **Left:** Traditional WordPress (intentionally typical, not optimized)
- **Right:** Same content via headless architecture (optimized)
- **Above each:** Live performance metrics

**The message:** "Same content. Same backend. 5x faster."

## Demo Business: Elevation Design Studio

Architecture & interior design firm based in Denver.

**Brand:**
- Name: Elevation Design Studio
- Tagline: "Designing Spaces That Inspire"
- Industry: Architecture & Interior Design
- Location: Denver, Colorado
- Vibe: Modern, professional, creative

**Why this business:**
- Visually rich (portfolio/project imagery)
- Professional services = target client type
- Design-focused = ironic if their site is slow
- Good stock photo availability

---

## Site Structure

### Pages (Both Versions)

#### 1. Homepage (/)
- Hero with background image
- Services overview (3-4 cards)
- Featured projects (3 portfolio items)
- About preview
- Testimonials (2-3)
- Contact CTA

#### 2. About (/about)
- Company story (500 words)
- Our approach/philosophy
- Team section (3-4 members)
- Awards/recognition

#### 3. Services (/services)
- Residential Design
- Commercial Interiors
- Renovation & Remodeling
- Consultation Services
- Each with description, image

#### 4. Portfolio (/portfolio)
- 6-8 project thumbnails
- Filter by type (residential/commercial)
- Grid layout

#### 5. Portfolio Single (/portfolio/[slug])
- Project hero image
- Project details (location, size, scope)
- Image gallery (6-10 images)
- Description
- Related projects

#### 6. Contact (/contact)
- Contact form
- Office info
- Map embed
- Social links

---

## Technical Architecture

### Three Deployments

```
┌─────────────────────────────────────────────────────┐
│  Comparison Interface                                │
│  speedtest.denverheadless.com                       │
│  Next.js on Vercel                                  │
└─────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Traditional WP      │    │  Headless Frontend   │
│  slow.speedtest...   │    │  fast.speedtest...   │
│  Lightsail ($5/mo)   │    │  Vercel (free)       │
└──────────────────────┘    └──────────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    ▼
         ┌──────────────────────┐
         │  WordPress Backend   │
         │  (shared content)    │
         └──────────────────────┘
```

### Tech Stack

**Comparison Interface:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Deploy: Vercel

**Traditional WordPress:**
- WordPress 6.4+
- Theme: Astra or GeneratePress
- Plugins: Yoast, Contact Form 7, WP Super Cache, WPGraphQL
- Hosting: AWS Lightsail nano ($5/mo)
- NOT optimized - intentionally typical

**Headless Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- WPGraphQL for data
- next/image for optimization
- ISR for caching
- Deploy: Vercel

---

## Comparison Interface Design

### Desktop Layout

```
┌──────────────────────────────────────────────────────┐
│              DENVER HEADLESS SPEED TEST              │
│        See the difference architecture makes         │
└──────────────────────────────────────────────────────┘

┌────────────────────────┬─────────────────────────────┐
│   Traditional WP       │    Headless Architecture    │
│                        │                             │
│   Score: 52/100       │    Score: 98/100           │
│   LCP: 4.1s           │    LCP: 0.7s               │
│   FCP: 2.3s           │    FCP: 0.4s               │
│                        │                             │
│  ┌────────────────┐   │   ┌────────────────┐       │
│  │                │   │   │                │       │
│  │   [iframe]     │   │   │   [iframe]     │       │
│  │                │   │   │                │       │
│  └────────────────┘   │   └────────────────┘       │
└────────────────────────┴─────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  [Home] [About] [Services] [Portfolio] [Contact]     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Same content. Same WordPress backend.               │
│  The only difference is the frontend architecture.   │
│                                                      │
│  [Want These Results? Let's Talk]                    │
└──────────────────────────────────────────────────────┘
```

### Mobile Layout
- Stacked vertically (traditional on top, headless below)
- Or toggle between views
- Metrics always visible

### Metrics to Display

| Metric | Traditional | Headless |
|--------|-------------|----------|
| Performance Score | 45-60 | 95-100 |
| LCP | 3.5-5.0s | 0.6-1.0s |
| FCP | 1.8-2.5s | 0.3-0.5s |
| TBT | 600-1000ms | 0-100ms |
| CLS | 0.1-0.25 | 0-0.05 |

**v1:** Hardcoded realistic metrics
**v2:** Live PageSpeed Insights API (future)

---

## Content Requirements

### Images Needed (Unsplash)

**Homepage:**
- Hero: Modern interior or architecture shot
- 3-4 service icons or images
- 3 portfolio preview images
- 2-3 testimonial headshots

**About:**
- Team photo or office
- 3-4 individual headshots
- 1-2 process/studio images

**Services:**
- 4 service-related images

**Portfolio:**
- 6-8 project images (interiors, exteriors)
- 6-10 images per project detail page

**Contact:**
- Office exterior or header image

### Copy Needed

All content can be AI-generated:
- Homepage sections (~500 words total)
- About page (~600 words)
- Service descriptions (4 x 150 words)
- Portfolio project descriptions (6-8 x 100 words)
- Team bios (4 x 75 words)
- Testimonials (3 x 50 words)

---

## Implementation Plan

### Phase 1: WordPress Setup (Days 1-2)
- [ ] Provision Lightsail nano instance
- [ ] Install WordPress
- [ ] Install theme (Astra)
- [ ] Install plugins (Yoast, CF7, WPGraphQL, cache)
- [ ] Create pages and content
- [ ] Add images
- [ ] Configure menus
- [ ] Set up domain: slow.speedtest.denverheadless.com

### Phase 2: Headless Frontend (Days 3-4)
- [ ] Create Next.js project
- [ ] Set up Tailwind
- [ ] Configure WPGraphQL client
- [ ] Build all pages
- [ ] Optimize images
- [ ] Deploy to Vercel
- [ ] Set up domain: fast.speedtest.denverheadless.com

### Phase 3: Comparison Interface (Days 5-6)
- [ ] Create Next.js project
- [ ] Build split-screen layout
- [ ] Add metrics display
- [ ] Add page navigation
- [ ] Responsive design
- [ ] Deploy to Vercel
- [ ] Set up domain: speedtest.denverheadless.com

### Phase 4: Polish (Days 7-8)
- [ ] Run actual performance tests
- [ ] Update metrics with real numbers
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Copy refinement
- [ ] Final deployment

---

## Domains & DNS

| Subdomain | Points to |
|-----------|-----------|
| speedtest.denverheadless.com | Vercel (comparison) |
| slow.speedtest.denverheadless.com | Lightsail IP |
| fast.speedtest.denverheadless.com | Vercel (headless) |

---

## Success Criteria

**Technical:**
- [ ] All three sites load correctly
- [ ] Performance difference is dramatic
- [ ] Page navigation syncs
- [ ] Responsive on all devices
- [ ] No console errors

**Business:**
- [ ] Clearly proves value proposition
- [ ] Easy for non-technical people to understand
- [ ] Professional appearance
- [ ] Shareable link works
- [ ] Can use in sales calls

---

## Out of Scope (v1)

- User accounts
- Live PageSpeed API (use hardcoded metrics)
- Network throttling simulation
- Video recording of loads
- Custom URL testing
- Historical tracking

---

## Marketing Use

**Sales calls:** Screen share the comparison, walk through metrics
**Cold outreach:** "See the difference: [link]"
**Social media:** Screenshots and recordings
**Portfolio:** Feature on denverheadless.com
**Proposals:** Reference in client proposals
