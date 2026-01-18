# Project Research Summary

**Project:** Angular 21 Portfolio - Project Showcase Feature
**Domain:** Developer Portfolio with Carousel and Detail Pages
**Researched:** 2026-01-18
**Confidence:** HIGH

## Executive Summary

This portfolio project requires building a project showcase feature with carousel navigation and individual detail pages, integrated into an existing scroll-snap architecture. The recommended approach is to use Angular 21's native capabilities exclusively: template-based animations (`animate.enter`/`animate.leave`), signals for state management, and `NgOptimizedImage` for performance. The only new dependency needed is `@angular/cdk` for accessibility primitives. No external carousel library is required.

The architecture should use a modal-overlay pattern for project detail pages, where the main scroll container remains in DOM while detail pages render as overlays via RouterOutlet. This preserves scroll state and maintains the scroll-snap experience. Project data will be stored in a JSON file and served through a signal-based ProjectService with TransferState for SSR hydration consistency.

The critical risks center on SSR/hydration complexity: hydration mismatches with dynamic content, dynamic route prerendering configuration, and scroll-snap conflicts with Angular Router. Each requires proactive mitigation from the start. Secondary risks include carousel accessibility compliance and image gallery memory management.

## Key Findings

### Recommended Stack

Build with Angular 21's native features. The existing stack (Angular 21, SSR configured) is sufficient. Only one new dependency is needed.

**Core technologies:**
- **Angular 21**: Already configured with SSR and prerendering
- **@angular/cdk**: Accessibility primitives (ListKeyManager, FocusTrap, LiveAnnouncer)
- **NgOptimizedImage**: Built-in from @angular/common for image optimization
- **Template Animations**: `animate.enter`/`animate.leave` replaces legacy @angular/animations
- **View Transitions API**: For route transitions via `withViewTransitions()`

**Install command:**
```bash
npm install @angular/cdk@^21.0.0
```

**Not needed:** External carousel libraries (Swiper, Slick, ngx-carousel), HammerJS (native pointer events suffice), separate animation packages.

### Expected Features

**Must have (table stakes):**
- Project cards with image, title, description, and tech tags
- Live demo and GitHub links with clear CTAs
- Individual project pages with full descriptions
- Image gallery for project screenshots
- Responsive design (mobile-first)
- Fast loading with lazy images

**Should have (differentiators):**
- Animated transitions between cards
- Keyboard navigation for carousel
- Lightbox gallery with zoom
- Project filtering by technology
- Live demo iframe embeds (where supported)
- Next/previous project navigation

**Defer to v2+:**
- Video walkthroughs / GIF previews
- Full case study format
- Before/after comparison sliders
- Code snippet highlighting

**Anti-features to avoid:**
- Auto-playing carousel (manual navigation only)
- Wall of text descriptions
- Missing GitHub links
- Broken demo links
- Too many projects (curate 5-8 best)

### Architecture Approach

Use a dual-mode navigation strategy: main scroll sections always rendered, with project detail pages appearing as modal overlays via RouterOutlet. This preserves scroll-snap behavior while enabling deep-linkable, SSR-prerendered project pages.

**Major components:**
1. **ProjectService**: Loads JSON data, caches in signal, provides to components
2. **ProjectCarousel**: Manages carousel state (currentIndex), displays ProjectCards
3. **ProjectCard**: Displays project preview, routes to detail on click
4. **ProjectDetail**: Full project page rendered as overlay
5. **Projects Section**: Container that mounts carousel in scroll-snap flow

**Data flow:** JSON file -> HttpClient -> ProjectService (signal cache) -> Components

### Critical Pitfalls

1. **Hydration mismatch with dynamic content** — Use TransferState API from day one. Avoid `isPlatformBrowser` conditionals in templates. Use `afterNextRender()` for browser-only code.

2. **Dynamic route prerendering failure** — Configure `getPrerenderParams` in `app.routes.server.ts` to read project slugs from JSON. Set fallback strategy (Server or Client).

3. **Scroll-snap conflicts with Router** — Disable Angular's scroll restoration: `withInMemoryScrolling({ scrollPositionRestoration: 'disabled' })`. Implement custom scroll state management.

