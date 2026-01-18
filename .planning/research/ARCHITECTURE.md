# Architecture Patterns

**Domain:** Angular 21 Portfolio Project Showcase Feature
**Researched:** 2026-01-18
**Confidence:** HIGH

## Current Architecture Analysis

The portfolio uses a scroll-snap full-page navigation pattern:

```
App
 |-- Header (with Navbar)
 |-- ScrollContainer (scroll-snap-type: y mandatory)
 |     |-- Home Section
 |     |-- About Section
 |     |-- Projects Section (contains empty Carousel)
 |     |-- Education Section
 |     |-- Blog Section (placeholder)
 |     |-- Contact Section (placeholder)
 |     |-- Footer
 |-- Social Sidebar (fixed)
 |-- RouterOutlet (currently unused)
```

**Key observations:**
- Sections are composed directly in `app.html`, not routed
- Router exists (`provideRouter(routes)`) but routes array is empty
- SSR is configured with `RenderMode.Prerender` as default
- `Carousel` component exists but is empty (just Next/Back buttons)
- Navigation uses anchor links (`#section`) with custom scroll handling

## Recommended Architecture

### Dual-Mode Navigation Strategy

The core challenge: integrate dynamic routes (`/projeto/:id`) with scroll-snap sections while maintaining SSR/SEO.

**Solution: Modal-Style Detail Pages with URL Routing**

```
App
 |-- Header
 |-- ScrollContainer (main content, always rendered)
 |     |-- [sections...]
 |     |-- Projects Section
 |           |-- ProjectCarousel
 |                 |-- ProjectCard (click navigates to /projeto/:id)
 |-- RouterOutlet (overlay for detail pages)
```

When navigating to `/projeto/:id`:
1. Main scroll container remains in DOM (preserves scroll state)
2. Detail page renders in RouterOutlet as overlay
3. Back navigation restores previous URL, overlay closes
4. SEO preserved via SSR prerendering of detail pages

### Component Hierarchy

```
src/app/
 |-- app.ts                    # Root, manages scroll + outlet
 |-- app.routes.ts             # Client routes
 |-- app.routes.server.ts      # SSR render modes
 |
 |-- core/components/
 |     |-- projects/
 |           |-- projects.ts           # Section wrapper
 |           |-- projects.html
 |           |-- projects.scss
 |
 |-- features/
 |     |-- project-showcase/
 |           |-- components/
 |           |     |-- project-carousel/
 |           |     |     |-- project-carousel.ts    # Carousel logic
 |           |     |     |-- project-carousel.html
 |           |     |     |-- project-carousel.scss
 |           |     |
 |           |     |-- project-card/
 |           |           |-- project-card.ts        # Individual card
 |           |           |-- project-card.html
 |           |           |-- project-card.scss
 |           |
 |           |-- pages/
 |           |     |-- project-detail/
 |           |           |-- project-detail.ts      # Detail page
 |           |           |-- project-detail.html
 |           |           |-- project-detail.scss
 |           |
 |           |-- services/
 |           |     |-- project.service.ts           # Data access
 |           |
 |           |-- models/
 |           |     |-- project.model.ts             # TypeScript interface
 |           |
 |           |-- data/
 |                 |-- projects.json                # Project data
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `Projects` | Section container, mounts carousel | `ProjectCarousel` |
| `ProjectCarousel` | Carousel navigation logic, displays cards | `ProjectService`, `ProjectCard` |
| `ProjectCard` | Displays project preview, emits click | Parent carousel, Router |
| `ProjectDetail` | Full project page, routed component | `ProjectService`, Router |
| `ProjectService` | Loads/caches JSON data, provides to components | JSON file, HttpClient |

## Data Flow

### JSON to Components

```
public/data/projects.json
         |
         v
   HttpClient.get()
         |
         v
   ProjectService
   (caches in signal)
         |
    +----+----+
    v         v
Carousel   Detail Page
   |
   v
ProjectCard[]
```

### Project Interface

```typescript
// src/app/features/project-showcase/models/project.model.ts

