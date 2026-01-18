---
phase: 02-carousel-components
plan: 01
subsystem: ui
tags: [angular, component, glassmorphism, cdk, devicon]

# Dependency graph
requires:
  - phase: 01-data-foundation
    provides: Project model interface
provides:
  - ProjectCard standalone component with glassmorphism styling
  - @angular/cdk for responsive breakpoint detection
affects: [02-02-PLAN, carousel component integration]

# Tech tracking
tech-stack:
  added: ["@angular/cdk@21.1.0"]
  patterns: ["Signal inputs for component props", "Modern SASS color module"]

key-files:
  created:
    - src/app/core/components/project-card/project-card.ts
    - src/app/core/components/project-card/project-card.html
    - src/app/core/components/project-card/project-card.scss
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Used color.adjust() instead of deprecated lighten() for SASS 3.0 compatibility"
  - "16:10 aspect ratio for card images"
  - "Max 3 technology tags shown per card"

patterns-established:
  - "Signal inputs: input.required<T>() for required props, input<T>(default) for optional"
  - "Glassmorphism: rgba background + backdrop-filter blur + subtle border"
  - "Modern SASS: @use 'sass:color' for color manipulation"

# Metrics
duration: 3min
completed: 2026-01-18
---

# Phase 02 Plan 01: ProjectCard Component Summary

**Standalone ProjectCard component with glassmorphism styling, Devicon tech tags, and @angular/cdk installed for responsive carousel support**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-18T13:08:00Z
- **Completed:** 2026-01-18T13:11:31Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Installed @angular/cdk@21.1.0 for BreakpointObserver (carousel responsive behavior)
- Created ProjectCard component with signal-based inputs
- Implemented glassmorphism styling with backdrop-filter blur
- Added hover lift effect and active state for carousel integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @angular/cdk dependency** - `2a973ba` (chore)
2. **Task 2: Create ProjectCard component** - `d4ff519` (feat)

## Files Created/Modified

- `package.json` - Added @angular/cdk dependency
- `package-lock.json` - Updated lock file
- `src/app/core/components/project-card/project-card.ts` - Standalone component with signal inputs
- `src/app/core/components/project-card/project-card.html` - Card template with image, title, description, tags, links
- `src/app/core/components/project-card/project-card.scss` - Glassmorphism styling with hover effects

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Used `color.adjust()` instead of `lighten()` | Deprecated in SASS 3.0, modern syntax future-proofs the code |
| 16:10 aspect ratio for images | Better fit for project screenshots than 16:9 |
| Max 3 tech tags visible | Keeps card layout clean, prevents overflow |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed SASS deprecation warning for lighten() function**
- **Found during:** Task 2 (ProjectCard component creation)
- **Issue:** Build showed deprecation warning for `lighten($secondary-blue, 10%)` - deprecated in Dart SASS 3.0
- **Fix:** Added `@use 'sass:color'` and changed to `color.adjust($secondary-blue, $lightness: 10%)`
- **Files modified:** src/app/core/components/project-card/project-card.scss
- **Verification:** Build passes without SASS deprecation warnings
- **Committed in:** d4ff519 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Minor syntax update for future SASS compatibility. No scope creep.

## Issues Encountered

None - component created as specified.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ProjectCard component ready for integration in ProjectCarousel
- @angular/cdk BreakpointObserver available for responsive viewport detection
- All must-haves verified: image, title, description, tech tags with Devicon, GitHub/demo links, glassmorphism, hover lift

---
*Phase: 02-carousel-components*
*Completed: 2026-01-18*
