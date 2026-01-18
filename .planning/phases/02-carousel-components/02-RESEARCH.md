# Phase 2: Carousel Components - Research

**Researched:** 2026-01-18
**Domain:** Angular 21 carousel with 3D animations, glassmorphism, touch gestures
**Confidence:** HIGH

## Summary

This research investigates how to build an interactive 3D carousel with glassmorphism cards for the portfolio's Projects section. The codebase already has a solid foundation: Angular 21 with SSR, standalone components, signals-based ProjectService, and established CSS animation patterns using keyframes.

Key findings:
1. **Angular 21 introduces a new CSS-native animation API** (`animate.enter`/`animate.leave`) that replaces the legacy `@angular/animations` module. This is lighter, GPU-accelerated, and simpler.
2. **3D carousel effects** should use pure CSS transforms (`perspective`, `rotateY`, `translateZ`) rather than JavaScript-based animation libraries for best performance.
3. **Glassmorphism** via `backdrop-filter` has 95%+ browser support and is now performant on modern devices, but should be limited to 2-3 elements per viewport.
4. **Touch gestures** can be implemented with native PointerEvents/TouchEvents - HammerJS is deprecated in Angular. A custom swipe directive is recommended.
5. **Responsive behavior** should use `@angular/cdk/layout` BreakpointObserver with signals for reactive breakpoint detection.

**Primary recommendation:** Build carousel with CSS transforms + transitions for 3D effects, use Angular 21's new `animate.enter` for section entry animations, implement custom touch directive for swipe, and use BreakpointObserver for responsive layout switching.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @angular/core | ^21.0.0 | Framework | Already installed |
| @angular/common | ^21.0.0 | isPlatformBrowser, CommonModule | Already installed |
| devicon | CDN | Technology icons | Already integrated via CDN in index.html |

### Required Addition
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @angular/cdk | ^21.0.0 | BreakpointObserver for responsive | Required for responsive breakpoint detection |

### NOT Needed (Avoid)
| Library | Reason to Avoid |
|---------|-----------------|
| @angular/animations | Deprecated in Angular 21, adds 60kb, not GPU-accelerated |
| hammerjs | Deprecated in Angular, use native PointerEvents instead |
| swiper/embla-carousel | Overkill for custom 3D carousel, harder to style |
| GSAP | Adds bundle size, CSS transforms sufficient for this use case |

**Installation:**
```bash
npm install @angular/cdk
```

## Architecture Patterns

### Recommended Project Structure
```
src/app/core/components/
├── project-card/              # Individual card component
│   ├── project-card.ts
│   ├── project-card.html
│   └── project-card.scss
├── project-carousel/          # Carousel container with navigation
│   ├── project-carousel.ts
│   ├── project-carousel.html
│   └── project-carousel.scss
├── carousel/                  # Remove or repurpose existing empty carousel
└── projects/                  # Integration point (already exists)
```

### Pattern 1: Signal-Based State Management

**What:** Use Angular signals for carousel state (current index, viewport mode)
**When to use:** All interactive state that drives the UI
**Example:**
```typescript
// Source: Existing pattern from ProjectService
@Component({...})
export class ProjectCarousel {
  private readonly projectService = inject(ProjectService);

  // Carousel state with signals
  readonly currentIndex = signal(0);
  readonly viewportMode = signal<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Computed signals for derived state
  readonly visibleProjects = computed(() => {
    const all = this.projectService.projects();
    const idx = this.currentIndex();
    const mode = this.viewportMode();

    if (mode === 'mobile') return all; // Show all in stack
    if (mode === 'tablet') return this.getSlice(all, idx, 2);
    return this.getSlice(all, idx, 3); // Desktop: 3 visible
  });

  readonly canGoNext = computed(() =>
    this.currentIndex() < this.projectService.projects().length - 1
  );

  readonly canGoPrev = computed(() =>
    this.currentIndex() > 0
  );
}
```

### Pattern 2: CSS 3D Perspective Carousel

**What:** Use CSS transforms for cover-flow style 3D effect
**When to use:** Desktop and tablet views with multiple visible cards
**Example:**
```scss
// Source: https://3dtransforms.desandro.com/carousel
// and https://addyosmani.com/blog/coverflow/
.carousel-container {
  perspective: 1000px;
  overflow: visible;
}

.carousel-track {
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  transition: transform 400ms ease-out;
}

.carousel-item {
  position: relative;
  transition: transform 400ms ease-out, opacity 400ms ease-out;

  // Center card (active)
  &.active {
    transform: translateZ(50px) scale(1.1);
    z-index: 2;
  }

  // Left neighbor
  &.prev {
    transform: translateX(-30%) translateZ(-50px) rotateY(15deg);
    opacity: 0.7;
    z-index: 1;
  }

  // Right neighbor
  &.next {
    transform: translateX(30%) translateZ(-50px) rotateY(-15deg);
    opacity: 0.7;
    z-index: 1;
  }
}
```

### Pattern 3: Glassmorphism Card Style

