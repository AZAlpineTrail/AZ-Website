# DESIGN.md: Upper-Left Overlapping Logo Header Prototype

## Source

- URL: https://www.takecareofyourtrails.com/
- Capture date: 2026-10-19
- Evidence: Firecrawl branding and image scrape plus direct browser inspection of the top and scrolled states

## Design Summary

The earlier prototype used a large centered logo and controls balanced to either side. Client feedback moved the logo to the upper left, enlarged it, and made most of the mark hang below the navigation line so it reads as one confident brand element rather than a small header icon plus a second hero logo. All desktop navigation and utility controls stay together in one group at the upper right, and only the logo scrolls away.

## Design Tokens

### Colors

- Header background: AZAT `--forest-deep` (`#08130d`) with transparency over photographic content
- Collapsed navigation surface: a prominent 56px-tall dark liquid-glass Menu trigger with deep translucent forest color, strong blur and saturation, layered inner highlights, a quiet neutral glass edge, a gold burger accent, larger icon/type, and generous horizontal padding
- Navigation text: white at 78% opacity; full white for active and hover states
- Primary utility action: existing AZAT `--sun` gold treatment

### Typography

- Navigation: existing Geist sans, semibold, 14px
- Utility action and mobile menu label: existing Geist Mono, uppercase, 11px, wide letter spacing
- No typography from the reference site is imported

### Spacing And Layout

- Initial overlay header: 152px tall on mobile and 184px on larger screens
- Logo display height: 156px on mobile, 180px on tablet, and 220px on desktop
- Top breathing room: 12px on mobile, 16px on tablet, and 24px on desktop for the logo; navigation aligns at 40px on tablet/desktop
- Main header width: existing 1320px content rhythm
- Motion: natural page scroll for the logo; the full desktop navigation compresses toward its right edge with a soft blur/fade while the Menu trigger scales into the same position, reversing when the user returns to the top; reduced-motion swaps immediately

## Components

- Brand mark: upper-left AZAT logo and home link, overlapping the header and page below; it is not sticky
- Desktop navigation: primary links, map switch, and account controls appear together at the upper right initially, then collapse to the same compact Menu trigger and slide-out drawer used on mobile
- Mobile navigation: labeled Menu trigger remains fixed on the right and opens the shared slide-out drawer
- Skip link: preserved above all header layers

## Page Patterns

- Homepage: a transparent overlay sits on the photographic hero; the upper-left logo scrolls away naturally while both control groups remain fixed
- Inner pages: a dark brand region preserves content clearance while the logo overlaps its lower edge and scrolls away
- 3D map: the shared navigation remains, but the AZAT header logo is omitted because the map has its own identity treatment
- Scrolled state: the full navigation is gone; only a compact dark translucent Menu trigger remains at the upper right
- Mobile: the same hierarchy is retained, with the drawer trigger standing in for visible menu links

## Content Style

Keep existing AZAT labels and utility language. The reference informs hierarchy and placement, not copy or branding.

## Agent Build Instructions

- Keep the logo anchored at the upper left and every desktop navigation control together in one group at the upper right.
- Preserve the existing route switch, authentication controls, mobile focus trap, body scroll lock, Escape behavior, and reduced-motion drawer handling.
- Do not add a circular crop around the Arizona-shaped logo.
- Validate the initial and scrolled states at desktop and mobile widths, plus one inner page.

## Rerun Inputs

workflow: firecrawl-website-design-clone
source_url: https://www.takecareofyourtrails.com/
target_stack: Next.js 16, React 19, Tailwind CSS 4
output: DESIGN.md plus implementation