export interface Project {
  id: string;                    // URL slug: "portfolio-angular"
  title: string;                 // "Portfolio Angular"
  subtitle: string;              // "Site pessoal com Angular 21"
  description: string;           // Full description for detail page
  technologies: string[];        // ["Angular", "TypeScript", "SCSS"]
  imageUrl: string;              // "/images/projects/portfolio.webp"
  thumbnailUrl: string;          // "/images/projects/portfolio-thumb.webp"
  liveUrl?: string;              // "https://example.com"
  repoUrl?: string;              // "https://github.com/..."
  featured: boolean;             // Show in carousel
  order: number;                 // Display order
  year: number;                  // 2024
}
```

### JSON Structure

```json
// public/data/projects.json
{
  "projects": [
    {
      "id": "portfolio-angular",
      "title": "Portfolio Angular",
      "subtitle": "Site pessoal com Angular 21",
      "description": "Descricao completa do projeto...",
      "technologies": ["Angular 21", "TypeScript", "SCSS", "SSR"],
      "imageUrl": "/images/projects/portfolio.webp",
      "thumbnailUrl": "/images/projects/portfolio-thumb.webp",
      "liveUrl": "https://portfolio.dev",
      "repoUrl": "https://github.com/deeivan/portfolio",
      "featured": true,
      "order": 1,
      "year": 2024
    }
  ]
}
```

### Service Pattern

```typescript
// src/app/features/project-showcase/services/project.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  private projects$ = this.http.get<{ projects: Project[] }>('/data/projects.json').pipe(
    map(data => data.projects),
    shareReplay(1)
  );

  readonly projects = toSignal(this.projects$, { initialValue: [] });

  getProject(id: string) {
    return this.projects$.pipe(
      map(projects => projects.find(p => p.id === id))
    );
  }

  getFeaturedProjects() {
    return this.projects$.pipe(
      map(projects => projects.filter(p => p.featured).sort((a, b) => a.order - b.order))
    );
  }
}
```

## Routing Strategy

### Client Routes

```typescript
// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projeto/:id',
    loadComponent: () =>
      import('./features/project-showcase/pages/project-detail/project-detail')
        .then(m => m.ProjectDetail),
    data: { animation: 'projectDetail' }
  }
  // Home route not needed - scroll sections are always rendered
];
```

### Server Routes (SSR Prerendering)

```typescript
// src/app/app.routes.server.ts

import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender  // Main page prerendered
  },
  {
    path: 'projeto/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,  // Fallback to SSR if not prerendered
    async getPrerenderParams() {
      // inject must be called synchronously before await
      const http = inject(HttpClient);
      const projects = await firstValueFrom(
        http.get<{ projects: { id: string }[] }>('http://localhost:4200/data/projects.json')
          .pipe(map(data => data.projects))
      );
      return projects.map(p => ({ id: p.id }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
```

**Important for SSR:** During prerendering, `getPrerenderParams` needs the dev server running to fetch JSON. For production builds, consider:
1. Reading JSON directly from filesystem during build
2. Or using an API endpoint that returns project IDs

### Lazy Loading

Use `loadComponent` for the detail page:

```typescript
loadComponent: () =>
  import('./features/project-showcase/pages/project-detail/project-detail')
    .then(m => m.ProjectDetail)
```

This ensures the detail page bundle is only loaded when needed, keeping the initial bundle small.

## Overlay Integration Pattern

### App Template Update

```html
<!-- app.html -->
<app-header [activeSection]="activeSection()" />

<div class="scroll-container" #scrollContainer tabindex="0"
     [class.has-overlay]="hasDetailOverlay()">
  <app-home />
  <app-about />
  <app-projects />
  <app-education />
  <!-- ... -->
</div>

<aside class="social-sidebar">
  <!-- ... -->
</aside>

<!-- Detail page overlay -->
@if (hasDetailOverlay()) {
  <div class="detail-overlay" (click)="closeDetail($event)">
    <router-outlet />
  </div>
}
```

### App Component Update

```typescript
// app.ts additions

import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export class App {
  private router = inject(Router);

  hasDetailOverlay = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects.startsWith('/projeto/'))
    ),
    { initialValue: false }
  );

  closeDetail(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('detail-overlay')) {
      this.router.navigate(['/']);
    }
  }
}
```

### Overlay Styles

```scss
// app.scss additions

