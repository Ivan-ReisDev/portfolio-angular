# Project State

**Project:** Portfolio - Project Showcase
**Milestone:** v1.0
**Updated:** 2026-01-18

## Current Phase

**Phase:** 3 - Routing and Detail Pages
**Status:** Complete
**Plan:** 3/3 complete
**Last Activity:** Phase 3 execution complete, all 12 must-haves verified

## Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Data Foundation | Complete | 1/1 plans, 4/4 reqs |
| 2. Carousel Components | Complete | 3/3 plans, 11/11 reqs verified |
| 3. Routing and Detail Pages | Complete | 3/3 plans, 8/8 reqs verified |
| 4. Polish and Accessibility | Pending | Ready to plan |

**Overall:** ~23/27 requirements complete (85%)

```
Progress: █████████░ 85%
```

## Accumulated Decisions

| Decision | Rationale | Phase |
|----------|-----------|-------|
| Angular signals over BehaviorSubject | Modern reactive pattern, simpler API | 01-01 |
| TransferState for SSR hydration | Prevents double-fetch, no hydration mismatch | 01-01 |
| withFetch() for HttpClient | Better SSR support in Node environment | 01-01 |
| JSON in public/data/ | Static assets, simple and performant | 01-01 |
| color.adjust() over lighten() | SASS 3.0 compatibility, modern syntax | 02-01 |
| 16:10 image aspect ratio | Better fit for project screenshots | 02-01 |
| Max 3 tech tags per card | Clean layout, prevent overflow | 02-01 |
| PointerEvents over HammerJS | Native API, no dependency, mouse + touch | 02-02 |
| toSignal() for breakpoints | Reactive integration with signal-based components | 02-02 |
| Direct jump on dot click | Direct navigation vs scroll-through | 02-02 |
| 30% intersection threshold | Natural animation trigger timing | 02-03 |
| 600ms ease-out entry animation | Smooth reveal without being too slow | 02-03 |
| Full removal of old carousel | No usages, cleaner codebase | 02-03 |
| Simple conditional rendering for lightbox | No CDK Overlay needed, simpler implementation | 03-02 |
| Horizontal scroll for thumbnails | Handles many images without layout issues | 03-02 |
| node:fs in getPrerenderParams | Build-time runs in Node, not browser | 03-01 |
| PrerenderFallback.Server for unknown slugs | SSR fallback instead of 404 for unknown projects | 03-01 |
| Circular navigation for prev/next | Seamless browsing, last goes to first | 03-03 |
| Info column first on mobile | Immediate content access on small screens | 03-03 |
| effectiveSlug computed fallback | Route input binding + snapshot fallback for deep links | 03-03 |
| HostListener for ESC key | Standard UX pattern for modal close | 03-03 |

## Key Patterns Established

- **Signal-based services:** Private writable signals, public readonly exports
- **TransferState pattern:** Check hasKey, get cached, remove after hydration
- **Data storage:** JSON files in public/data/ served as static assets
- **Signal inputs:** `input.required<T>()` for required, `input<T>(default)` for optional
- **Glassmorphism:** rgba background + backdrop-filter blur + subtle border
- **Modern SASS:** `@use 'sass:color'` for color manipulation
- **Swipe detection:** PointerEvents with isPlatformBrowser SSR guard
- **Responsive signals:** toSignal(breakpointObserver.observe()) for reactive breakpoints
- **3D carousel:** CSS preserve-3d with perspective for coverflow effect
- **Scroll animations:** IntersectionObserver with signal for visibility-triggered animations
- **Lightbox pattern:** HostListener for keyboard, conditional render with body scroll lock
- **Route input binding:** withComponentInputBinding + input.required<string>() for slug
- **Dynamic prerendering:** getPrerenderParams reads JSON at build time for static routes
- **Circular navigation:** Computed signal with modulo wrap-around for prev/next
- **Modal with SSR guard:** isPlatformBrowser check for body.style modifications

## Next Actions

1. Plan Phase 4: Polish and Accessibility
2. Add keyboard navigation to carousel
3. Implement SEO metadata per project

## Blockers

None currently.

## Session Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-01-18 | Project initialized | Codebase mapped, research complete, roadmap created |
| 2026-01-18 | Completed 01-01-PLAN | Data foundation: Project model, JSON data, ProjectService |
| 2026-01-18 | Phase 1 Complete | All must-haves verified, ready for Phase 2 |
| 2026-01-18 | Completed 02-01-PLAN | ProjectCard component with glassmorphism, @angular/cdk installed |
| 2026-01-18 | Completed 02-02-PLAN | ProjectCarousel with 3D perspective, SwipeDirective |
| 2026-01-18 | Completed 02-03-PLAN | Projects integration, entry animation, old carousel removed |
| 2026-01-18 | Phase 2 Complete | All carousel requirements verified, ready for Phase 3 |
| 2026-01-18 | Completed 03-02-PLAN | ImageGallery + Lightbox components, SSR fix in App |
| 2026-01-18 | Completed 03-01-PLAN | Routing config, view transitions, SSR prerendering |
| 2026-01-18 | Completed 03-03-PLAN | ProjectDetail page, prev/next nav, demo modal, card links |
| 2026-01-18 | Phase 3 Complete | 12/12 must-haves verified, ready for Phase 4 |

---
*State updated: 2026-01-18*
