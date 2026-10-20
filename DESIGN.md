# DESIGN.md: Centered Logo Header Prototype

## Source

- URL: https://www.takecareofyourtrails.com/
- Capture date: 2026-10-19
- Evidence: Firecrawl branding and image scrape plus direct browser inspection of the top and scrolled states

## Design Summary

The reference uses a transparent hero overlay with a large centered logo and controls balanced to either side. Its menu stays fixed and gains a compact opaque surface after the page begins moving. AZAT adapts that behavior to its two control groups: the visible desktop links remain fixed on the left, the utility controls remain fixed on the right, and only the centered logo scrolls away.

## Design Tokens

### Colors

- Header background: AZAT `--forest-deep` (`#08130d`) with transparency over photographic content
- Sticky navigation surface: AZAT forest green (`#173d2b`) with a soft shadow and no horizontal rule
- Navigation text: white at 78% opacity; full white for active and hover states
- Primary utility action: existing AZAT `--sun` gold treatment

### Typography

- Navigation: existing Geist sans, semibold, 14px
- Utility action and mobile menu label: existing Geist Mono, uppercase, 11px, wide letter spacing
- No typography from the reference site is imported

### Spacing And Layout

- Initial overlay header: 152px tall on mobile and 184px on larger screens
- Logo display height: 136px on mobile and 168px on larger screens
- Main header width: existing 1320px content rhythm
- Motion: natural page scroll for the logo and right-side controls; 300ms surface transition for the fixed menu

## Components

- Brand mark: centered AZAT logo and home link in the hero overlay; it is not sticky
- Desktop navigation: primary links remain fixed on the left and gain a compact forest surface after scrolling
- Desktop utilities: map and account controls remain fixed on the right and gain the same compact forest surface after scrolling
- Mobile navigation: labeled Menu trigger remains fixed on the right, gaining the same compact forest surface after scrolling
- Skip link: preserved above all header layers

## Page Patterns

- Homepage: a transparent overlay sits on the photographic hero; the centered logo scrolls away naturally while both control groups remain fixed
- Inner pages: a dark 136/160px brand region preserves content clearance and uses the same scroll-away behavior
- Scrolled state: no full-width header or border remains; only the navigation control receives a floating solid surface
- Mobile: the same hierarchy is retained, with the drawer trigger standing in for visible menu links

## Content Style

Keep existing AZAT labels and utility language. The reference informs hierarchy and placement, not copy or branding.

## Agent Build Instructions

- Keep the logo visually centered independently of the left navigation and right-side controls.
- Preserve the existing route switch, authentication controls, mobile focus trap, body scroll lock, Escape behavior, and reduced-motion drawer handling.
- Do not add a circular crop around the Arizona-shaped logo.
- Validate the initial and scrolled states at desktop and mobile widths, plus one inner page.

## Rerun Inputs

workflow: firecrawl-website-design-clone
source_url: https://www.takecareofyourtrails.com/
target_stack: Next.js 16, React 19, Tailwind CSS 4
output: DESIGN.md plus implementation
