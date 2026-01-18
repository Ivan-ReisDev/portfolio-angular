# Domain Pitfalls

**Domain:** Angular Project Showcase Feature (Carousel + Detail Pages)
**Project Context:** Angular 21 SSR Portfolio with scroll-snap navigation
**Researched:** 2026-01-18
**Confidence:** HIGH (verified with official Angular documentation and GitHub issues)

---

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

---

### Pitfall 1: Hydration Mismatch with Dynamic Content

**What goes wrong:** Angular SSR pre-renders content on the server, but dynamic project data (from JSON file or API) renders differently on the client, causing hydration errors (NG0500). The DOM tree generated on the server doesn't match what Angular expects on the client.

**Why it happens:**
- Project data loaded asynchronously renders different content server vs client
- Using `isPlatformBrowser` conditionals in templates to show/hide content
- Direct DOM manipulation (innerHTML, appendChild) for project descriptions
- Environment-specific variables affecting render output

**Consequences:**
- Console errors flood (NG0500)
- Full page re-render instead of hydration (defeats SSR benefits)
- Layout shifts visible to users (hurts CLS score)
- SEO impact if search engines get different content than users

**Warning signs:**
- Console shows "NG0500: Hydration Node Mismatch"
- Visible "flash" when page loads where content briefly disappears
- Lighthouse reports high CLS scores
- Different content appears briefly before settling

**Prevention:**
1. Use `TransferState` API to serialize project data on server and rehydrate on client
2. Avoid `*ngIf="isPlatformBrowser()"` patterns in templates
3. Use `afterNextRender()` for browser-only initialization, not conditional rendering
4. Keep rendered content identical across server and client
5. For unavoidable differences, use `ngSkipHydration` sparingly on specific components

**Detection:** Run `ng build` and `ng serve:ssr`, then check console for NG0500 errors.

**Phase to address:** Phase 1 (Data Layer) - Set up proper TransferState from the start.

