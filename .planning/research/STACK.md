# Technology Stack: Project Carousel and Detail Pages

**Project:** Angular 21 Portfolio - Project Showcase
**Researched:** 2026-01-18
**Confidence:** HIGH (Angular 21 official docs, Context7)

## Executive Summary

Build the carousel and project pages using Angular 21's native capabilities. No external carousel library needed - the new `animate.enter`/`animate.leave` template animations combined with signals provide everything required. Use `NgOptimizedImage` for image loading performance and Angular CDK for accessibility primitives.

---

## Recommended Stack

### Core Framework (Already in Place)

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Angular | ^21.0.0 | Framework | Already configured with SSR |
| @angular/router | ^21.0.0 | Navigation | Add project routes |
| @angular/common | ^21.0.0 | NgOptimizedImage | Built-in, import from @angular/common |

### New Dependencies to Add

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| @angular/cdk | ^21.0.0 | Accessibility | ListKeyManager, FocusTrap, LiveAnnouncer for a11y |

**Install command:**
```bash
npm install @angular/cdk@^21.0.0
```

### No External Carousel Library

**Decision:** Build custom carousel using Angular 21 native features.

**Rationale:**
- Angular 21's `animate.enter`/`animate.leave` provides clean, template-based animations
- Signals give reactive state management without RxJS overhead
- Full control over accessibility, keyboard navigation, touch gestures
- Smaller bundle (no external dependency)
- SSR-compatible out of the box

Libraries like ngx-carousel-ease exist but add complexity for something achievable with native Angular.

---

## Animation Strategy

### Use: Angular 21 Template Animations (`animate.enter`/`animate.leave`)

**Why:** The legacy `@angular/animations` package is deprecated as of v20.2. The new template-based animation API is the officially recommended approach.

**How it works:**
```html
@if (activeIndex() === i) {
  <div class="slide" animate.enter="slide-in-right" animate.leave="slide-out-left">
    <ng-content />
  </div>
}
```

**CSS keyframe animations (in global styles or component SCSS):**
```scss
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-out-left {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-100%); opacity: 0; }
}

.slide-in-right {
  animation: slide-in-right 0.4s ease-out;
}

.slide-out-left {
  animation: slide-out-left 0.4s ease-out;
}
```

**Key benefits:**
- No additional imports required
- Works with signals and dynamic bindings
- Classes auto-removed after animation completes
- Smaller bundle than `@angular/animations`

### Route Transitions: View Transitions API

**For project detail page navigation**, use Angular's built-in View Transitions support:

```typescript
// app.config.ts
import { provideRouter, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay())
  ]
};
```

**CSS in global styles:**
```scss
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
```

**Note:** View Transitions are in developer preview but work well in Chrome/Chromium. Falls back gracefully in unsupported browsers.

---

## Image Loading Strategy

### Use: NgOptimizedImage

**Why:** Built into `@angular/common`, provides automatic lazy loading, responsive srcsets, and prevents layout shift. SSR-compatible.

**Import:**
```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  // ...
})
```

**Usage patterns:**

**For project thumbnails in carousel (lazy, with dimensions):**
```html
<img
  ngSrc="/images/project-1.webp"
  width="400"
  height="300"
  alt="Project screenshot"
  placeholder
/>
```

**For hero image on detail page (priority loading):**
```html
<img
  ngSrc="/images/project-hero.webp"
  width="1200"
  height="675"
  alt="Project hero"
  priority
/>
```

**For responsive gallery images:**
```html
<img
  ngSrc="/images/screenshot.webp"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Screenshot"
/>
```

**Key attributes:**
| Attribute | Use Case |
|-----------|----------|
| `priority` | Hero/LCP images - sets `fetchpriority=high` and `loading=eager` |
| `placeholder` | Shows blur placeholder while loading (requires CDN loader or manual base64) |
| `fill` | Background-style sizing when dimensions unknown (parent needs `position: relative`) |
| `sizes` | Responsive images with viewport-based sizing |
| `loading="eager"` | Force immediate load (default is lazy) |

---

## Touch Gestures and Mobile Support

### Recommendation: Native Pointer Events (No HammerJS)

**Why avoid HammerJS:**
- Adds 20KB+ to bundle
- Overkill for simple swipe detection
- Modern browsers have good pointer event support