.scroll-container {
  &.has-overlay {
    pointer-events: none;
    filter: blur(2px);
  }
}

.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  // The router-outlet content
  > * {
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
    background: #fff;
    border-radius: 12px;
    pointer-events: auto;
  }
}
```

## Carousel Implementation Pattern

### Carousel Component

```typescript
// project-carousel.ts

import { Component, inject, signal, computed } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectCard } from '../project-card/project-card';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-carousel',
  standalone: true,
  imports: [ProjectCard],
  templateUrl: './project-carousel.html',
  styleUrl: './project-carousel.scss'
})
export class ProjectCarousel {
  private projectService = inject(ProjectService);

  projects = toSignal(this.projectService.getFeaturedProjects(), { initialValue: [] });

  currentIndex = signal(0);

  visibleProjects = computed(() => {
    const all = this.projects();
    const idx = this.currentIndex();
    // Show 3 projects at a time (configurable)
    return all.slice(idx, idx + 3);
  });

  canGoNext = computed(() => this.currentIndex() < this.projects().length - 3);
  canGoPrev = computed(() => this.currentIndex() > 0);

  next() {
    if (this.canGoNext()) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prev() {
    if (this.canGoPrev()) {
      this.currentIndex.update(i => i - 1);
    }
  }
}
```

### Card Component

```typescript
// project-card.ts

import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss'
})
export class ProjectCard {
  project = input.required<Project>();

  private router = inject(Router);

  openDetail() {
    this.router.navigate(['/projeto', this.project().id]);
  }
}
```

## Patterns to Follow

### Pattern 1: Signal-Based State Management

**What:** Use Angular signals for reactive state instead of BehaviorSubject
**When:** All component-level state
**Example:**
```typescript
currentIndex = signal(0);
projects = toSignal(this.service.getProjects(), { initialValue: [] });
```

### Pattern 2: Standalone Components with Lazy Loading

**What:** All components are standalone, detail page is lazy loaded
**When:** New components in Angular 21
**Example:**
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  // ...
})
```

### Pattern 3: Input Signals for Component Communication

**What:** Use `input()` and `input.required()` instead of `@Input()`
**When:** Component inputs in Angular 21
**Example:**
```typescript
project = input.required<Project>();
showThumbnail = input(true);
```

### Pattern 4: Inject Function

**What:** Use `inject()` function instead of constructor injection
**When:** All dependency injection
**Example:**
```typescript
private router = inject(Router);
private http = inject(HttpClient);
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Routing All Sections

**What:** Making each scroll section a separate route
**Why bad:** Breaks scroll-snap navigation, loses scroll state, complicates navigation
**Instead:** Keep sections in DOM, only route for detail pages

### Anti-Pattern 2: Heavy Carousel Libraries

**What:** Using libraries like Swiper, Slick for simple carousels
**Why bad:** Adds bundle size, may conflict with scroll-snap, SSR issues
**Instead:** Build simple carousel with CSS transforms and signals

### Anti-Pattern 3: Mixing NgModule and Standalone

**What:** Creating NgModules for new features
**Why bad:** Inconsistent with Angular 21 patterns, more boilerplate
**Instead:** Use standalone components throughout

### Anti-Pattern 4: Browser APIs Without Platform Check

**What:** Using window, document directly
**Why bad:** Breaks SSR
**Instead:** Use `isPlatformBrowser()` check or `afterNextRender()`
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject, afterNextRender } from '@angular/core';

// Option 1: Platform check
if (isPlatformBrowser(inject(PLATFORM_ID))) {
  // browser code
}

// Option 2: afterNextRender (Angular 16+)
afterNextRender(() => {
  // browser code, runs after hydration
});
```

## Build Order (Dependencies)

### Phase 1: Data Foundation
1. Create `Project` interface (`project.model.ts`)
2. Create `projects.json` in `public/data/`
3. Create `ProjectService` with HttpClient

**Dependencies:** HttpClient must be provided in app.config.ts

