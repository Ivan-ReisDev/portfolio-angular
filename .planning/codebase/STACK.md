# Technology Stack

**Analysis Date:** 2026-01-18

## Languages

**Primary:**
- TypeScript ~5.9.2 - All application code (`src/**/*.ts`)

**Secondary:**
- SCSS - Component styling (`src/**/*.scss`, `src/styles.scss`)
- HTML - Component templates (`src/**/*.html`)

## Runtime

**Environment:**
- Node.js (version not pinned, uses system Node)
- Browser (client-side Angular application)
- Server-side rendering via Express

**Package Manager:**
- npm 10.9.3 (specified in `package.json` `packageManager` field)
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Angular 21.0.0 - Main application framework
  - `@angular/core` - Core functionality
  - `@angular/common` - Common utilities
  - `@angular/router` - Client-side routing
  - `@angular/platform-browser` - Browser platform
  - `@angular/platform-server` - SSR support
  - `@angular/ssr` - Server-side rendering utilities
  - `@angular/forms` - Form handling

**Testing:**
- Vitest 4.0.8 - Unit test runner
- jsdom 27.1.0 - DOM environment for tests

**Build/Dev:**
- Angular CLI 21.0.0 (`@angular/cli`)
- Angular Build 21.0.0 (`@angular/build`) - Application builder

## Key Dependencies

**Critical:**
- Express 5.1.0 - SSR server (`src/server.ts`)
- RxJS ~7.8.0 - Reactive programming, used by Angular
- tslib ^2.3.0 - TypeScript runtime helpers

**Infrastructure:**
- @angular/ssr - Server-side rendering engine with `AngularNodeAppEngine`

## Configuration

**TypeScript Configuration:**
- `tsconfig.json` - Base TypeScript config
  - Strict mode enabled
  - Target: ES2022
  - Module: preserve
- `tsconfig.app.json` - Application-specific config (extends base)
- `tsconfig.spec.json` - Test-specific config (extends base, includes Vitest globals)

**Angular Configuration:**
- `angular.json` - Angular workspace configuration
  - Style preprocessor: SCSS
  - Component prefix: `app`
  - SSR enabled with `outputMode: "server"`
  - SSR entry: `src/server.ts`
  - Browser entry: `src/main.ts`
  - Server entry: `src/main.server.ts`

**Formatting:**
- Prettier (inline in `package.json`)
  - Print width: 100
  - Single quotes: true
  - Angular HTML parser for `.html` files

**Editor Configuration:**
- `.editorconfig` - Cross-editor settings
  - Indent: 2 spaces
  - Charset: UTF-8
  - Single quotes for TypeScript

## Build Configuration

**Development:**
```bash
npm start              # ng serve (dev server with HMR)
npm run watch          # ng build --watch --configuration development
```

**Production:**
```bash
npm run build          # ng build (production by default)
```

**SSR Server:**
```bash
npm run serve:ssr:portfolio  # node dist/portfolio/server/server.mjs
```

**Testing:**
```bash
npm test               # ng test (Vitest runner)
```

## Bundle Budgets

**Production Build Limits:**
- Initial bundle: Warning at 500kB, Error at 1MB
- Component styles: Warning at 4kB, Error at 8kB

## Platform Requirements

**Development:**
- Node.js (ES2022 compatible)
- npm 10.9.3+
- Modern browser for testing

**Production:**
- Node.js server (Express-based SSR)
- Port: Configurable via `PORT` env var (default: 4000)
- PM2 compatible (`process.env['pm_id']` detection)

## External CDN Resources

**Icons (loaded via `src/index.html`):**
- Font Awesome 6.4.0 - General icons
- Devicon (latest) - Technology/brand icons

**Fonts (loaded via `src/styles.scss`):**
- Google Fonts: Montserrat (400, 600, 700 weights)

---

*Stack analysis: 2026-01-18*
