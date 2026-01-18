# Coding Conventions

**Analysis Date:** 2026-01-18

## Naming Patterns

**Files:**
- Component files: `kebab-case.ts` (e.g., `card-stacks.ts`, `home.ts`)
- Template files: `kebab-case.html` (e.g., `navbar.html`)
- Style files: `kebab-case.scss` (e.g., `card-stacks.scss`)
- Test files: `kebab-case.spec.ts` co-located with source (e.g., `navbar.spec.ts`)
- Config files: `camelCase.ts` (e.g., `app.config.ts`, `app.routes.ts`)

**Components (Class Names):**
- PascalCase without "Component" suffix: `Home`, `Navbar`, `CardStacks`, `Education`
- Example: `export class CardStacks {}` in `src/app/core/components/card-stacks/card-stacks.ts`

**Selectors:**
- Prefix `app-` with kebab-case: `app-navbar`, `app-card-stacks`, `app-header`
- Example: `selector: 'app-education'`

**Variables:**
- camelCase for properties: `activeSection`, `scrollContainer`, `currentYear`
- camelCase for methods: `scrollToSection()`, `toggleShowMore()`, `ngAfterViewInit()`

**Types:**
- PascalCase with descriptive suffix: `CardStacksType`, `TimelineItem`
- Defined inline with `type` keyword above component class

**Properties:**
- Use `@Input()` decorator for component inputs
- Use `signal()` for reactive state in newer patterns
- Private properties prefixed with `private` keyword

## Code Style

**Formatting:**
- Prettier configured in `package.json`:
  - `printWidth: 100`
  - `singleQuote: true`
  - Angular HTML parser for templates

**Editor Config (`.editorconfig`):**
- Indent: 2 spaces
- Charset: UTF-8
- Single quotes for TypeScript (`quote_type = single`)
- Final newline: Yes
- Trim trailing whitespace: Yes

**TypeScript Strictness (`tsconfig.json`):**
- `strict: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`

**Angular Strictness:**
- `strictTemplates: true`
- `strictInjectionParameters: true`
- `strictInputAccessModifiers: true`

## Import Organization

**Order:**
1. Angular core/common modules (`@angular/core`, `@angular/common`)
2. Angular router (`@angular/router`)
3. Local components (relative paths)

**Example from `src/app/app.ts`:**
```typescript
import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/components/header/header';
import { About } from './core/components/about/about';
```

**Path Aliases:**
- Not configured - uses relative paths
- `stylePreprocessorOptions.includePaths` set to `["src/app"]` for SCSS imports

## Component Structure

**Standard Angular 21 Standalone Component Pattern:**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-component-name',
  imports: [],  // Standalone imports array
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss',
})
export class ComponentName {
  // Properties first
  // Lifecycle methods
  // Custom methods
}
```

**Key Patterns:**
- All components are standalone (no NgModule)
- Use `imports: []` array in decorator for dependencies
- Separate template and style files (not inline)
- `styleUrl` singular (not `styleUrls` array)

## Error Handling

**Patterns:**
- Early returns for guard clauses: `if (sectionIndex === -1) return;`
- Optional chaining for null safety: `this.observer?.disconnect()`
- Console error in bootstrap: `.catch((err) => console.error(err))`

**Platform Checks:**
- Use `isPlatformBrowser()` for browser-only code:
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Browser-only code (IntersectionObserver, DOM APIs)
  }
}
```

## Logging

**Framework:** Console (no external logging library)

**Patterns:**
- Error logging: `console.error(err)`
- No debug/info logging observed in codebase

## Comments

**When to Comment:**
- Comments in Portuguese explaining complex logic
- Examples: `// Adicionar listener de scroll`, `// Anima os cards (da direita)`

**JSDoc/TSDoc:**
- Not used in current codebase

## Function Design

**Size:**
- Methods kept focused and relatively short (10-30 lines typical)
- Lifecycle hooks contain initialization logic directly

**Parameters:**
- Use TypeScript types for parameters
- Direction parameters use union types: `direction: 'next' | 'prev'`

**Return Values:**
- Void returns for event handlers and lifecycle methods
- Getter properties for computed values: `get visibleItems(): TimelineItem[]`

## Module Design

**Standalone Components:**
- No NgModules - all components standalone
- Dependencies declared in `imports` array of `@Component` decorator

**Exports:**
- Named exports only: `export class ComponentName`
- No barrel files (`index.ts`) - direct imports from component files

## State Management

**Signals (Angular 21):**
```typescript
protected readonly title = signal('portfolio');
activeSection = signal('inicio');
```

**Traditional Properties:**
```typescript
showAll = false;
initialItemsCount = 3;
stacks: CardStacksType[] = [...];
```

## Template Conventions

**Angular Control Flow:**
- Using modern `@if`, `@for` syntax (Angular 17+)
- Self-closing tags for components: `<app-card-stacks />`

**Class Binding:**
- Bracket syntax: `[class.active]="activeSection === 'inicio'"`

**Event Binding:**
- Parenthesis syntax for events (standard Angular)

## SCSS Conventions

**Variables:**
- Defined in `src/app/app.scss`:
  - `$primary-black: #000000`
  - `$secondary-blue: #43a3be`
  - `$gray: #686868`

**Importing Variables:**
```scss
@use 'app.scss' as *;
```

**Naming:**
- kebab-case for class names: `.navbar`, `.scroll-container`, `.snap-section`
- BEM-like modifiers: `.active`, `.reset`

**Nesting:**
- Use SCSS nesting for component styles
- Pseudo-elements with `&::before`, `&::after`
- State modifiers with `&.active`, `&:hover`

---

*Convention analysis: 2026-01-18*