4. **@defer blocks render empty for SEO** — Avoid `@defer` for carousel content that needs SEO indexing. Use incremental hydration with `withIncrementalHydration()` if deferring.

5. **Carousel accessibility violations** — Build ARIA markup from start: `role="region"`, `aria-roledescription="carousel"`, keyboard navigation with ListKeyManager.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Data Foundation
**Rationale:** Everything depends on the data layer. TransferState must be configured before any component fetches data.
**Delivers:** Project model, JSON data file, ProjectService with SSR-safe data loading
**Addresses:** Project cards need data, table stakes features
**Avoids:** Hydration mismatch (Pitfall 1), Schema drift (Pitfall 9)

### Phase 2: Carousel Components
**Rationale:** Visible progress before tackling routing complexity. Carousel logic is self-contained.
**Delivers:** ProjectCard component, ProjectCarousel component, integration with Projects section
**Uses:** Signals, template animations, NgOptimizedImage
**Implements:** Core UI without routing
**Avoids:** Complex dependencies before fundamentals are solid

### Phase 3: Routing and Detail Pages
**Rationale:** Most complex phase. Depends on working carousel. SSR prerendering requires data layer.
**Delivers:** ProjectDetail page, route configuration, SSR prerendering, overlay pattern in App
**Uses:** Angular Router, View Transitions, server routes
**Avoids:** Scroll-snap conflicts (Pitfall 3), Prerendering failure (Pitfall 2)

### Phase 4: Polish and Accessibility
**Rationale:** Refinement layer. Can be partially parallelized with Phase 3.
**Delivers:** Full keyboard navigation, ARIA improvements, image lightbox, SEO metadata
**Addresses:** Accessibility differentiators, SEO requirements
**Avoids:** Memory leaks (Pitfall 6), Focus management issues (Pitfall 11)

### Phase Ordering Rationale

- **Phase 1 -> 2 -> 3**: Strict dependency chain. Cannot build carousel without data, cannot route without components.
- **Phase 4**: Can start accessibility work during Phase 3, but polish depends on working feature.
- **Grouping logic**: Data layer isolated to enable early testing. Carousel isolated to validate UI patterns. Routing grouped because it touches multiple files (app routes, server routes, app component).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3**: SSR prerendering with filesystem JSON access during build, overlay pattern interaction with scroll-snap, View Transitions fallback behavior

Phases with standard patterns (skip research-phase):
- **Phase 1**: Standard Angular service patterns, well-documented
- **Phase 2**: Carousel is well-documented pattern, custom build is straightforward
- **Phase 4**: Accessibility patterns documented in Angular CDK docs

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Angular 21 official docs, Context7 verified patterns |
| Features | HIGH | Industry consensus across multiple portfolio guides |
| Architecture | HIGH | Angular SSR docs, proven patterns from community |
| Pitfalls | HIGH | Verified with Angular GitHub issues and official error docs |

**Overall confidence:** HIGH

### Gaps to Address

- **JSON access during prerendering**: May need dev server running during build OR filesystem read. Test during Phase 3.
- **Overlay + scroll-snap interaction**: Theoretical pattern; needs validation during Phase 3 implementation.
- **View Transitions browser support**: Chrome-only currently. Fallback is graceful but untested in this context.

## Sources

### Primary (HIGH confidence)
- Angular Official Documentation (angular.dev) — SSR, hydration, routing, NgOptimizedImage, @defer, animations
- Angular Blog — Angular v21 announcement, View Transitions API support
- Angular GitHub Issues — Known bugs for dynamic prerendering, hydration, defer + SSR

### Secondary (MEDIUM confidence)
- Community guides — Netanel Basal (animations), Angular Architects (SSR guide), Brian Treese (enter/leave animations)
- Portfolio best practices — C-Sharp Corner, Medium guides, Hostinger tutorials
- Accessibility guides — A11y Collective, BOIA, Test Party

### Tertiary (LOW confidence)
- ngx-carousel-ease — Reference implementation only, not recommended for use

---
*Research completed: 2026-01-18*
*Ready for roadmap: yes*
