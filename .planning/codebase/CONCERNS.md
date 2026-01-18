# Codebase Concerns

**Analysis Date:** 2026-01-18

## Tech Debt

**Incomplete/Stub Components:**
- Issue: Multiple components have placeholder implementations with no real functionality
- Files:
  - `src/app/core/components/carousel/carousel.ts` - Empty component class with only Next/Back buttons
  - `src/app/core/components/carousel/carousel.html` - Stub HTML with non-functional buttons
  - `src/app/pages/blog/blog.ts` - Empty component, just displays "blog works!"
  - `src/app/pages/auth/auth.ts` - Empty component, just displays "auth works!"
- Impact: Projects section cannot display actual projects; Blog and Auth pages are unusable
- Fix approach: Implement carousel logic with project data; build out blog/auth functionality or remove unused components

**Hardcoded Sections Array Duplicated:**
- Issue: Section names array `['inicio', 'sobre', 'projetos', 'educacao', 'blog', 'contato']` is duplicated in 3 methods
- Files: `src/app/app.ts` (lines 57, 78, 92)
- Impact: Risk of inconsistency if sections change; violates DRY principle
- Fix approach: Extract to a single constant at class level or in a shared config

**Inline Placeholder Sections in Template:**
- Issue: Blog and Contato sections are inline HTML placeholders instead of proper components
- Files: `src/app/app.html` (lines 8-9)
- Impact: Cannot easily add functionality; inconsistent with other sections that are components
- Fix approach: Create `<app-blog />` and `<app-contact />` components

**Empty Shared Directory:**
- Issue: `src/app/shared/` directory exists but is empty
- Files: `src/app/shared/`
- Impact: No shared utilities, services, or types despite component duplication opportunities
- Fix approach: Move shared types (e.g., TimelineItem, CardStacksType) and create shared services

**Empty Routes Configuration:**
- Issue: Angular Router is configured but routes array is empty
- Files: `src/app/app.routes.ts` (line 3: `export const routes: Routes = [];`)
- Impact: Blog and Auth pages exist but cannot be navigated to via routing
- Fix approach: Add routes for `/blog` and `/auth` pages, or remove routing if single-page only

**Hardcoded Data in Components:**
- Issue: Large amounts of static data hardcoded directly in component classes
- Files:
  - `src/app/core/components/card-stacks/card-stacks.ts` (lines 15-130) - 19 technology stack items
  - `src/app/core/components/education/education.ts` (lines 20-57) - 6 timeline items
- Impact: Difficult to maintain, translate, or dynamically update; bloats component files
- Fix approach: Move to separate data files (e.g., `data/stacks.ts`, `data/timeline.ts`) or external JSON/CMS

## Known Bugs

**Section ID Mismatch:**
- Symptoms: Navbar shows "Progresso" but section detection uses "educacao"
- Files:
  - `src/app/app.ts` (line 57, 78, 92) - Uses `educacao` in sections array
  - `src/app/core/components/education/education.html` (line 1) - Uses `id="progresso"`
  - `src/app/core/components/navbar/navbar.html` (line 6) - Links to `#progresso`
- Trigger: Click "Progresso" in navbar or scroll to education section
- Workaround: Active state highlight will not work correctly for this section

**Placeholder Social Links:**
- Symptoms: Social sidebar links point to non-existent profiles
- Files: `src/app/app.html` (lines 14-22)
- Trigger: User clicks GitHub, LinkedIn, or Instagram icons
- Workaround: Replace placeholder URLs with actual profile URLs

**App Test Expects Non-existent Content:**
- Symptoms: Test fails looking for `<h1>` with "Hello, portfolio" text
- Files: `src/app/app.spec.ts` (line 21)
- Trigger: Running `npm test`
- Workaround: Update test to match actual content or fix test expectations

## Security Considerations

**External CDN Dependencies:**
- Risk: Loading Font Awesome and Devicon from external CDNs creates dependency on third-party availability and potential XSS vector
- Files: `src/index.html` (lines 9-16)
- Current mitigation: None - no SRI (Subresource Integrity) hashes
- Recommendations: Add SRI hashes to CDN links or bundle icons locally

**Missing Content Security Policy:**
- Risk: No CSP headers configured, allowing potential XSS attacks
- Files: `src/index.html`, no server configuration visible
- Current mitigation: None
- Recommendations: Configure CSP headers in server/deployment configuration

**No Input Sanitization on Dynamic Content:**
- Risk: Low for current static data, but timeline/stack descriptions render directly
- Files: `src/app/core/components/card-stacks/card-stacks.html`, `src/app/core/components/education/education.html`
- Current mitigation: Angular's default HTML encoding
- Recommendations: Keep data static or implement explicit sanitization if data source changes