**Implement swipe with native events:**
```typescript
@HostListener('pointerdown', ['$event'])
onPointerDown(event: PointerEvent) {
  this.startX = event.clientX;
}

@HostListener('pointerup', ['$event'])
onPointerUp(event: PointerEvent) {
  const deltaX = event.clientX - this.startX;
  const threshold = 50;

  if (deltaX > threshold) this.previous();
  if (deltaX < -threshold) this.next();
}
```

**Consider HammerJS only if:**
- Need pinch-to-zoom on image galleries
- Need complex multi-touch gestures
- Supporting older mobile browsers

**If HammerJS needed later:**
```bash
npm install hammerjs @types/hammerjs
```

---

## Accessibility (a11y) Implementation

### Use: @angular/cdk/a11y

**Required imports:**
```typescript
import { A11yModule } from '@angular/cdk/a11y';
import { ListKeyManager } from '@angular/cdk/a11y';
import { LiveAnnouncer } from '@angular/cdk/a11y';
```

**Carousel accessibility pattern:**

```html
<section
  role="region"
  aria-roledescription="carousel"
  aria-label="Project showcase"
>
  <div
    role="group"
    aria-roledescription="slide"
    [attr.aria-label]="'Slide ' + (activeIndex() + 1) + ' of ' + totalSlides()"
    aria-live="polite"
  >
    <!-- slide content -->
  </div>

  <div role="group" aria-label="Carousel controls">
    <button
      aria-label="Previous slide"
      [attr.aria-disabled]="activeIndex() === 0"
      (click)="previous()"
    >
      Previous
    </button>
    <button
      aria-label="Next slide"
      [attr.aria-disabled]="activeIndex() === totalSlides() - 1"
      (click)="next()"
    >
      Next
    </button>
  </div>
</section>
```

**Keyboard navigation with ListKeyManager:**
```typescript
@ViewChildren(CarouselSlideDirective) slides: QueryList<CarouselSlideDirective>;

private keyManager: ListKeyManager<CarouselSlideDirective>;

ngAfterViewInit() {
  this.keyManager = new ListKeyManager(this.slides)
    .withWrap()
    .withHorizontalOrientation('ltr');
}

@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  this.keyManager.onKeydown(event);
}
```

**LiveAnnouncer for slide changes:**
```typescript
constructor(private liveAnnouncer: LiveAnnouncer) {}

onSlideChange(index: number, projectName: string) {
  this.liveAnnouncer.announce(`Showing ${projectName}, slide ${index + 1} of ${this.total}`);
}
```

---

## iframe Security for Demo Embeds

### Pattern: DomSanitizer with Whitelisted Domains

**Component setup:**
```typescript
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  // ...
})
export class ProjectDemo {
  private readonly sanitizer = inject(DomSanitizer);

  // Whitelist of allowed demo domains
  private readonly allowedDomains = [
    'stackblitz.com',
    'codesandbox.io',
    'codepen.io',
    'github.dev',
    'vercel.app',  // Your deployed projects
  ];

  safeUrl = computed(() => {
    const url = this.project().demoUrl;
    if (url && this.isAllowedDomain(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  });

  private isAllowedDomain(url: string): boolean {
    try {
      const hostname = new URL(url).hostname;
      return this.allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }
}
```

**Template:**
```html
@if (safeUrl(); as url) {
  <iframe
    [src]="url"
    title="Project demo"
    allow="accelerometer; camera; encrypted-media; gyroscope"
    sandbox="allow-scripts allow-same-origin allow-forms"
    loading="lazy"
  ></iframe>
} @else {
  <a [href]="project().demoUrl" target="_blank" rel="noopener">
    Open demo in new tab
  </a>
}
```

**Security notes:**
- Always validate URLs against whitelist before bypassing sanitizer
- Use `sandbox` attribute to restrict iframe capabilities
- Provide fallback link for untrusted URLs
- Never bypass sanitizer for user-provided URLs without validation

---

## SSR and Hydration Patterns

### Project Data Loading

**Use route resolver for SSR-compatible data:**
```typescript
// project.resolver.ts
export const projectResolver: ResolveFn<Project> = (route) => {
  const projectService = inject(ProjectService);
  const slug = route.paramMap.get('slug');
  return projectService.getProject(slug);
};

// app.routes.ts
export const routes: Routes = [
  {
    path: 'projects/:slug',
    loadComponent: () => import('./pages/project-detail/project-detail'),
    resolve: { project: projectResolver }
  }
];
```

### Defer Blocks for Heavy Content

