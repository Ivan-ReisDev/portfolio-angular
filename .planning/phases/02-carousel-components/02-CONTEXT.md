# Phase 2: Carousel Components - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Build an interactive project carousel with card components for the main Projects section. Includes ProjectCard component with image, title, description, tags, and links, plus ProjectCarousel component with navigation arrows and animated transitions. Integration with existing Projects section.

Detail pages, routing, filtering, and search are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Navigation Controls
- Arrows + dots navigation pattern
- Three cards visible on desktop: center card focused, neighbors peeking from sides
- Arrow buttons overlay on sides of carousel (floating over cards)
- Dots indicator below carousel showing current position

### Card Content & Layout
- Image dominant: large image takes most of card, text below
- Standard info shown: title, short description, 2-3 tech tags
- Action links (GitHub, demo) visible directly on cards
- Glassmorphism visual style: translucent background with blur effect, rounded corners

### Transitions & Animations
- 3D perspective transition: center card large, side cards smaller/angled
- Smooth & elegant timing (~400-500ms transitions)
- Subtle lift hover effect: card rises slightly with enhanced shadow
- Fade in + rise entry animation when section first becomes visible

### Responsive Behavior
- Desktop (>1024px): 3 cards with 3D perspective carousel
- Tablet (768-1024px): 2 cards visible, reduced 3D effect
- Mobile (<768px): Stacked cards layout, vertical scroll instead of carousel
- Swipe gestures enabled on all devices (touch support everywhere)

### Claude's Discretion
- Dots click behavior (direct jump vs scroll through)
- Mobile navigation arrows presence/absence in stacked layout
- Exact breakpoint values for responsive transitions
- Loading skeleton design
- Error state handling

</decisions>

<specifics>
## Specific Ideas

- Glassmorphism cards should complement the existing portfolio aesthetic
- 3D perspective effect similar to Apple's cover flow but more subtle
- Smooth, polished feel over snappy/quick transitions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-carousel-components*
*Context gathered: 2026-01-18*