## Performance Bottlenecks

**Multiple DOM Event Listeners Without Cleanup:**
- Problem: Global `document.addEventListener` for click events added in `ngAfterViewInit`
- Files: `src/app/app.ts` (lines 44-53)
- Cause: Event listener never removed, potential memory leak on navigation
- Improvement path: Move to `ngOnDestroy` cleanup or use Angular's event binding

**IntersectionObserver Per Component:**
- Problem: Each section component creates its own IntersectionObserver instance
- Files:
  - `src/app/core/components/home/home.ts`
  - `src/app/core/components/about/about.ts`
  - `src/app/core/components/projects/projects.ts`
- Cause: Duplicated observer pattern across multiple components
- Improvement path: Create shared service for scroll-based animations; single observer for all sections

**Scroll Snap with Large Sections:**
- Problem: Each section is 100vh with scroll-snap, potentially janky on mobile
- Files: `src/app/app.scss` (lines 19-32)
- Cause: scroll-snap-type: y mandatory can cause issues with varying content heights
- Improvement path: Test on multiple devices; consider proximity snap or debounced smooth scroll

## Fragile Areas

**Active Section Detection Logic:**
- Files: `src/app/app.ts` (lines 91-114)
- Why fragile: Relies on DOM element positions and magic number offset (-100px); breaks if section heights vary
- Safe modification: Test scroll behavior after any layout changes; consider using IntersectionObserver instead
- Test coverage: No tests for scroll detection logic

**Scroll Container Navigation:**
- Files: `src/app/app.ts` (lines 56-89)
- Why fragile: Assumes all sections have exactly 100vh height; keyboard navigation coupled to section order
- Safe modification: Update sections array constant when adding/removing sections
- Test coverage: No tests for navigation methods

**CSS Animation Trigger System:**
- Files:
  - `src/app/core/components/home/home.ts` (lines 22-40) - Uses class toggling with setTimeout
  - `src/app/core/components/about/about.ts` (lines 26-38)
- Why fragile: Magic timeout (50ms), manual class manipulation instead of Angular animations
- Safe modification: Do not change timing without testing; consider Angular Animations API
- Test coverage: No animation tests

## Scaling Limits

**Static Data Growth:**
- Current capacity: 19 stack items, 6 timeline items
- Limit: UI may become crowded with more items; no pagination/virtualization
- Scaling path: Implement lazy loading, pagination, or virtual scrolling for large datasets

**Single Page Application Memory:**
- Current capacity: All sections loaded at once
- Limit: Adding more content-heavy sections increases initial load
- Scaling path: Implement lazy loading for routes; code splitting per section

## Dependencies at Risk

**Angular 21 (Cutting Edge):**
- Risk: Using very recent Angular version (^21.0.0) which may have undiscovered issues
- Impact: Potential breaking changes, limited community resources
- Migration plan: Monitor Angular releases; ensure compatibility before major updates

**No Lock on Minor Versions:**
- Risk: Using caret ranges (`^21.0.0`) for Angular packages
- Impact: npm install may pull different versions, causing inconsistencies
- Migration plan: Consider pinning exact versions or using narrower ranges

## Missing Critical Features

**No Contact Form Implementation:**
- Problem: Contact section is a placeholder with no form or contact method
- Blocks: Users cannot contact portfolio owner through the site

**No Project Data/Content:**
- Problem: Projects section shows title but no actual project cards/data
- Blocks: Cannot showcase work; core portfolio functionality missing

**No Blog Implementation:**
- Problem: Blog page exists but is empty stub
- Blocks: Content marketing, SEO benefits, thought leadership

**No Responsive Design Visible:**
- Problem: No media queries detected in reviewed SCSS; fixed positioning (left: 50px) breaks mobile
- Blocks: Mobile user experience severely limited

**No Internationalization:**
- Problem: All text hardcoded in Portuguese; no i18n setup
- Blocks: International audience reach

## Test Coverage Gaps

**Component Behavior Tests:**
- What's not tested: Scroll detection, navigation, animation triggers, section activation
- Files: `src/app/app.ts`, all component `.ts` files
- Risk: Scroll/navigation bugs can go unnoticed; refactoring is risky
- Priority: High - core functionality untested

**Default Boilerplate Tests Only:**
- What's not tested: All spec files only test "should create" - no behavior testing
- Files: All `*.spec.ts` files
- Risk: Tests provide false confidence; actual functionality not verified
- Priority: High - tests need meaningful assertions

**No E2E Tests:**
- What's not tested: Full user flows, cross-browser behavior
- Files: No Cypress/Playwright configuration found
- Risk: Integration issues between components, browser-specific bugs
- Priority: Medium - add E2E testing framework

---

*Concerns audit: 2026-01-18*
