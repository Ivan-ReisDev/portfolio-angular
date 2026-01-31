# Claude Dev Configuration

## Project Context
This is a modern **Angular 21 portfolio application** built with TypeScript, featuring server-side rendering (SSR), component-based architecture, and interactive UI elements. The project showcases development skills through a responsive, accessible, and performant web application.

## Architecture Overview
- **Framework**: Angular 21 with standalone components
- **Language**: TypeScript with strict mode
- **Styling**: SCSS with custom design system
- **Build**: Vite-based Angular build system
- **SSR**: Angular Express server for server-side rendering
- **Testing**: Vitest for unit testing
- **State Management**: Angular Signals and TransferState

## Project Structure
```
src/
├── app/
│   ├── core/                    # Core application logic
│   │   ├── components/          # Reusable UI components
│   │   ├── directives/          # Custom directives
│   │   ├── models/             # TypeScript interfaces
│   │   ├── services/           # Business logic services
│   │   └── utils/              # Utility functions
│   ├── pages/                  # Route-based components
│   └── app.ts                  # Root component
├── styles.scss                  # Global styles
├── main.ts                     # Application bootstrap
└── server.ts                   # SSR server
```

## Development Guidelines

### Component Development
- Use **standalone components** (no NgModules)
- Implement **Angular Signals** for reactive state management
- Follow **component-based architecture** with clear separation of concerns
- Use **dependency injection** for services and utilities
- Implement **OnPush** change detection where appropriate

### Code Style
- **TypeScript strict mode** enabled
- **Prettier** configuration: 100 character width, single quotes
- **SCSS** with custom variables and mixins
- **Angular ESLint** rules enforced
- Follow existing naming conventions (kebab-case for files, PascalCase for classes)

### Testing Strategy
- Use **Vitest** for unit testing
- Test component behavior and edge cases
- Focus on integration tests for complex interactions
- Maintain test coverage for critical components

### Performance Considerations
- **SSR** enabled for SEO and performance
- **Lazy loading** for route components
- **Bundle budgets**: 500kB warning, 1MB error
- **Optimized particle system** for mobile devices
- **Intersection Observer** for scroll animations

### Accessibility Standards
- **Semantic HTML5** elements
- **ARIA labels** where appropriate
- **Reduced motion** support for accessibility
- **Keyboard navigation** support
- **Screen reader** compatibility

## Key Dependencies

### Core Framework
- `@angular/core@^21.0.0` - Main Angular framework
- `@angular/router@^21.0.0` - Client-side routing
- `@angular/platform-browser@^21.0.0` - Browser platform
- `@angular/ssr@^21.0.0` - Server-side rendering

### UI & Interactions
- `@angular/cdk@^21.1.0` - Angular Component Dev Kit
- `@tsparticles/angular@^3.0.0` - Particle animation system
- `@tsparticles/slim@^3.9.1` - Lightweight particle engine

### Development Tools
- `typescript@~5.9.2` - TypeScript compiler
- `vitest@^4.0.8` - Unit testing framework
- `@angular/build@^21.0.0` - Build system
- `express@^5.1.0` - SSR server

## Common Development Tasks

### Creating New Components
```bash
ng generate component components/component-name --standalone --style=scss
```

### Running Development Server
```bash
npm start  # or ng serve
```

### Building for Production
```bash
npm run build  # or ng build
```

### Running Tests
```bash
npm test  # or ng test
```

### SSR Development
```bash
npm run serve:ssr:portfolio
```

## Component Patterns

### Service Integration
- Use **TransferState** for SSR data hydration
- Implement **error handling** and **loading states**
- Follow **observable patterns** with RxJS
- Use **signals** for component state

### Styling Conventions
- **SCSS variables** for design tokens
- **BEM methodology** for CSS classes
- **Responsive design** with mobile-first approach
- **Dark theme** consistency across components

### Routing Architecture
- **Lazy loaded** route components
- **Route guards** for navigation control
- **Param-based** routing for dynamic content
- **SEO-optimized** route structures

## Project Documentation
Detailed project planning and architecture decisions are documented in the `.planning/` directory, including:
- Requirements and specifications
- Development phases and roadmaps
- Architecture decisions and trade-offs
- Testing strategies and verification plans

## Environment Configuration
- **Development**: Hot reload with source maps
- **Production**: Optimized bundles with SSR
- **Testing**: Isolated test environment with jsdom
- **Build**: Vite-based compilation with budget constraints

## Code Quality Standards
- **Strict TypeScript** configuration
- **ESLint** rules for Angular best practices
- **Prettier** formatting for consistency
- **EditorConfig** for cross-editor compatibility
- **Git hooks** for pre-commit validation

## Development Rules

### Strict Code Standards
- **NO COMMENTS**: Never add comments to code. Code should be self-documenting
- **SOLID Principles**: Always follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles
- **Clean Code**: Write readable, maintainable, and refactor-friendly code
- **Remove Existing Comments**: When editing code with comments, remove all unnecessary comments while preserving code clarity

### Code Quality Mandates
- **Self-Documenting Code**: Use descriptive variable names, clear function names, and meaningful class names
- **Minimal Comments**: Only keep comments that explain complex business logic or critical architectural decisions
- **Refactor Instead**: If code needs comments to be understood, refactor it instead
- **DRY Principle**: Don't Repeat Yourself - extract reusable logic

This configuration ensures consistent, maintainable, and high-quality Angular development aligned with modern web development best practices, SOLID principles, and clean code standards.