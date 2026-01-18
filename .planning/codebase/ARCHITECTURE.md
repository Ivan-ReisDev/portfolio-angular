# Architecture

**Analysis Date:** 2026-01-18

## Pattern Overview

**Overall:** Component-Based Single Page Application (SPA) with Server-Side Rendering (SSR)

**Key Characteristics:**
- Angular 21 standalone components (no NgModules)
- Full-page scroll-snap navigation between sections
- SSR with Express server and prerendering support
- Direct component composition in root App component (no routing between sections)

## Layers

**Presentation Layer (Components):**
- Purpose: Render UI sections and handle user interactions
- Location: `src/app/core/components/`
- Contains: Section components (Home, About, Projects, Education, Footer), UI components (Navbar, Carousel, CardStacks, Title)
- Depends on: Angular core, CommonModule
- Used by: Root App component

**Page Layer (Future Routes):**
- Purpose: Standalone pages for routing
- Location: `src/app/pages/`
- Contains: Blog and Auth components (currently empty shells)
- Depends on: Angular core
- Used by: Router (routes currently empty)

**Shared Layer:**
- Purpose: Reusable utilities and services
- Location: `src/app/shared/`
- Contains: Currently empty, reserved for future shared code
- Depends on: None
- Used by: Components

**Server Layer:**
- Purpose: SSR and static file serving
- Location: `src/server.ts`, `src/main.server.ts`
- Contains: Express server configuration, Angular SSR engine
- Depends on: Express, @angular/ssr
- Used by: Production server, build process

## Data Flow

**Section Navigation Flow:**

1. User clicks navbar link or scrolls
2. `App.scrollToSection()` or `App.onScroll()` triggered
3. Scroll position calculated based on viewport height
4. Container scrolls with smooth behavior
5. `activeSection` signal updated
6. Navbar highlights active section via Input binding

**Component Visibility Animation Flow:**

1. Component mounts, creates IntersectionObserver in `ngAfterViewInit()`
2. Observer monitors section visibility (30% threshold)
3. When section enters viewport, CSS class 'active' added
4. SCSS animations triggered by class presence
5. On viewport exit, 'active' class removed

**State Management:**
- Angular Signals for reactive state (`signal()`)
- Component-local state (no global store)
- Input/Output for parent-child communication
- No services for state management currently

## Key Abstractions

**Section Components:**
- Purpose: Represent full-viewport sections of the portfolio
- Examples: `src/app/core/components/home/home.ts`, `src/app/core/components/about/about.ts`, `src/app/core/components/projects/projects.ts`
- Pattern: Standalone component with IntersectionObserver for scroll-triggered animations

**UI Components:**
- Purpose: Reusable presentation elements
- Examples: `src/app/core/components/typography/title/title.ts`, `src/app/core/components/carousel/carousel.ts`, `src/app/core/components/card-stacks/card-stacks.ts`
- Pattern: Standalone component with @Input for configuration

**Page Components:**
- Purpose: Route-based page views (future)
- Examples: `src/app/pages/blog/blog.ts`, `src/app/pages/auth/auth.ts`
- Pattern: Empty shell components awaiting implementation

## Entry Points

**Browser Entry:**
- Location: `src/main.ts`
- Triggers: Browser load
- Responsibilities: Bootstrap App component with client config, hydration

**Server Entry:**
- Location: `src/server.ts`
- Triggers: Node.js execution, HTTP requests
- Responsibilities: Serve static files, SSR rendering, Express middleware

**SSR Bootstrap:**
- Location: `src/main.server.ts`
- Triggers: SSR render request
- Responsibilities: Bootstrap App with server config for prerendering

**Application Root:**
- Location: `src/app/app.ts`
- Triggers: Angular bootstrap
- Responsibilities: Render all sections, handle scroll navigation, manage active section state

## Error Handling

**Strategy:** Minimal - errors logged to console

**Patterns:**
- Bootstrap errors caught with `.catch((err) => console.error(err))`
- No global error boundary
- No error tracking service

## Cross-Cutting Concerns

**Logging:** Console only (no structured logging)

**Validation:** None implemented

**Authentication:** Placeholder component at `src/app/pages/auth/auth.ts` (empty)

**Platform Detection:** `isPlatformBrowser()` used to prevent SSR issues with browser APIs (IntersectionObserver, DOM manipulation)

**Styling:**
- SCSS with component-scoped styles
- Global styles in `src/styles.scss`
- CSS variables for colors in `src/app/app.scss`

---

*Architecture analysis: 2026-01-18*
