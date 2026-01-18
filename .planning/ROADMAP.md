# Roadmap - Portfolio Project Showcase

**Milestone:** v1.0 - Project Showcase Feature
**Created:** 2026-01-18
**Mode:** YOLO | Depth: Comprehensive | Parallel: Yes

## Overview

Build a project showcase section with carousel and individual project pages for Angular 21 portfolio.

**Total phases:** 4
**Estimated requirements:** 27

---

## Phase 1: Data Foundation

**Goal:** Establish data layer with SSR-safe project loading

**Delivers:**
- Project TypeScript interface/model
- JSON data file with 7+ projects structure
- ProjectService with signal-based state
- TransferState integration for hydration

**Requirements:** REQ-001, REQ-002, REQ-003, REQ-004

**Dependencies:** None (foundation phase)

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Create Project model, JSON data file, and ProjectService with TransferState

**Key files:**
- `src/app/core/models/project.model.ts` (new)
- `public/data/projects.json` (new)
- `src/app/core/services/project.service.ts` (new)

**Success criteria:**
- [x] ProjectService returns projects as signal
- [x] Data loads correctly on SSR and client
- [x] No hydration mismatch errors
- [x] JSON structure supports all required fields

**Completed:** 2026-01-18

---

## Phase 2: Carousel Components

**Goal:** Build interactive project carousel for main section

**Delivers:**
- ProjectCard component with image, title, description, tags, links
- ProjectCarousel component with navigation arrows
- Integration with existing Projects section
- Animated transitions between slides

**Requirements:** REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-024, REQ-025, REQ-026, REQ-027

**Dependencies:** Phase 1 (needs ProjectService)

**Plans:** 3 plans

Plans:
- [ ] 02-01-PLAN.md — Install @angular/cdk and create ProjectCard component with glassmorphism
- [ ] 02-02-PLAN.md — Create SwipeDirective and ProjectCarousel with 3D perspective
- [ ] 02-03-PLAN.md — Integrate carousel into Projects section

**Key files:**
- `src/app/core/components/project-card/` (new)
- `src/app/core/components/project-carousel/` (new)
- `src/app/core/directives/swipe.directive.ts` (new)
- `src/app/core/components/projects/projects.ts` (update)

**Success criteria:**
- [ ] Carousel displays project cards
- [ ] Arrow navigation works
- [ ] Cards show all required information
- [ ] Responsive on mobile
- [ ] Animations smooth and consistent

---

## Phase 3: Routing and Detail Pages

**Goal:** Create individual project pages with full details

**Delivers:**
- ProjectDetail page component
- Dynamic route `/projeto/:id`
- SSR prerendering configuration
- Overlay pattern in App component
- Image gallery component
- Previous/next navigation

**Requirements:** REQ-012, REQ-013, REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-019

**Dependencies:** Phase 1 (data), Phase 2 (navigation from cards)

**Key files:**
- `src/app/pages/project-detail/` (new)
- `src/app/app.routes.ts` (update)
- `src/app/app.routes.server.ts` (new for prerender params)
- `src/app/app.ts` (update for overlay pattern)
- `src/app/core/components/image-gallery/` (new)

**Success criteria:**
- [ ] Each project has dedicated URL
- [ ] SSR prerenders all project pages
- [ ] Gallery displays multiple images
- [ ] Optional iframe works when configured
- [ ] Scroll-snap not broken by routing

---

## Phase 4: Polish and Accessibility

**Goal:** Enhance accessibility, SEO, and user experience

**Delivers:**
- Keyboard navigation for carousel
- ARIA roles and labels
- Image lightbox with zoom
- SEO metadata per project
- Final responsive adjustments

**Requirements:** REQ-020, REQ-021, REQ-022, REQ-023, REQ-024

**Dependencies:** Phase 2 (carousel), Phase 3 (detail pages)

**Key files:**
- `src/app/core/components/project-carousel/project-carousel.ts` (update)
- `src/app/core/components/lightbox/` (new)
- `src/app/pages/project-detail/project-detail.ts` (update)

**Success criteria:**
- [ ] Carousel navigable via keyboard
- [ ] Screen readers announce carousel properly
- [ ] Gallery images can be enlarged
- [ ] Project pages have proper meta tags
- [ ] Passes basic a11y audit

---

## Phase Summary

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 | Data Foundation | 4 | Complete |
| 2 | Carousel Components | 11 | Planned |
| 3 | Routing and Detail Pages | 8 | Pending |
| 4 | Polish and Accessibility | 5 | Pending |

**Total:** 27 requirements across 4 phases

---

## Notes

- **Research flags:** Phase 3 may need deeper research for SSR prerendering with JSON filesystem access
- **Parallelization:** Phase 4 accessibility work can partially overlap with Phase 3
- **Only new dependency:** `@angular/cdk@^21.0.0`

---
*Roadmap created: 2026-01-18*
*Phase 1 planned: 2026-01-18*
*Phase 1 completed: 2026-01-18*
*Phase 2 planned: 2026-01-18*
