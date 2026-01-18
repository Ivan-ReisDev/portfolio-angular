# Phase 3: Routing and Detail Pages - Research

**Researched:** 2026-01-18
**Domain:** Angular 21 Routing, SSR Prerendering, Image Gallery
**Confidence:** HIGH

## Summary

This phase implements dynamic project detail pages with Angular 21's routing and SSR prerendering capabilities. The research covers three main domains: (1) routing configuration with `getPrerenderParams` for dynamic routes, (2) image gallery with lightbox functionality, and (3) navigation patterns including scroll restoration and view transitions.

The project already has SSR configured with `@angular/ssr` and uses the modern `RenderMode` system. The current `projects.json` uses `id` fields (e.g., `sistema-gestao`) which serve as slugs. The user decision requires URL format `/projeto/:slug` with Portuguese naming.

**Primary recommendation:** Configure `ServerRoutePrerenderWithParams` with `getPrerenderParams` that reads project IDs from JSON at build time. Use a custom lightbox component built with Angular CDK overlay for the image gallery. Enable `withViewTransitions()` for smooth page transitions.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @angular/router | ^21.0.0 | Routing with dynamic params | Framework router |
| @angular/ssr | ^21.0.0 | SSR with prerendering | Official SSR solution |
| @angular/cdk | ^21.1.0 | Overlay for lightbox | Already used, no new deps |

### New Router Features to Enable
| Feature | Import | Purpose | Configuration |
|---------|--------|---------|---------------|
| withViewTransitions | @angular/router | Page transition animations | provideRouter feature |
| withComponentInputBinding | @angular/router | Bind route params to inputs | provideRouter feature |
| withInMemoryScrolling | @angular/router | Scroll restoration | provideRouter feature |

### No Additional Libraries Needed

The image gallery and lightbox can be built with:
- Angular CDK Overlay (already installed)
- Native CSS animations
- Existing SwipeDirective (already built in Phase 2)

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure
```
src/app/
├── app.routes.ts                    # Add /projeto/:slug route
├── app.routes.server.ts             # Add getPrerenderParams
├── app.config.ts                    # Add router features
├── pages/
│   └── project-detail/
│       ├── project-detail.ts        # Main page component
│       ├── project-detail.html
│       └── project-detail.scss
└── core/
    └── components/
        └── image-gallery/
            ├── image-gallery.ts     # Gallery with thumbnails
            ├── image-gallery.html
            ├── image-gallery.scss
            └── lightbox/
                ├── lightbox.ts      # Fullscreen overlay
                ├── lightbox.html
                └── lightbox.scss
```

### Pattern 1: SSR Prerendering with getPrerenderParams

**What:** Configure dynamic routes to be prerendered at build time
**When to use:** Routes with parameters that can be enumerated at build time

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';
import { inject } from '@angular/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projeto/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // inject() must be called synchronously, before any await
      // For build-time, read directly from filesystem or use fetch
      const response = await fetch('http://localhost:4200/data/projects.json');
      const data = await response.json();
      return data.projects.map((p: { id: string }) => ({ slug: p.id }));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

**CRITICAL:** The `inject()` function must be called synchronously at the top of `getPrerenderParams`, before any `await` statements. However, for build-time prerendering, consider using direct file reads instead of HttpClient since the server may not be running during build.

### Pattern 2: Route Parameter with Signal Input

**What:** Bind route params directly to component inputs using signals
**When to use:** Components that need reactive access to route parameters

```typescript
// project-detail.ts
import { Component, input, computed, inject, effect } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-project-detail',
  // ...
})
export class ProjectDetail {
  // Route param bound via withComponentInputBinding()
  slug = input.required<string>();

  private readonly projectService = inject(ProjectService);

  // Derived project from slug
  readonly project = computed(() => {
    const s = this.slug();
    return this.projectService.projects().find(p => p.id === s);
  });
}
```

**Configuration required in app.config.ts:**
```typescript
provideRouter(
  routes,
  withComponentInputBinding(),
  withViewTransitions(),
  withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })
)
```

### Pattern 3: CDK Overlay Lightbox

**What:** Fullscreen image viewer using Angular CDK
**When to use:** Modal/lightbox that needs proper focus trapping and keyboard nav