**What:** Translucent background with blur effect
**When to use:** ProjectCard component background
**Example:**
```scss
// Source: https://ui.glass/generator/
// Browser support: 95%+ (Safari needs -webkit- prefix)
.project-card {
  background: rgba(30, 30, 30, 0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(67, 163, 190, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

// Fallback for older browsers
@supports not (backdrop-filter: blur(10px)) {
  .project-card {
    background: rgba(30, 30, 30, 0.95);
  }
}
```

### Pattern 4: Platform-Safe Browser APIs

**What:** Guard browser-only code for SSR compatibility
**When to use:** Any DOM manipulation, touch events, IntersectionObserver
**Example:**
```typescript
// Source: Existing pattern in projects.ts
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class ProjectCarousel implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    // Only run in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
      this.setupTouchEvents();
    }
  }
}
```

### Pattern 5: Angular 21 Enter Animation

**What:** Use new animate.enter API for section entry effects
**When to use:** When Projects section first becomes visible
**Example:**
```html
<!-- Source: https://angular.dev/guide/animations -->
@if (isVisible()) {
  <div class="carousel-container" animate.enter="fade-in-rise">
    <!-- carousel content -->
  </div>
}
```
```scss
.fade-in-rise {
  animation: fadeInRise 600ms ease-out forwards;
}

@keyframes fadeInRise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Anti-Patterns to Avoid

- **Using @angular/animations module:** Deprecated, 60kb bundle impact, not GPU-accelerated
- **Animating backdrop-filter:** GPU-intensive, causes jank - animate other properties instead
- **Using isPlatformBrowser in templates:** Causes hydration mismatch; use afterNextRender or ngSkipHydration
- **JavaScript-driven animations for transforms:** CSS transitions are smoother and GPU-accelerated
- **HammerJS for gestures:** Deprecated in Angular, use native PointerEvents

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Breakpoint detection | Custom resize listener | @angular/cdk BreakpointObserver | Debounced, memory-safe, signal-compatible |
| Touch swipe detection | Raw touchstart/touchend | Structured swipe directive | Edge cases (multi-touch, cancel, velocity) |
| Icon rendering | Custom SVG loader | Devicon CDN (already integrated) | Already in index.html, 150+ icons |
| Card hover lift | JavaScript animation | CSS :hover transform | GPU-accelerated, simpler |
| Section visibility | Scroll event listener | IntersectionObserver | Already used in codebase, performant |

**Key insight:** The codebase already has patterns for IntersectionObserver and CSS animations. Follow existing conventions.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Responsive Rendering

**What goes wrong:** Server renders desktop view, client renders mobile, Angular throws hydration error
**Why it happens:** Server doesn't know client viewport size
**How to avoid:**
- Render same initial HTML on server and client
- Use CSS media queries for responsive hiding/showing, not @if with breakpoint signals
- Apply different layouts via CSS classes, not conditional rendering
**Warning signs:** Console errors mentioning "hydration" or "mismatch"

### Pitfall 2: backdrop-filter Performance

**What goes wrong:** Laggy animations when multiple cards have blur effects
**Why it happens:** backdrop-filter is GPU-intensive, especially on mobile
**How to avoid:**
- Limit to 2-3 glassmorphic elements visible at once (matches design)
- Use 6-8px blur max on mobile (not 10-15px)
- NEVER animate elements with backdrop-filter
**Warning signs:** Frame drops during carousel transitions

### Pitfall 3: Touch Event Conflicts with Scroll

**What goes wrong:** Swipe gestures prevent page scrolling or vice versa
**Why it happens:** Both use touch events, need proper event handling
**How to avoid:**
- Detect horizontal vs vertical swipe direction
- Only prevent default for horizontal swipes
- Use touch-action CSS property to hint browser
**Warning signs:** Page won't scroll, or swipe doesn't trigger

### Pitfall 4: Z-index Stacking in 3D Transforms

**What goes wrong:** Cards overlap incorrectly, active card behind neighbors
**Why it happens:** 3D transforms create new stacking contexts
**How to avoid:**
- Explicitly set z-index on each card based on position
- Use transform-style: preserve-3d on parent
- Don't rely on DOM order for z-stacking
**Warning signs:** Cards visually behind when they should be in front

### Pitfall 5: Carousel State on Mobile (Stacked Layout)

**What goes wrong:** Carousel navigation state persists when switching to stacked mobile view
**Why it happens:** currentIndex signal still has value even when carousel behavior disabled
**How to avoid:**
- Reset currentIndex to 0 when switching to mobile
- Hide navigation arrows/dots on mobile
- Or keep state but ignore it in mobile layout
**Warning signs:** Odd scroll position or state when resizing

## Code Examples

Verified patterns from official sources and existing codebase:

### BreakpointObserver with Signals
```typescript
// Source: @angular/cdk/layout + toSignal pattern
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({...})
export class ProjectCarousel {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly breakpoints$ = this.breakpointObserver.observe([
    '(max-width: 767px)',      // Mobile
    '(min-width: 768px) and (max-width: 1023px)', // Tablet
    '(min-width: 1024px)'      // Desktop
  ]);