**Sources:**
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [NG0500: Hydration Node Mismatch](https://angular.dev/errors/NG0500)
- [Angular Hydration Constraints (2025)](https://medium.com/@piyalidas.it/angular-hydration-the-constraints-1e1d7ce7dded)

---

### Pitfall 2: Dynamic Route Prerendering Configuration

**What goes wrong:** Project detail pages (e.g., `/projects/:slug`) fail to prerender because Angular doesn't know which dynamic parameter values to generate at build time.

**Why it happens:**
- `RenderMode.Prerender` requires explicit parameter values via `getPrerenderParams`
- Routes with dynamic segments at the beginning (e.g., `/:projectId/details`) have known bugs
- Missing fallback configuration leaves unmatched routes broken

**Consequences:**
- 404 errors for project detail pages in production
- Broken SEO (pages don't exist until client-side render)
- Build may succeed but routes don't work

**Warning signs:**
- Build completes but route tests fail
- Direct URL access to `/projects/my-project` returns 404
- SSR logs show "route not found" errors

**Prevention:**
1. Configure `getPrerenderParams` in `app.routes.server.ts` to read project slugs from JSON:
```typescript
{
  path: 'projects/:slug',
  renderMode: RenderMode.Prerender,
  async getPrerenderParams() {
    const projects = await loadProjects(); // Read from JSON
    return projects.map(p => ({ slug: p.slug }));
  },
  fallback: PrerenderFallback.Server // Or .Client
}
```
2. Keep dynamic segments at END of path (not beginning)
3. Set fallback strategy for routes not in prerender list
4. Test routes directly via URL, not just navigation

**Detection:** After build, try accessing `/projects/[actual-slug]` directly in browser.

**Phase to address:** Phase 1 (Routing Setup) - Configure server routes before building components.

**Sources:**
- [Angular Server-side Rendering Guide](https://angular.dev/guide/ssr)
- [Routes with Dynamic Parameters Issue #29452](https://github.com/angular/angular-cli/issues/29452)
- [Pre-render Dynamic Routes Guide](https://newsletter.codewithahsan.dev/how-to-pre-render-dynamic-routes-in-angular-a-practical-guide/)

---

### Pitfall 3: Scroll-Snap Navigation Conflicts with Router

**What goes wrong:** The existing scroll-snap full-page navigation conflicts with Angular router when navigating to project detail pages and back. Scroll position gets corrupted, or the router fights with CSS scroll-snap behavior.

**Why it happens:**
- Angular router has its own scroll restoration logic
- CSS `scroll-snap-type: y mandatory` forces scroll positions
- Router transitions may trigger scroll events that confuse snap points
- Returning from detail page doesn't restore correct snap section

**Consequences:**
- User returns to wrong section after viewing project details
- Scroll becomes "sticky" or jumps unexpectedly
- Keyboard navigation breaks after route transitions
- Mobile touch scrolling becomes unpredictable

**Warning signs:**
- Clicking "back" puts user at wrong section
- Scroll "fights" after navigation (visible jittering)
- `onScroll` handler fires unexpectedly during navigation

**Prevention:**
1. Disable Angular's built-in scroll restoration for scroll-snap routes:
```typescript
provideRouter(routes, withInMemoryScrolling({
  scrollPositionRestoration: 'disabled',
  anchorScrolling: 'disabled'
}))
```
2. Implement custom scroll state management:
   - Store `activeSection` in a service before navigation
   - Restore on return using `afterNextRender()`
3. Consider route structure: `/` for main page with sections, `/projects/:slug` for details
4. Use route data or query params to store scroll context
5. Test navigation flow: Main -> Project -> Back repeatedly

**Detection:** Navigate to project detail, press browser back, check if correct section is visible.

**Phase to address:** Phase 2 (Routing Integration) - Handle before building detail pages.

**Sources:**
- [Angular withInMemoryScrolling](https://dev.to/codewithrajat/withinmemoryscrolling-in-angular-modern-scroll-restoration-and-anchor-scrolling-explained-1hl9)
- [Angular Scroll Position Restoration](https://www.dsebastien.net/2020-05-12-handling-scrolling-on-angular-router-transitions/)

---

### Pitfall 4: @defer Block SSR Rendering Gaps

**What goes wrong:** Using `@defer` blocks for lazy-loaded project content results in empty/placeholder content being pre-rendered, hurting SEO and initial load appearance.

**Why it happens:**
- Default `@defer` behavior renders placeholder on server
- Without incremental hydration configuration, deferred content is missing from SSR output
- Zoneless + defer + SSR has known bugs in Angular 20/21

**Consequences:**
- Search engines index placeholder content, not actual projects
- Initial page load shows empty carousels before hydration
- Users see content "pop in" after page load

**Warning signs:**
- View source shows placeholder text instead of project content
- Lighthouse SEO audit flags missing content
- Content appears several seconds after page load

**Prevention:**
1. For SEO-critical content (project cards), avoid `@defer` entirely OR
2. Use incremental hydration with proper triggers:
```html
@defer (hydrate on viewport) {
  <app-project-card [project]="project" />
} @placeholder {
  <app-project-skeleton />
}
```
3. Enable incremental hydration in app config:
```typescript
provideClientHydration(
  withEventReplay(),
  withIncrementalHydration()
)
```
4. Avoid `hydrate never` for content that needs SEO indexing
5. Test by viewing page source (not just rendered page)

**Detection:** View page source after SSR build - check if project content is present.

**Phase to address:** Phase 3 (Carousel Implementation) - Decide defer strategy early.

**Sources:**
- [Angular @defer Guide](https://angular.dev/guide/templates/defer)
- [Incremental Hydration in Angular 21](https://medium.com/@satnammca/rip-prerendering-why-angular-21s-incremental-hydration-is-the-future-14ebd8c7159b)
- [Defer blocks and SSR Issue #54797](https://github.com/angular/angular/issues/54797)

---

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

---

### Pitfall 5: Carousel Accessibility Violations

**What goes wrong:** Custom carousel fails WCAG accessibility requirements, excluding users with screen readers, keyboard-only navigation, or cognitive disabilities.

**Why it happens:**
- Missing ARIA attributes (role, aria-roledescription, aria-label)
- Hidden slides remain in accessibility tree
- No keyboard navigation support
- Auto-advance without pause control (WCAG 2.2.2 violation)
- Focus traps users can't escape

**Consequences:**
- Inaccessible to ~15% of users
- Legal liability (ADA, EAA compliance)
- Poor professional impression for portfolio
- SEO impact (accessibility is ranking factor)

**Warning signs:**
- Cannot navigate carousel with keyboard only
- Screen reader announces wrong number of items
- No way to pause auto-rotation
- Tab key gets "stuck" in carousel

**Prevention:**
1. Add proper ARIA markup:
```html
<div role="region" aria-roledescription="carousel" aria-label="Project showcase">
  <div role="group" aria-roledescription="slide" aria-label="1 of 5">
```
2. Hide non-visible slides from accessibility tree (`aria-hidden="true"` or `display: none`)
3. Implement keyboard navigation (Arrow keys for slides, Tab for controls)
4. Add visible pause button for any auto-rotation
5. Use `aria-live="polite"` region to announce slide changes
6. Provide "Skip carousel" link for keyboard users
7. Ensure 44x44px minimum touch targets for controls

**Detection:** Test with keyboard only, run aXe or WAVE accessibility scanner.

**Phase to address:** Phase 3 (Carousel Implementation) - Build accessibility in from start.

**Sources:**
- [Making Carousels Accessible Guide](https://testparty.ai/blog/carousel-slider-accessibility)
- [BOIA Carousels and Accessibility](https://www.boia.org/blog/carousels-and-accessibility-7-tips)
- [Accessible Angular Carousel Example](https://www.oidaisdes.org/blog/accessible-news-carousel/)

---

### Pitfall 6: Image Gallery Memory Leaks

**What goes wrong:** Image gallery/lightbox components accumulate memory over navigation, causing performance degradation during long sessions.

**Why it happens:**
- Event listeners not cleaned up in `ngOnDestroy`
- Observable subscriptions not unsubscribed
- Image elements cached but never released
- Lightbox modals left in DOM after closing
- IntersectionObserver not disconnected

**Consequences:**
- Browser slows down as user views more projects
- Mobile devices may crash
- Scroll becomes janky

**Warning signs:**
- Memory usage grows in DevTools Performance tab
- Page gets slower the longer user browses
- Browser tab crashes after viewing many projects

**Prevention:**
1. Use `DestroyRef` or `takeUntilDestroyed()` for subscriptions:
```typescript
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.imageService.getImages()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();
}
```
2. Disconnect IntersectionObservers in `ngOnDestroy`
3. Remove event listeners added manually
4. Clear lightbox DOM elements when closed
5. Use Angular DevTools to monitor component lifecycle
6. Limit images kept in DOM (virtualize if needed)

**Detection:** Chrome DevTools > Performance > Record while navigating through projects > Check memory growth.

**Phase to address:** Phase 4 (Image Gallery) - Implement cleanup patterns.

**Sources:**
- [Angular Memory Leaks Guide](https://medium.com/javarevisited/angular-memory-leak-heres-how-to-diagnose-and-fix-it-with-demos-bc378d0676fd)
- [Practical Guide to Memory Leaks in Angular](https://stackademic.com/blog/a-practical-guide-to-memory-leaks-in-angular-and-how-to-solve-them-16c91e69437b)

---

### Pitfall 7: iframe Demo Security Issues

**What goes wrong:** Embedding project demos via iframes exposes security vulnerabilities or gets blocked by CSP policies.

**Why it happens:**
- Unsafe URL sanitization bypasses
- Missing sandbox attributes
- External sites may have X-Frame-Options blocking
- CSP not configured for iframe sources

**Consequences:**
- Demos don't load (blank iframes)
- XSS vulnerabilities if URLs not sanitized
- Console errors about refused frame connections
- Clickjacking risks

**Warning signs:**
- iframes appear blank
- Console shows "Refused to display in a frame"
- DomSanitizer warnings in development

**Prevention:**
1. Always sanitize iframe URLs:
```typescript
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

getSafeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
```
2. Add sandbox attribute with minimal permissions:
```html
<iframe [src]="safeUrl" sandbox="allow-scripts allow-same-origin"></iframe>
```
3. Configure CSP headers in server.ts:
```typescript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-src 'self' https://trusted-domain.com");
  next();
});
```
4. Provide fallback for blocked iframes (screenshot + link)
5. Only embed demos from your own domains when possible

**Detection:** Test each demo iframe source, check console for CSP errors.

**Phase to address:** Phase 5 (iframe Integration) - Security review before implementation.

**Sources:**
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [Secure iframes in 2025](https://www.feroot.com/blog/how-to-secure-iframe-compliance-2025/)
- [Angular iframe Security](https://www.techiediaries.com/angular-iframe/)

---

### Pitfall 8: NgOptimizedImage Misconfiguration

**What goes wrong:** Images load slowly or with visible layout shifts despite using Angular's optimized image directive.

**Why it happens:**
- Missing `priority` attribute on LCP (largest contentful paint) images
- Missing width/height attributes causing layout shifts
- Using `loading="eager"` instead of `priority`
- Same image with priority in carousel and non-priority elsewhere

**Consequences:**
- Poor Lighthouse performance scores
- Visible layout shifts (high CLS)
- Slow LCP affects SEO rankings

**Warning signs:**
- Lighthouse flags LCP issues
- Images cause visible page "jumping"
- Console warnings about priority images

**Prevention:**
1. Mark carousel's first visible image with `priority`:
```html
<img ngSrc="project-hero.jpg" priority width="800" height="600" />
```
2. Always include width and height attributes
3. Use `fill` mode for responsive containers:
```html
<div style="position: relative; width: 100%; aspect-ratio: 16/9;">
  <img ngSrc="image.jpg" fill priority />
</div>
```
4. Don't mix `priority` and `loading="eager"` on same image
5. Configure image loader for CDN optimization
6. Use `placeholder="blur"` for non-priority images

**Detection:** Run Lighthouse audit, check LCP element in Performance tab.

**Phase to address:** Phase 4 (Image Gallery) - Configure from first image implementation.

**Sources:**
- [NgOptimizedImage Guide](https://angular.dev/guide/image-optimization)
- [Improve LCP with NgOptimizedImage](https://angularindepth.com/posts/1511/improve-page-performance-and-lcp-with-ngoptimizedimage)

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

---

### Pitfall 9: JSON Data Schema Drift

**What goes wrong:** Project data JSON file structure diverges from TypeScript interfaces, causing runtime errors.

**Why it happens:**
- Manual JSON editing without validation
- Interface updates not reflected in JSON
- Optional vs required fields confusion

**Consequences:**
- Runtime errors when accessing missing properties
- Undefined values breaking templates
- Inconsistent project card displays

**Prevention:**
1. Define strict TypeScript interface:
```typescript
interface Project {
  slug: string;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  demoUrl?: string;  // Optional
}
```
2. Validate JSON against schema in build/test
3. Use JSON schema validation (ajv library)
4. Add unit tests that load and validate project data

**Detection:** TypeScript errors, undefined property access in templates.

**Phase to address:** Phase 1 (Data Layer) - Define schema first.

---

### Pitfall 10: SEO Metadata Not Dynamic

**What goes wrong:** All project pages share same meta title/description, hurting SEO.

**Why it happens:**
- Forgot to update Meta/Title services per route
- Route resolver doesn't set metadata
- SSR doesn't execute metadata updates

**Consequences:**
- Duplicate meta descriptions across projects
- Poor search result appearance
- Lower click-through rates

**Prevention:**
1. Use route resolvers or guards to set metadata:
```typescript
export const projectResolver: ResolveFn<void> = (route) => {
  const meta = inject(Meta);
  const title = inject(Title);
  const projectService = inject(ProjectService);

  const project = projectService.getBySlug(route.params['slug']);
  title.setTitle(`${project.title} | Portfolio`);
  meta.updateTag({ name: 'description', content: project.description });
};
```
2. Add Open Graph tags for social sharing
3. Verify metadata in View Source (not just rendered page)

**Detection:** Check View Source on different project pages - metadata should differ.

**Phase to address:** Phase 2 (Detail Pages) - Include in route setup.

**Sources:**
- [Angular SEO Best Practices 2025](https://blog.emb.global/angular-seo/)
- [Angular Portfolio SSR and SEO](https://dev.to/abhijeet182/how-i-built-my-personal-portfolio-website-using-angular-18-ssr-and-seo-best-practices-2kl5)

---

### Pitfall 11: Carousel Keyboard Focus Management

**What goes wrong:** Focus gets lost or trapped when interacting with carousel via keyboard.

**Why it happens:**
- Focus moves to hidden slides
- No focus management after slide transitions
- Modal lightbox doesn't trap focus properly

**Consequences:**
- Keyboard users lose their place
- Tab order becomes unpredictable
- Accessibility failures

**Prevention:**
1. After slide transition, move focus to new visible content
2. Hide non-visible slides from tab order (`tabindex="-1"`)
3. For lightbox, implement focus trap (cdkTrapFocus or custom)
4. Restore focus to trigger element when lightbox closes

**Detection:** Navigate entire carousel using only Tab and Arrow keys.

**Phase to address:** Phase 3 (Carousel Implementation).

---

## Phase-Specific Warnings Summary

| Phase | Primary Pitfall | Mitigation |
|-------|-----------------|------------|
| Phase 1: Data Layer | Hydration mismatch, Schema drift | Use TransferState, define strict interfaces |
| Phase 2: Routing | Dynamic prerendering, Scroll conflicts | Configure getPrerenderParams, disable router scroll |
| Phase 3: Carousel | SSR empty content, Accessibility | Avoid @defer for SEO content, build a11y from start |
| Phase 4: Image Gallery | Memory leaks, NgOptimizedImage | Use DestroyRef, mark LCP images |
| Phase 5: iframe Demos | Security, CSP | Sanitize URLs, sandbox attribute, fallbacks |
| Phase 6: Polish | SEO metadata | Dynamic meta per route |

---

## Pre-Implementation Checklist

Before starting each phase, verify:

- [ ] TransferState configured for server/client data consistency
- [ ] `app.routes.server.ts` has `getPrerenderParams` for dynamic routes
- [ ] Router scroll restoration disabled or custom managed
- [ ] Accessibility requirements documented (WCAG 2.1 AA target)
- [ ] Image optimization strategy decided (NgOptimizedImage + CDN)
- [ ] iframe source whitelist defined
- [ ] JSON schema matches TypeScript interfaces
- [ ] SEO metadata strategy planned

---

## Sources

### Official Documentation
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Angular Security Best Practices](https://angular.dev/best-practices/security)
- [NgOptimizedImage Directive](https://angular.dev/guide/image-optimization)
- [Angular @defer Guide](https://angular.dev/guide/templates/defer)

### GitHub Issues (Known Bugs)
- [Dynamic Route Prerendering #29452](https://github.com/angular/angular-cli/issues/29452)
- [Hydration with Lazy Components #62592](https://github.com/angular/angular/issues/62592)
- [@defer SSR Issue #54797](https://github.com/angular/angular/issues/54797)
- [Zoneless + Defer + SSR #61038](https://github.com/angular/angular/issues/61038)

### Community Resources
- [State of SSR in Angular 2025](https://fluin.io/blog/state-of-angular-ssr-2025)
- [Angular SSR Everything You Need to Know](https://angular.love/angular-ssr-everything-you-need-to-know/)
- [Making Carousels Accessible](https://testparty.ai/blog/carousel-slider-accessibility)
- [Angular Memory Leaks Guide](https://medium.com/javarevisited/angular-memory-leak-heres-how-to-diagnose-and-fix-it-with-demos-bc378d0676fd)
- [Angular SEO Best Practices 2025](https://blog.emb.global/angular-seo/)