```typescript
// lightbox.ts
import { Component, inject, signal, HostListener } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-lightbox',
  imports: [A11yModule],
  template: `
    <div class="lightbox-backdrop"
         (click)="close()"
         cdkTrapFocus
         cdkTrapFocusAutoCapture>
      <button class="close-btn" (click)="close()">X</button>
      <img [src]="currentImage()" [alt]="alt()" />
      <button class="nav-prev" (click)="prev(); $event.stopPropagation()">
        <span class="sr-only">Previous</span>
      </button>
      <button class="nav-next" (click)="next(); $event.stopPropagation()">
        <span class="sr-only">Next</span>
      </button>
      <span class="counter">{{ currentIndex() + 1 }} de {{ total() }}</span>
    </div>
  `
})
export class Lightbox {
  images = signal<string[]>([]);
  currentIndex = signal(0);

  currentImage = computed(() => this.images()[this.currentIndex()]);
  total = computed(() => this.images().length);
  alt = signal('');

  @HostListener('document:keydown.escape')
  onEscape() { this.close(); }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft() { this.prev(); }

  @HostListener('document:keydown.arrowright')
  onArrowRight() { this.next(); }

  // ... navigation and close methods
}
```

### Pattern 4: Navigation Between Projects (Circular)

**What:** Previous/Next project navigation with circular wrapping
**When to use:** Footer of detail page

```typescript
// Computed signals for adjacent projects
readonly projectIndex = computed(() => {
  const projects = this.projectService.projects();
  const currentSlug = this.slug();
  return projects.findIndex(p => p.id === currentSlug);
});

readonly prevProject = computed(() => {
  const projects = this.projectService.projects();
  const idx = this.projectIndex();
  if (idx === -1) return null;
  // Circular: last project wraps to first
  const prevIdx = idx === 0 ? projects.length - 1 : idx - 1;
  return projects[prevIdx];
});

readonly nextProject = computed(() => {
  const projects = this.projectService.projects();
  const idx = this.projectIndex();
  if (idx === -1) return null;
  // Circular: first project wraps to last
  const nextIdx = idx === projects.length - 1 ? 0 : idx + 1;
  return projects[nextIdx];
});
```

### Pattern 5: Scroll to Projects Section on Back Navigation

**What:** When returning from detail page, scroll to Projects section
**When to use:** Back button or browser back navigation

```typescript
// In ProjectDetail component
import { Router, NavigationEnd } from '@angular/router';

goBack(): void {
  this.router.navigate(['/'], { fragment: 'projetos' });
}

// Or in App component, listen to navigation events
constructor() {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    filter(event => event.url === '/' || event.urlAfterRedirects?.includes('#projetos'))
  ).subscribe(() => {
    // Scroll to projetos section after navigation completes
    setTimeout(() => {
      document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
}
```

### Anti-Patterns to Avoid

- **Using inject() after await in getPrerenderParams:** inject() must be synchronous; store reference before async operations
- **Hardcoding project slugs:** Always read from source of truth (projects.json)
- **Building custom lightbox without CDK:** Loses focus trapping, escape handling, overlay management
- **Using RenderMode.Server for static content:** Projects don't change per-request, use Prerender
- **Not handling missing projects:** Always handle case where slug doesn't match any project

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trapping in lightbox | Custom tabindex management | CDK cdkTrapFocus | Handles edge cases, screen readers |
| Escape key closing | document.keydown listener | CDK overlay or HostListener | Proper cleanup, no memory leaks |
| Route param access | ActivatedRoute subscription | input() + withComponentInputBinding | Cleaner, signal-based, less boilerplate |
| Swipe gestures | New touch handlers | Existing SwipeDirective | Already built in Phase 2 |
| Breakpoint detection | window.resize listener | toSignal(BreakpointObserver) | Already pattern in ProjectCarousel |

**Key insight:** The project already has patterns established (signals, CDK, SwipeDirective). Follow these patterns rather than introducing new approaches.

## Common Pitfalls

### Pitfall 1: getPrerenderParams inject() Timing

**What goes wrong:** `inject()` called after `await` throws "inject() must be called from injection context"
**Why it happens:** `getPrerenderParams` is async but inject only works synchronously
**How to avoid:** Call inject() at the very start, store reference, then use in async operations
**Warning signs:** Build-time errors about injection context