### Phase 2: Carousel Components
4. Create `ProjectCard` component (displays single project)
5. Create `ProjectCarousel` component (manages card display)
6. Integrate carousel into `Projects` section

**Dependencies:** ProjectService, Project model

### Phase 3: Routing & Detail Page
7. Create `ProjectDetail` page component
8. Configure routes in `app.routes.ts`
9. Configure SSR prerendering in `app.routes.server.ts`
10. Update App component with overlay pattern

**Dependencies:** Carousel working, routing configured, SSR setup

### Phase 4: Polish
11. Add animations (route transitions, carousel slide)
12. Add keyboard navigation to carousel
13. Accessibility improvements (ARIA labels, focus management)

## SSR Considerations

### Providing HttpClient

```typescript
// app.config.ts
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... existing providers
    provideHttpClient(withFetch()),  // withFetch for SSR compatibility
  ]
};
```

### Server Config

```typescript
// app.config.server.ts
import { provideHttpClient, withFetch } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    // ...
  ]
};
```

### JSON Data During Prerender

During `ng build`, the prerender process runs `getPrerenderParams`. To access JSON:

**Option A:** Run dev server alongside build
```bash
# Terminal 1
ng serve

# Terminal 2
ng build
```

**Option B:** Use filesystem read in getPrerenderParams
```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

async getPrerenderParams() {
  // Only works at build time, not runtime
  const data = JSON.parse(
    readFileSync(join(process.cwd(), 'public/data/projects.json'), 'utf-8')
  );
  return data.projects.map(p => ({ id: p.id }));
}
```

## Sources

### Angular Official Documentation
- [Server-side and hybrid-rendering](https://angular.dev/guide/ssr)
- [ServerRoutePrerenderWithParams](https://angular.dev/api/ssr/ServerRoutePrerenderWithParams)
- [Rendering strategies](https://angular.dev/guide/routing/rendering-strategies)
- [Lazy-loaded routes](https://angular.dev/reference/migrations/route-lazy-loading)
- [InMemoryScrollingOptions](https://angular.dev/api/router/InMemoryScrollingOptions)

### Community Resources
- [How to pre-render Dynamic Routes in Angular](https://blog.codewithahsan.dev/how-to-pre-render-dynamic-routes-in-angular-a-practical-guide/)
- [Angular SSR - everything you need to know](https://angular.love/angular-ssr-everything-you-need-to-know/)
- [Guide for Server-Side Rendering (SSR) in Angular](https://www.angulararchitects.io/blog/guide-for-ssr/)
- [Routing and Lazy Loading with Angular's Standalone Components](https://www.angulararchitects.io/en/blog/routing-and-lazy-loading-with-standalone-components/)
- [Lazy Load Standalone Components in Angular Using loadComponent](https://medium.com/@sehban.alam/lazy-load-standalone-components-in-angular-using-loadcomponent-202-663bf789e1d8)
- [Building a Simple Carousel Component with Angular](https://medium.com/netanelbasal/building-a-simple-carousel-component-with-angular-3a94092b7080)
- [Manage Scrolls on router-outlets](https://medium.com/simars/manage-scrolls-on-router-outlets-angular-bca7338fabeb/)

---

## Summary for Roadmap

**Suggested Build Phases:**

1. **Phase 1: Data Layer** - Project model, JSON file, ProjectService
   - No UI changes, foundation for everything else
   - LOW risk, standard Angular patterns

2. **Phase 2: Carousel in Section** - ProjectCard, ProjectCarousel, integrate in Projects section
   - Visible progress, no routing complexity yet
   - MEDIUM complexity (carousel logic)

3. **Phase 3: Detail Pages** - ProjectDetail, routes, SSR config, overlay pattern
   - Routing integration, SSR prerendering setup
   - HIGH complexity (routing + SSR + overlay)

4. **Phase 4: Polish** - Animations, accessibility, keyboard nav
   - Refinement, can be deferred if needed

**Critical Path:** Phase 1 -> Phase 2 -> Phase 3
**Parallelizable:** Phase 4 items can start during Phase 3

**Research Flags:**
- Phase 3 may need deeper research on SSR prerendering with JSON file access during build
- Overlay pattern interaction with scroll-snap needs testing
