# Testing Patterns

**Analysis Date:** 2026-01-18

## Test Framework

**Runner:**
- Vitest 4.x (via Angular 21 built-in support)
- Config: `@angular/build:unit-test` builder in `angular.json`
- TypeScript types: `vitest/globals` in `tsconfig.spec.json`

**Assertion Library:**
- Vitest globals (Jasmine-compatible syntax with `expect()`)

**Run Commands:**
```bash
npm test              # Run all tests (ng test)
ng test              # Direct Angular CLI command
```

## Test File Organization

**Location:**
- Co-located with source files (same directory)

**Naming:**
- Pattern: `{component-name}.spec.ts`
- Examples: `navbar.spec.ts`, `home.spec.ts`, `card-stacks.spec.ts`

**Structure:**
```
src/app/
├── app.ts
├── app.spec.ts
└── core/components/
    ├── navbar/
    │   ├── navbar.ts
    │   ├── navbar.spec.ts
    │   ├── navbar.html
    │   └── navbar.scss
    └── home/
        ├── home.ts
        ├── home.spec.ts
        └── ...
```

## Test Structure

**Suite Organization:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]  // Standalone component in imports
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

**Patterns:**
- `describe()` block named after component class
- Single `beforeEach()` for test setup
- Async setup with `await TestBed.configureTestingModule(...).compileComponents()`
- `fixture.whenStable()` awaited before assertions
- Standalone components imported directly (not declared)

## Test Setup Pattern

**Standard Component Test Setup:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

**Key Elements:**
- `ComponentFixture<T>` typed to specific component
- `TestBed.configureTestingModule()` with `imports` array for standalone components
- `.compileComponents()` always called
- `fixture.whenStable()` for async template compilation

## Testing Angular 21 Standalone Components

**Import Pattern:**
```typescript
// For standalone components, use imports (not declarations)
await TestBed.configureTestingModule({
  imports: [ComponentName]  // Standalone component
}).compileComponents();
```

**Component with Dependencies:**
```typescript
// Component that imports other components
await TestBed.configureTestingModule({
  imports: [App]  // App imports Header, Home, About, etc.
}).compileComponents();
```

## Mocking

**Framework:** Angular TestBed (no external mocking library detected)

**Current State:**
- No mocking patterns observed in existing tests
- Tests are basic "should create" smoke tests only

**Recommended Patterns (not yet implemented):**
```typescript
// Service mocking (when services are added)
const mockService = jasmine.createSpyObj('ServiceName', ['methodName']);

await TestBed.configureTestingModule({
  imports: [ComponentName],
  providers: [
    { provide: ServiceName, useValue: mockService }
  ]
}).compileComponents();
```

**What to Mock:**
- External services (when implemented)
- HTTP clients
- Platform-specific APIs (IntersectionObserver, etc.)

**What NOT to Mock:**
- Component under test
- Simple child components (can be imported directly)

## Fixtures and Factories

**Test Data:**
- No fixture files or factories detected
- Component data defined inline in components

**Recommended Location:**
- Create `src/app/testing/` directory for shared fixtures
- Or co-locate fixtures with components as `*.fixtures.ts`

## Coverage

**Requirements:** Not enforced

**Configuration:**
- No coverage thresholds configured in `angular.json`
- Vitest supports coverage via `--coverage` flag

**View Coverage:**
```bash
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Basic component instantiation tests
- Located in `*.spec.ts` files
- Use Angular TestBed for component testing

**Integration Tests:**
- Not implemented
- Would test component interactions and routing

**E2E Tests:**
- Not configured
- No Playwright, Cypress, or Protractor detected

## Common Patterns

**Async Testing:**
```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ComponentName]
  }).compileComponents();

  fixture = TestBed.createComponent(ComponentName);
  component = fixture.componentInstance;
  await fixture.whenStable();  // Wait for async operations
});
```

**DOM Testing:**
```typescript
it('should render title', async () => {
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('h1')?.textContent).toContain('Hello, portfolio');
});
```

**Component Instance Testing:**
```typescript
it('should create', () => {
  expect(component).toBeTruthy();
});
```

## Existing Test Files

**App Level:**
- `src/app/app.spec.ts` - Tests App component creation and title rendering

**Core Components:**
- `src/app/core/components/header/header.spec.ts`
- `src/app/core/components/navbar/navbar.spec.ts`
- `src/app/core/components/home/home.spec.ts`
- `src/app/core/components/about/about.spec.ts`
- `src/app/core/components/footer/footer.spec.ts`
- `src/app/core/components/card-stacks/card-stacks.spec.ts`
- `src/app/core/components/carousel/carousel.spec.ts`
- `src/app/core/components/projects/projects.spec.ts`
- `src/app/core/components/education/education.spec.ts`
- `src/app/core/components/typography/title/title.spec.ts`

**Pages:**
- `src/app/pages/blog/blog.spec.ts`
- `src/app/pages/auth/auth.spec.ts`

## Test Gaps

**Missing Tests:**
- No behavioral tests beyond "should create"
- No input/output binding tests
- No event handler tests
- No service tests (no services exist yet)
- No routing tests
- No form validation tests
- No error handling tests

**Components Needing Better Coverage:**
- `App` - scroll behavior, section navigation
- `Education` - `toggleShowMore()`, `visibleItems` getter
- `CardStacks` - data rendering
- Components with `IntersectionObserver` - animation triggers

## Writing New Tests

**Basic Component Test Template:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add behavioral tests:
  it('should do something when triggered', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**Testing @Input Properties:**
```typescript
it('should accept input', () => {
  component.activeSection = 'sobre';
  fixture.detectChanges();
  // Assert DOM reflects input
});
```

**Testing Methods:**
```typescript
it('should toggle visibility', () => {
  expect(component.showAll).toBeFalse();
  component.toggleShowMore();
  expect(component.showAll).toBeTrue();
});
```

---

*Testing analysis: 2026-01-18*