**Image galleries and iframes with incremental hydration:**
```html
@defer (on viewport; hydrate on viewport) {
  <app-image-gallery [images]="project.screenshots" />
} @placeholder {
  <div class="gallery-placeholder">
    <!-- Low-res preview or skeleton -->
  </div>
}

@defer (on interaction; hydrate on interaction) {
  <app-project-demo [demoUrl]="project.demoUrl" />
} @placeholder {
  <button>Load interactive demo</button>
}
```

**Enable incremental hydration in app.config.ts:**
```typescript
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withIncrementalHydration())
  ]
};
```

---

## Routing Structure

### Recommended Routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app'),
    children: [
      // Home with embedded carousel
      { path: '', pathMatch: 'full', loadComponent: () => import('./core/components/home/home') },

      // Standalone projects page with full carousel
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects')
      },

      // Individual project detail
      {
        path: 'projects/:slug',
        loadComponent: () => import('./pages/project-detail/project-detail'),
        resolve: { project: projectResolver }
      }
    ]
  }
];
```

---

## File Structure Recommendation

```
src/app/
  core/
    components/
      carousel/
        carousel.ts          # Main carousel component with signals
        carousel.html
        carousel.scss
        carousel-slide.directive.ts  # For ListKeyManager
      project-card/
        project-card.ts      # Individual project card in carousel
        project-card.html
        project-card.scss
  pages/
    projects/
      projects.ts            # Full-page projects view
      projects.html
      projects.scss
    project-detail/
      project-detail.ts      # Individual project page
      project-detail.html
      project-detail.scss
      components/
        image-gallery/       # Screenshot gallery
        project-demo/        # iframe embed component
        tech-stack/          # Tech icons display
  shared/
    models/
      project.model.ts       # Project interface
    services/
      project.service.ts     # Project data service
```

---

## Summary: What to Install

**Required:**
```bash
npm install @angular/cdk@^21.0.0
```

**No additional libraries needed for:**
- Carousel animations (use `animate.enter`/`animate.leave`)
- Image optimization (use `NgOptimizedImage` from `@angular/common`)
- Route transitions (use `withViewTransitions()`)
- Basic swipe gestures (use native pointer events)

**Only if needed later:**
```bash
# If complex touch gestures required
npm install hammerjs @types/hammerjs
```

---

## Sources

### Angular Official Documentation
- [Enter and Leave animations](https://angular.dev/guide/animations)
- [Migrating to Native CSS Animations](https://angular.dev/guide/animations/migration)
- [Image Optimization (NgOptimizedImage)](https://angular.dev/guide/image-optimization)
- [Security (DomSanitizer)](https://angular.dev/best-practices/security)
- [DomSanitizer API](https://angular.dev/api/platform-browser/DomSanitizer)
- [Accessibility](https://angular.dev/best-practices/a11y)
- [Deferred loading with @defer](https://angular.dev/guide/templates/defer)
- [Incremental Hydration](https://angular.dev/guide/incremental-hydration)
- [Route transition animations](https://angular.dev/guide/routing/route-transition-animations)
- [Hydration](https://angular.dev/guide/hydration)

### Angular Blog and Announcements
- [Announcing Angular v21](https://blog.angular.dev/announcing-angular-v21-57946c34f14b)
- [Angular's support for the View Transitions API](https://blog.angular.dev/check-out-angulars-support-for-the-view-transitions-api-3937376cfc19)

### Community Resources
- [Angular Enter/Leave Animations in 2025: Old vs New](https://briantree.se/angulars-new-enter-leave-animation-api/)
- [Simplifying Animations with Angular's New Native API - Netanel Basal](https://netbasal.medium.com/simplifying-animations-with-angulars-new-native-api-9584b4db316b)
- [The State of SSR in Angular 2025](https://fluin.io/blog/state-of-angular-ssr-2025)
- [Guide for Server-Side Rendering in Angular](https://www.angulararchitects.io/blog/guide-for-ssr/)
- [How to Test and Improve Carousel Accessibility](https://www.a11y-collective.com/blog/accessible-carousel/)
- [Doing A11y easily with Angular CDK](https://angular.love/doing-a11y-easily-with-angular-cdk-keyboard-navigable-lists/)
- [Create an Accessible News Carousel as Angular Standalone Component](https://www.oidaisdes.org/blog/accessible-news-carousel/)
- [ngx-carousel-ease (signal-based carousel reference)](https://github.com/GreenFlag31/carousel-library)