```typescript
// WRONG
async getPrerenderParams() {
  const response = await fetch('/data/projects.json');
  const service = inject(ProjectService); // ERROR!
}

// RIGHT
async getPrerenderParams() {
  const service = inject(ProjectService); // OK - synchronous
  const ids = await service.getProjectIds();
  return ids.map(id => ({ slug: id }));
}

// BEST for build-time (no server needed)
async getPrerenderParams() {
  const fs = await import('fs/promises');
  const data = JSON.parse(await fs.readFile('public/data/projects.json', 'utf-8'));
  return data.projects.map((p: { id: string }) => ({ slug: p.id }));
}
```

### Pitfall 2: Deep Link Signal Input Binding Issue (Angular 19+)

**What goes wrong:** Signal input from route params is undefined on direct page load
**Why it happens:** Known timing issue in `withComponentInputBinding()` during bootstrap
**How to avoid:** Provide fallback using ActivatedRoute snapshot
**Warning signs:** Works on in-app navigation but fails on page refresh/direct link

```typescript
// Workaround
private route = inject(ActivatedRoute);
slug = input<string>('');

// Use computed with fallback
readonly effectiveSlug = computed(() =>
  this.slug() || this.route.snapshot.paramMap.get('slug') || ''
);
```

### Pitfall 3: Scroll Restoration with Async Content

**What goes wrong:** Scroll position restored before content loads
**Why it happens:** Angular restores position immediately, but content from TransferState may not be rendered
**How to avoid:** TransferState already handles this; ensure projects are loaded before navigating
**Warning signs:** Page jumps to wrong position on back navigation

### Pitfall 4: Lightbox Body Scroll Lock

**What goes wrong:** Background page scrolls while lightbox is open
**Why it happens:** Body scroll not disabled
**How to avoid:** Add `overflow: hidden` to body when lightbox opens
**Warning signs:** Scroll-snap sections change while viewing lightbox

```typescript
openLightbox() {
  document.body.style.overflow = 'hidden';
}

closeLightbox() {
  document.body.style.overflow = '';
}
```

### Pitfall 5: Prerendering Fetches from Wrong URL

**What goes wrong:** Build fails because localhost:4200 not running
**Why it happens:** getPrerenderParams runs at build time, not during dev server
**How to avoid:** Use filesystem reads for build-time data, or ensure data is available
**Warning signs:** Build errors about network requests

## Code Examples

Verified patterns from official sources and project conventions:

### Router Configuration (app.config.ts)

```typescript
// Source: Official Angular docs + project conventions
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ]
};
```

### Routes Definition (app.routes.ts)

```typescript
// Source: Angular routing docs
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projeto/:slug',
    loadComponent: () => import('./pages/project-detail/project-detail')
      .then(m => m.ProjectDetail),
    title: 'Projeto' // Will be updated dynamically
  }
];
```

### Server Routes with Prerender (app.routes.server.ts)

```typescript
// Source: Angular SSR docs - getPrerenderParams pattern
import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projeto/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Read project IDs at build time
      // Using dynamic import for Node.js fs
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'projects.json');
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      return data.projects.map((p: { id: string }) => ({ slug: p.id }));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

### View Transition CSS

```css
/* Source: Angular View Transitions docs */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
  animation-timing-function: ease-out;
}

/* Optional: Custom transitions for specific elements */
.project-card {
  view-transition-name: project-card;
}
```

### Image Gallery with Thumbnails

```typescript
// Source: Project conventions (signal inputs, CDK patterns)
import { Component, input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  template: `
    <div class="gallery">
      <div class="main-image" (click)="openLightbox()">
        <img [src]="currentImage()" [alt]="alt()" />
      </div>
      <div class="thumbnails">
        @for (img of images(); track img; let i = $index) {
          <button
            class="thumbnail"
            [class.active]="i === currentIndex()"
            (click)="selectImage(i)">
            <img [src]="img" [alt]="alt() + ' thumbnail ' + (i + 1)" />
          </button>
        }
      </div>
    </div>
  `
})
export class ImageGallery {
  images = input.required<string[]>();
  alt = input<string>('Project image');

  currentIndex = signal(0);
  currentImage = computed(() => this.images()[this.currentIndex()]);

