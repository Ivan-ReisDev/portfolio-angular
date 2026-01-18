# Requirements - Portfolio Project Showcase

**Derived from:** PROJECT.md, research synthesis
**Last updated:** 2026-01-18

## Scope

Build a project showcase feature for Angular 21 portfolio with carousel navigation and individual project pages.

## Requirements

### Data Layer

| ID | Requirement | Priority | Phase | Status |
|----|-------------|----------|-------|--------|
| REQ-001 | Project data stored in JSON file (`public/data/projects.json`) | Must | 1 | ✓ Complete |
| REQ-002 | Project model with id, title, description, fullDescription, technologies, images, demoUrl, githubUrl, features, iframe fields | Must | 1 | ✓ Complete |
| REQ-003 | ProjectService using Angular signals for state | Must | 1 | ✓ Complete |
| REQ-004 | TransferState integration for SSR hydration | Must | 1 | ✓ Complete |

### Carousel Section

| ID | Requirement | Priority | Phase | Status |
|----|-------------|----------|-------|--------|
| REQ-005 | Project cards display image, title, short description | Must | 2 | ✓ Complete |
| REQ-006 | Technology tags with Devicon icons on cards | Must | 2 | ✓ Complete |
| REQ-007 | GitHub and demo links on cards | Must | 2 | ✓ Complete |
| REQ-008 | Carousel with left/right arrow navigation | Must | 2 | ✓ Complete |
| REQ-009 | Animated transitions between carousel slides | Should | 2 | ✓ Complete |
| REQ-010 | Touch/swipe support for mobile | Should | 2 | ✓ Complete |
| REQ-011 | Dots/indicators for carousel position | Should | 2 | ✓ Complete |

### Project Detail Pages

| ID | Requirement | Priority | Phase | Status |
|----|-------------|----------|-------|--------|
| REQ-012 | Dynamic route `/projeto/:id` for each project | Must | 3 | Pending |
| REQ-013 | Full project description on detail page | Must | 3 | Pending |
| REQ-014 | Image gallery with multiple screenshots | Must | 3 | Pending |
| REQ-015 | Live demo iframe (optional per project) | Should | 3 | Pending |
| REQ-016 | Features list on detail page | Must | 3 | Pending |
| REQ-017 | Previous/next project navigation | Should | 3 | Pending |
| REQ-018 | SSR prerendering for all project pages | Must | 3 | Pending |
| REQ-019 | Overlay pattern preserving scroll-snap | Must | 3 | Pending |

### Accessibility & Polish

| ID | Requirement | Priority | Phase | Status |
|----|-------------|----------|-------|--------|
| REQ-020 | Keyboard navigation for carousel (arrow keys) | Should | 4 | Pending |
| REQ-021 | ARIA labels and roles for carousel | Should | 4 | Pending |
| REQ-022 | Lightbox for gallery images with zoom | Could | 4 | Pending |
| REQ-023 | SEO metadata (title, description) per project | Should | 4 | Pending |
| REQ-024 | Responsive design mobile-first | Must | 2,4 | ✓ Complete (Phase 2) |

### Visual Style

| ID | Requirement | Priority | Phase | Status |
|----|-------------|----------|-------|--------|
| REQ-025 | Follow existing dark theme ($primary-black, $secondary-blue, $gray) | Must | 2 | ✓ Complete |
| REQ-026 | Consistent animations with rest of site | Must | 2 | ✓ Complete |
| REQ-027 | Hover effects on cards | Should | 2 | ✓ Complete |

## Out of Scope

- CMS or backend for project management
- Blog functionality
- Contact form
- Authentication
- Video walkthroughs
- Project filtering by technology (v2)
- Case study format (v2)

## Constraints

- Bundle size: Warning at 500kB, Error at 1MB
- SSR compatibility required
- Angular 21 standalone components only
- Only new dependency: @angular/cdk for accessibility

---
*Requirements derived: 2026-01-18*
