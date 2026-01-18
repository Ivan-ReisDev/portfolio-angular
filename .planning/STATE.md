# Project State

**Project:** Portfolio - Project Showcase
**Milestone:** v1.0
**Updated:** 2026-01-18

## Current Phase

**Phase:** 2 - Carousel Components
**Status:** Complete
**Plan:** 3 of 3 complete
**Last Activity:** Completed 02-03-PLAN (Projects Integration)

## Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Data Foundation | Complete | 1/1 plans, 4/4 reqs |
| 2. Carousel Components | Complete | 3/3 plans, 11/11 reqs verified |
| 3. Routing and Detail Pages | Ready | Depends on Phase 2 |
| 4. Polish and Accessibility | Blocked | Depends on Phase 3 |

**Overall:** ~15/27 requirements complete (56%)

```
Progress: ██████░░░░ 60%
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

## Next Actions

1. Begin Phase 3: Routing and Detail Pages
2. Create project detail routes with slug-based navigation
3. Add click handlers to carousel cards for navigation

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

---
*State updated: 2026-01-18*
