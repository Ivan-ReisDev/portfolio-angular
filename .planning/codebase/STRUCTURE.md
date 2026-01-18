# Codebase Structure

**Analysis Date:** 2026-01-18

## Directory Layout

```
portfolio/
├── src/                           # Source code
│   ├── app/                       # Angular application
│   │   ├── core/                  # Core functionality
│   │   │   └── components/        # Reusable and section components
│   │   │       ├── about/         # About section
│   │   │       ├── card-stacks/   # Technology cards component
│   │   │       ├── carousel/      # Project carousel component
│   │   │       ├── education/     # Education/timeline section
│   │   │       ├── footer/        # Footer component
│   │   │       ├── header/        # Header with navbar
│   │   │       ├── home/          # Home/hero section
│   │   │       ├── navbar/        # Navigation bar
│   │   │       ├── projects/      # Projects section
│   │   │       └── typography/    # Typography components
│   │   │           └── title/     # Section title component
│   │   ├── pages/                 # Route-based pages
│   │   │   ├── auth/              # Authentication page (empty)
│   │   │   └── blog/              # Blog page (empty)
│   │   ├── shared/                # Shared utilities (empty)
│   │   ├── app.ts                 # Root component
│   │   ├── app.html               # Root template
│   │   ├── app.scss               # Root styles
│   │   ├── app.config.ts          # Client config
│   │   ├── app.config.server.ts   # Server config
│   │   ├── app.routes.ts          # Client routes (empty)
│   │   ├── app.routes.server.ts   # Server routes
│   │   └── app.spec.ts            # Root component tests
│   ├── index.html                 # HTML entry point
│   ├── main.ts                    # Browser bootstrap
│   ├── main.server.ts             # Server bootstrap
│   ├── server.ts                  # Express SSR server
│   └── styles.scss                # Global styles
├── public/                        # Static assets
│   └── images/                    # Image assets
├── .angular/                      # Angular cache (generated)
├── .planning/                     # Planning documents
│   └── codebase/                  # Codebase analysis
├── node_modules/                  # Dependencies (generated)
├── angular.json                   # Angular CLI config
├── package.json                   # NPM config and scripts
├── tsconfig.json                  # TypeScript config
├── tsconfig.app.json              # App TypeScript config
└── tsconfig.spec.json             # Test TypeScript config
```

## Directory Purposes

**`src/app/core/components/`:**
- Purpose: All UI components (sections and reusable)
- Contains: Section components (Home, About, Projects, Education), layout components (Header, Footer, Navbar), UI components (Carousel, CardStacks, Title)
- Key files: Each component has `.ts`, `.html`, `.scss`, `.spec.ts`

**`src/app/pages/`:**
- Purpose: Route-based page components
- Contains: Blog and Auth pages (currently empty shells)
- Key files: `blog/blog.ts`, `auth/auth.ts`

**`src/app/shared/`:**
- Purpose: Shared utilities, services, pipes, directives
- Contains: Currently empty, reserved for future shared code
- Key files: None yet

**`public/`:**
- Purpose: Static assets served directly
- Contains: Images (background.png, code-2o.jpg)
- Key files: `images/background.png`

## Key File Locations

**Entry Points:**
- `src/main.ts`: Browser bootstrap
- `src/main.server.ts`: SSR bootstrap
- `src/server.ts`: Express server
- `src/index.html`: HTML shell

**Configuration:**
- `angular.json`: Angular CLI configuration
- `package.json`: NPM dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `src/app/app.config.ts`: Angular client providers
- `src/app/app.config.server.ts`: Angular server providers

**Core Logic:**
- `src/app/app.ts`: Root component with scroll navigation
- `src/app/app.routes.ts`: Router configuration (empty)
- `src/app/app.routes.server.ts`: SSR routes (prerender all)

**Testing:**
- `src/app/app.spec.ts`: Root component tests
- `src/app/core/components/*/[component].spec.ts`: Component tests

**Styling:**
- `src/styles.scss`: Global styles (fonts, reset)
- `src/app/app.scss`: App-level styles (scroll container, sidebar)
- `src/app/core/components/*/[component].scss`: Component styles

## Naming Conventions

**Files:**
- Component: `[name].ts` (e.g., `home.ts`, `navbar.ts`)
- Template: `[name].html` (e.g., `home.html`)
- Styles: `[name].scss` (e.g., `home.scss`)
- Tests: `[name].spec.ts` (e.g., `home.spec.ts`)
- Config: `[name].config.ts` (e.g., `app.config.ts`)
- Routes: `[name].routes.ts` (e.g., `app.routes.ts`)

**Directories:**
- Component folders: lowercase, hyphenated (e.g., `card-stacks/`)
- Category folders: lowercase (e.g., `core/`, `pages/`, `shared/`)

**Components:**
- Class names: PascalCase (e.g., `CardStacks`, `Home`, `Navbar`)
- Selectors: `app-[name]` (e.g., `app-home`, `app-card-stacks`)

## Where to Add New Code

**New Section Component:**
- Implementation: `src/app/core/components/[section-name]/`
- Create: `[name].ts`, `[name].html`, `[name].scss`, `[name].spec.ts`
- Register: Import and add to `App` component imports array in `src/app/app.ts`
- Add to template: `src/app/app.html`

**New Reusable UI Component:**
- Implementation: `src/app/core/components/[component-name]/`
- Create: `[name].ts`, `[name].html`, `[name].scss`, `[name].spec.ts`
- Use: Import directly in consuming component

**New Typography Component:**
- Implementation: `src/app/core/components/typography/[component-name]/`
- Create: `[name].ts`, `[name].html`, `[name].scss`, `[name].spec.ts`

**New Page (Routed):**
- Implementation: `src/app/pages/[page-name]/`
- Create: `[name].ts`, `[name].html`, `[name].scss`, `[name].spec.ts`
- Register: Add route in `src/app/app.routes.ts`

**New Service:**
- Implementation: `src/app/shared/services/[service-name].service.ts`
- Pattern: Use `@Injectable({ providedIn: 'root' })`

**New Utility/Helper:**
- Implementation: `src/app/shared/utils/[util-name].ts`

**New Type/Interface:**
- Implementation: Define in component file or `src/app/shared/types/[type-name].ts`

**Static Assets:**
- Images: `public/images/`
- Other assets: `public/`

## Special Directories

**`.angular/`:**
- Purpose: Angular CLI cache
- Generated: Yes
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: NPM dependencies
- Generated: Yes
- Committed: No (in .gitignore)

**`.planning/`:**
- Purpose: Project planning and analysis documents
- Generated: No
- Committed: Yes

**`public/`:**
- Purpose: Static assets copied to build output
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-01-18*