  readonly viewportMode = toSignal(
    this.breakpoints$.pipe(
      map(result => {
        if (result.breakpoints['(max-width: 767px)']) return 'mobile';
        if (result.breakpoints['(min-width: 768px) and (max-width: 1023px)']) return 'tablet';
        return 'desktop';
      })
    ),
    { initialValue: 'desktop' }
  );
}
```

### Custom Swipe Directive
```typescript
// Source: Pattern derived from native PointerEvents API
@Directive({
  selector: '[appSwipe]',
  standalone: true
})
export class SwipeDirective {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);

  private startX = 0;
  private startY = 0;
  private startTime = 0;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.el.nativeElement;
    el.addEventListener('pointerdown', this.onPointerDown.bind(this));
    el.addEventListener('pointerup', this.onPointerUp.bind(this));
  }

  private onPointerDown(e: PointerEvent) {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
  }

  private onPointerUp(e: PointerEvent) {
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    const duration = Date.now() - this.startTime;

    // Swipe detection: fast enough, horizontal enough
    if (duration < 500 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      if (deltaX > 0) this.swipeRight.emit();
      else this.swipeLeft.emit();
    }
  }
}
```

### Dots Navigation Component
```typescript
// Source: Common carousel pattern
@Component({
  selector: 'app-carousel-dots',
  standalone: true,
  template: `
    <div class="dots">
      @for (project of projects(); track project.id; let i = $index) {
        <button
          class="dot"
          [class.active]="i === currentIndex()"
          (click)="onDotClick.emit(i)"
          [attr.aria-label]="'Go to project ' + (i + 1)"
        ></button>
      }
    </div>
  `
})
export class CarouselDots {
  projects = input.required<Project[]>();
  currentIndex = input.required<number>();
  @Output() onDotClick = new EventEmitter<number>();
}
```

### Hover Lift Effect (Following Existing Pattern)
```scss
// Source: Existing pattern in projects.scss (.project-card:hover)
.project-card {
  transition: transform 300ms ease, box-shadow 300ms ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0 12px 40px rgba(67, 163, 190, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @angular/animations module | CSS + animate.enter/leave API | Angular 20.2/21 (Nov 2025) | 60kb smaller bundle, GPU-accelerated |
| HammerJS for gestures | Native PointerEvents | Angular 9+ (deprecated) | No external dependency |
| BehaviorSubject state | Signals | Angular 16+ (mature in 21) | Simpler, better change detection |
| ngOnInit browser checks | afterNextRender hook | Angular 17+ | Cleaner SSR handling |

**Deprecated/outdated:**
- **@angular/animations**: Marked as "Legacy Animations" in Angular 21 docs
- **HammerJS**: Officially dropped from Angular Material, not recommended
- **Zone.js animations**: Angular 21 supports zoneless, animations should be CSS-native

## Open Questions

Things that couldn't be fully resolved:

1. **animate.enter exact timing for section reveal**
   - What we know: Works with @if to add CSS classes on enter
   - What's unclear: Exact interaction with IntersectionObserver pattern already in projects.ts
   - Recommendation: May need to combine: IntersectionObserver sets isVisible signal, @if with animate.enter renders content

2. **Keyboard navigation accessibility**
   - What we know: Arrow keys should navigate carousel
   - What's unclear: Focus management between cards, screen reader announcements
   - Recommendation: Research ARIA carousel patterns, possibly use roving tabindex

3. **Optimal blur values for mobile**
   - What we know: Lower blur (6-8px) recommended for mobile performance
   - What's unclear: Exact visual balance for this design
   - Recommendation: Test on real devices, make blur value a CSS variable for easy tuning

## Sources

### Primary (HIGH confidence)
- [Angular v21 Enter/Leave Animations](https://angular.dev/guide/animations) - Official docs on new animation API
- [Angular Hydration Guide](https://angular.dev/guide/hydration) - SSR best practices
- [CSS 3D Transforms Tutorial](https://3dtransforms.desandro.com/carousel) - Authoritative carousel math
- [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) - Browser support, syntax

### Secondary (MEDIUM confidence)
- [Addy Osmani Cover Flow Blog](https://addyosmani.com/blog/coverflow/) - Scroll-driven animation patterns
- [Glass UI Generator](https://ui.glass/generator/) - Glassmorphism best practices
- [Angular CDK BreakpointObserver](https://material.angular.dev/cdk/layout/overview) - Responsive detection API

### Tertiary (LOW confidence)
- [Angular Blog v21 Announcement](https://blog.angular.dev/announcing-angular-v21-57946c34f14b) - Could not fetch, used WebSearch summary
- Various Medium articles on gesture implementation - Patterns verified against official PointerEvents API

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified against package.json and official Angular 21 docs
- Architecture: HIGH - Based on existing codebase patterns + official Angular patterns
- Animations: HIGH - New API verified in official Angular docs
- Gestures: MEDIUM - HammerJS deprecation confirmed, custom directive pattern from community
- Glassmorphism: HIGH - MDN/CanIUse confirm 95%+ support

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days - Angular APIs stable, CSS specs stable)
