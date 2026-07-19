<!--
Sync Impact Report
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: N/A (first concrete adoption, template placeholders replaced)
Added sections:
  - Core Principles I–VI (SOLID, DDD, Component Reuse, Reactive State/DI, Testing, Clean Code)
  - Frontend & Performance Standards
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none (template placeholders only)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no change needed (Constitution Check gate reads this file dynamically)
  - .specify/templates/spec-template.md ✅ no change needed (technology-agnostic by design)
  - .specify/templates/tasks-template.md ✅ no change needed (generic task categories already support component-reuse/testing gates)
  - .claude/skills/speckit-*/SKILL.md ✅ reviewed, no agent-specific renaming required
Follow-up TODOs: none
-->

# Portfolio Angular Constitution

## Core Principles

### I. Single Responsibility & Standalone Components (SOLID)

Every component, directive, and service MUST have exactly one reason to change.
Components are standalone (no NgModules), stay focused on presentation, and
delegate business logic, data access, and side effects to injectable services.
`OnPush` change detection is the default for every component; any component
that cannot use it MUST document why in a code comment limited to that
justification. A component or service that outgrows a single responsibility
MUST be split rather than extended with unrelated behavior.

**Rationale**: SRP keeps components small, testable, and safe to refactor —
essential in a portfolio codebase maintained solo and revisited infrequently.

### II. Domain-Driven Structure

Code MUST be organized by domain, not by technical layer alone. Business
rules, data models, and orchestration for a given domain (e.g. projects,
contact, experience) live together under `core/services`, `core/models`, and
`core/utils`, decoupled from the `pages/` components that present them. Pages
and shared UI components consume domain logic exclusively through service
interfaces and dependency injection — never by importing another feature's
internal state or reaching into its component tree. New domain concepts get
an explicit model/interface in `core/models` before being wired into a page.

**Rationale**: A clear domain boundary keeps presentation and business logic
independently replaceable and prevents the "everything imports everything"
decay common in single-page portfolio apps as they grow.

### III. Component Reuse & Composition Over Duplication (DRY / Open-Closed)

Before creating a new component, directive, or pipe, the codebase's existing
`core/components`, `core/directives`, and shared utilities MUST be checked for
something that can be reused or extended via `@Input`/`@Output`, content
projection, or composition. Visual or behavioral duplication across two or
more places is a signal to extract a shared, reusable component — it MUST NOT
be copy-pasted. Shared components are open for extension (inputs, content
slots, configuration) and closed for modification of their internal behavior
by individual consumers.

**Rationale**: Maximizing component reuse is an explicit project goal —
it keeps the design system consistent and shrinks the surface area that needs
updating when the portfolio's look and feel evolves.

### IV. Reactive State with Signals & Dependency Inversion

Component and service state MUST use Angular Signals as the default reactive
primitive; RxJS Observables are used at integration boundaries (HTTP, events)
and converted to signals where they represent state. Components depend on
service abstractions injected via Angular DI, never on concrete
implementations reached into directly or instantiated with `new`. Services
expose read-only signals/observables and dedicated methods for mutation —
internal mutable state MUST NOT be exposed directly. SSR data fetched once on
the server MUST be handed to the client via `TransferState` instead of being
re-fetched.

**Rationale**: Signals plus DI-based abstractions keep state predictable,
make services independently testable and swappable (Dependency Inversion),
and avoid redundant SSR-to-client fetches.

### V. Test-Discipline & Verified Behavior

Services and components containing non-trivial logic MUST have Vitest
coverage before the work is considered done. Every bug fix MUST add a
regression test that fails before the fix and passes after. Tests assert
observable behavior and edge cases, not internal implementation details, so
they survive refactors permitted by Principles I–III.

**Rationale**: A portfolio site is a showcase of engineering discipline —
untested logic undermines that goal and risks silent regressions during
front-end redesign work.

### VI. Clean, Self-Documenting, Strict TypeScript Code

TypeScript strict mode is always on. Code MUST be self-documenting through
descriptive naming; comments are NOT written except to capture a non-obvious
business rule, a critical architectural decision, or a workaround for a
specific external constraint. If code needs a comment to be understood, it
MUST be refactored instead. ESLint and Prettier rules are enforced on every
commit and MUST NOT be suppressed to silence a warning without a documented
reason.

**Rationale**: This is a hard requirement carried over from the project's
existing engineering standards (see `CLAUDE.md`) — self-documenting code is
both a quality bar and a portfolio demonstration of clean-code practice.

## Frontend & Performance Standards

- **SSR & Hydration**: Angular Express SSR stays enabled for every route;
  hydration MUST NOT re-fetch data already available via `TransferState`.
- **Loading Strategy**: Route-level components are lazy-loaded; the particle
  system and other heavy visual effects MUST degrade gracefully on mobile and
  under `prefers-reduced-motion`.
- **Bundle Budgets**: 500kB warning / 1MB error budgets per the Angular build
  config MUST NOT be raised without an explicit, documented justification.
- **Styling**: SCSS with the project's design tokens and BEM naming; visual
  changes MUST preserve dark-theme consistency across all reused components.
- **Accessibility**: Semantic HTML5, ARIA labels where semantics are
  insufficient, full keyboard navigation, and screen-reader compatibility are
  required for every new or modified UI surface — not retrofitted later.

## Development Workflow & Quality Gates

- Before opening a component, contributors (human or agent) MUST check for an
  existing reusable component/directive per Principle III.
- Lint (`ng lint` / ESLint) and tests (`vitest`) MUST pass before a change is
  considered complete; hooks and checks MUST NOT be bypassed (no `--no-verify`
  or equivalent) without explicit user authorization.
- Every `/speckit-plan` MUST run the Constitution Check gate against this
  document before Phase 0 research and again after Phase 1 design; violations
  are recorded in that plan's Complexity Tracking table with justification.
- Accessibility and responsive behavior (mobile-first) are verified for any
  UI-facing change before it is marked done.

## Governance

This constitution supersedes ad hoc practice for all work in this
repository; `CLAUDE.md` MUST remain consistent with it and is the operational
detail layer beneath these principles. Amendments are made by editing this
file, incrementing the version per the policy below, and recording the
change in the Sync Impact Report comment at the top of the file.

**Versioning policy** (semantic versioning applied to governance):
- **MAJOR**: Backward-incompatible principle removal or redefinition.
- **MINOR**: A new principle or materially expanded section is added.
- **PATCH**: Wording clarifications, typo fixes, non-semantic edits.

All plans and non-trivial PRs MUST verify compliance with this constitution
via the Constitution Check gate; unresolved violations MUST be justified in
the plan's Complexity Tracking table or the work MUST be redesigned to comply.
Use `CLAUDE.md` for day-to-day runtime development guidance that operationalizes
these principles.

**Version**: 1.0.0 | **Ratified**: 2026-07-18 | **Last Amended**: 2026-07-18