  selectImage(index: number) {
    this.currentIndex.set(index);
  }

  openLightbox() {
    // Emit event or use service to open lightbox
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ActivatedRoute.paramMap.subscribe() | input() + withComponentInputBinding | Angular 16+ | Less boilerplate, signal-based |
| RouterModule.forRoot() | provideRouter() | Angular 14+ | Standalone apps, tree-shakable |
| Custom scroll restoration | withInMemoryScrolling | Angular 15+ | Built-in, configurable |
| CSS animations for route change | withViewTransitions | Angular 17+ | Native View Transitions API |
| prerender: true in angular.json | RenderMode.Prerender | Angular 19+ | Route-level control |

**Deprecated/outdated:**
- `@angular/platform-server/init` for SSR: Use `@angular/ssr` instead
- Decorator-based inputs for route params: Use signal inputs with binding
- Manual scroll position tracking: Use withInMemoryScrolling

## Open Questions

Things that couldn't be fully resolved:

1. **Build-time data fetching in getPrerenderParams**
   - What we know: `inject()` timing is critical; file reads work at build time
   - What's unclear: Exact behavior when using HttpClient vs fs in Angular 21 build
   - Recommendation: Use Node.js fs for reading projects.json at build time; it's more reliable than HTTP during build

2. **Deep link signal input issue**
   - What we know: Documented bug in Angular 19 with signal inputs on direct navigation
   - What's unclear: Whether fixed in Angular 21
   - Recommendation: Test early; have ActivatedRoute fallback ready

3. **View Transitions browser support**
   - What we know: Not all browsers support View Transitions API
   - What's unclear: Exact fallback behavior in Angular 21
   - Recommendation: Angular handles gracefully; proceed without fallback code

## Sources

### Primary (HIGH confidence)
- [Angular SSR Guide](https://angular.dev/guide/ssr) - getPrerenderParams, RenderMode, fallback strategies
- [ServerRoutePrerenderWithParams API](https://angular.dev/api/ssr/ServerRoutePrerenderWithParams) - Interface definition
- [withViewTransitions API](https://angular.dev/api/router/withViewTransitions) - View transitions configuration
- [InMemoryScrollingOptions API](https://angular.dev/api/router/InMemoryScrollingOptions) - Scroll restoration

### Secondary (MEDIUM confidence)
- [Angular View Transitions Blog](https://blog.angular.dev/check-out-angulars-support-for-the-view-transitions-api-3937376cfc19) - Implementation examples
- [withComponentInputBinding signal issue](https://github.com/angular/angular/issues/60703) - Known bug documentation
- [Angular CDK Overlay Tutorial](https://briantree.se/angular-cdk-overlay-tutorial-adding-accessibility/) - Accessibility patterns
- [Angular scroll restoration guide](https://angular.love/angular-scroll-position-restoration/) - Scroll behavior patterns

### Tertiary (LOW confidence)
- Various Medium articles on lightbox patterns - Community approaches, not verified with Angular 21

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing project dependencies, official Angular features
- Architecture: HIGH - Patterns match existing codebase (signals, CDK, lazy loading)
- Pitfalls: MEDIUM - Based on Angular 19 reports, may differ in Angular 21
- SSR prerendering: HIGH - Official docs clearly document getPrerenderParams

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days - stable Angular patterns)

---

## Project-Specific Notes

### Current Project Model
The existing `Project` interface uses `id` as the identifier:
```typescript
export interface Project {
  id: string;  // Used as slug (e.g., "sistema-gestao")
  title: string;
  // ... other fields
}
```

No changes needed to the model. The `id` field already serves as a URL-safe slug.

### Existing Patterns to Reuse
- `SwipeDirective` - For lightbox swipe navigation
- `toSignal(BreakpointObserver)` - For responsive gallery layout
- `ProjectService` with TransferState - Already handles SSR hydration
- Signal inputs (`input.required<T>()`) - Established convention

### User Decisions from CONTEXT.md (Locked)
- Full page navigation (not overlay)
- URL format: `/projeto/:slug`
- Two-column layout on desktop
- Gallery: main image + thumbnails below
- Lightbox: fullscreen with arrows + swipe + counter
- Prev/Next navigation: circular, ordered by date
