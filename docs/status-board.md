# AZAT Status Board

Living tracker of what's broken, unfinished, planned, and recently fixed on the AZAT site. Treat this like a Trello board in markdown: items move between columns as work happens.

## How to use this board

- **Before starting work:** check here first so you don't duplicate a known issue or "fix" something that's an intentional placeholder.
- **When you fix something:** move its entry from `Broken` or `Unfinished` into `Recently Resolved`, add the date and a one-line note on what changed.
- **When you find a new issue:** add it to `Broken` or `Unfinished` (whichever fits) with the date found and enough detail that someone with no other context could act on it.
- **When scope grows:** add new ideas to `Backlog` rather than letting them creep into `Unfinished`. `Unfinished` is for things already partially built; `Backlog` is for things not started.
- Keep `Recently Resolved` trimmed to the last ~10-15 entries — prune older ones or fold them into `work-done.md` once they're confirmed stable in production.

Last full audit: 2026-09-29 (transferred Vercel production deployment, launch security, indexing, dependency, build, authentication, downloads, contact, Mapbox, and analytics checks) + 2026-08-18 (Firecrawl content-parity crawl of live azalpinetrail.org — see [live-site-production-diagnosis.md](live-site-production-diagnosis.md)).
Last progress check: 2026-09-29 (canonical and legacy-route repairs, production firewall behavior, and Supabase launch configuration verification).

---

## 🔴 Broken (not working as intended)

- [ ] **Contact form needs a final production delivery test** — Resend delivery is wired into `src/app/api/contact/route.ts`, the `mail.azalpinetrail.org` sending domain is verified, and the transferred Vercel production project has the required configuration. The Vercel Firewall rule is active: a black-box test received HTTP 429 on the sixth invalid `POST /api/contact` request after five HTTP 400 validation responses. Before changing public DNS, submit one real production message and confirm delivery to `azalpinetrailit@gmail.com`. *Firewall behavior verified 2026-09-29; prior Preview delivery verified 2026-09-22.*

## 🚧 Unfinished / placeholder (partially built, known incomplete)

- [ ] **Supabase authentication needs final real-inbox flow tests** — The production dashboard is configured for `https://azalpinetrail.org` with the exact `/auth/callback` redirect, Confirm email is enabled, Resend-backed custom SMTP is enabled, the confirmation and password-reset templates use `{{ .ConfirmationURL }}`, the sign-in template uses `{{ .Token }}`, email OTPs are 8 digits with a 1-hour expiry, and sign-up/sign-in requests are limited to 10 per 5 minutes per IP. Before changing public DNS, complete confirmation, email-code sign-in, and password-recovery tests using a controlled real inbox. *Dashboard settings verified 2026-09-29; user migration completed 2026-09-23.*

## 📌 Next up (decided scope — not started)

Triaged out of the inventory below on 2026-08-18. Trail segments, the FAQ page, legacy redirects, protected download files, the placeholder Shop page, and the Resources external link list are done.

- [x] **Accessible site-wide contact access** — Added a fixed message button on eligible public pages, an accessible desktop dialog/mobile bottom sheet that reuses the main contact form, and stronger contact CTAs in the mobile menu and footer. The quick form includes keyboard focus trapping/restoration, Escape-to-close, reduced-motion support, mobile safe-area spacing, visible focus, delivery states, and a full contact-page link. It is excluded from `/contact`, Studio, account/auth, and individual protected-download agreement pages. *Added and implemented 2026-09-20; final delivery verification remains covered by the Resend item above.*

## 🗂️ Live-site parity inventory (PENDING TRIAGE — not yet a to-do list)

Full detail and full redirect map: [live-site-production-diagnosis.md](live-site-production-diagnosis.md). This is a raw inventory of what exists on the live WordPress site (azalpinetrail.org) that this app doesn't yet have. **"The old site has it" is not by itself a reason to rebuild it.** Nothing below should be treated as scoped work until each row has a Decision. Once decided, move `keep`/`redirect-and-defer` items into the relevant section above (🔴 Broken, 🚧 Unfinished, or 📋 Backlog) — don't leave decided items sitting in this table.

| Item | What the live site has | Decision | Notes |
|---|---|---|---|
| Redirects for retired URLs | ~50+ live URLs across towns, downloads, auth, products, news (segment-URL redirects are covered under the segment-pages item in Next Up) | ✅ Done | Added path-based redirects in `next.config.ts` so they will work when `azalpinetrail.org` points at the new app. |
| Town pages | ~19 towns (Alpine, Eagar, Forest Lakes, Greer, Hannagan Meadow, Heber-Overgaard, Holbrook, Jakes Corner, Payson, Pinedale, Pine, Pinetop-Lakeside, Punkin Center, Show Low, Strawberry, Taylor-Snowflake, Winslow, Young) | ✅ Removed | Public town pages were removed from the new site. Old town URLs redirect to `/trail`. |
| `/downloads` landing page | Gated index page before individual downloads | ✅ Done | `/downloads` is now a real index page listing every active download (overall trail files + all 28 segments), sourced live from `listActiveDownloads()`. |
| Old protected-download IDs | `/protected-download/2113` (GPX), `/2127` (SHP), `/2248` (KML) | ✅ Done | Redirected to the matching new protected download slugs. |
| News post bodies | Full post content for ~7 posts | ⬜ TBD | Local site has 3 posts, and even those render placeholder body text. |
| WordPress account migration | Existing rider logins | ✅ Done | Imported 350 subscriber accounts into Supabase without passwords; all now use email-code sign-in. The WordPress administrator was excluded. |
| Stray `.com` → `.org` links | A few old embeds on the Alpine page | ✅ Not applicable | Public town pages were removed. |
| Legacy placeholder/utility pages | `/sample-page`, `/home`, `/pardon-our-dust`, `/sorry-we-are-not-accepting-users-yet`, `/category/*`, `/author/...` | ✅ Redirected | Redirected to the nearest useful current page instead of preserving WordPress-era placeholders. |

**Explicitly not a decision yet:** full commerce checkout scope and account migration are the biggest remaining cost drivers — still open.

## 📋 Backlog (planned, not started)

- [ ] Choose and configure production analytics after launch. Prefer a free, privacy-conscious option that works on Linode; document the selected provider in the privacy policy before enabling it. *Deferred 2026-09-22.*
- [ ] Wildfire alert banner and automated NIFC/FIRMS data pipeline. The UI is disabled and this is intentionally outside launch scope. *Deferred 2026-09-22.*
- [ ] Six-region planning structure (replace/augment segment-only view).
- [ ] Fuel/lodging/service map layers + connector routes.
- [ ] Itinerary generator (start town, direction, daily mileage, fuel range → candidate plan).
- [ ] TrailWatch-style rider-submitted trail condition reporting (needs moderation model first).
- [ ] Business/partner listings, event registration.
- [ ] Data-pilot phase: GPX mileage extraction + verified town/service inventory for one pilot region (Alpine/Springerville/Greer/Show Low). See [azat-next-steps-pitch-plan.md](azat-next-steps-pitch-plan.md).
- [ ] Invoicing — no invoice has been created for work done so far.
- [ ] **Sanity dependency advisories (post-launch).** `npm audit --omit=dev` reports 11 high / 12 moderate, all inside the `sanity` package tree (CLI, build tooling, in-browser Studio). None ship in public pages. `npm audit fix` bumps ~264 packages (sanity 6.3→6.17, @sanity/cli 7→8, next-sanity, motion 12→13), so it was reverted pre-launch; do it as a planned upgrade with a full Studio + site regression pass. *Triaged 2026-09-29.*
- [ ] **Move Sanity Studio off the public site (post-launch).** `/studio` is noindex and requires Sanity login, but hosting it via `sanity deploy` (`*.sanity.studio`) would drop it from the production bundle and attack surface. *Noted 2026-09-29.*
- [ ] **Content Security Policy (post-launch).** No CSP header yet. Start with `Content-Security-Policy-Report-Only` covering Mapbox, Supabase, Sanity, Vercel Analytics, and OpenStreetMap tiles, then enforce. *Noted 2026-09-29.*
- [ ] **Homepage image/JS weight.** Lighthouse mobile 93; LCP 3.2s from the hero (already `next/image` + `priority`). Estimated ~435 KiB image and ~628 KiB unused-JS savings. *Noted 2026-09-29.*
- [ ] **Stale external event link.** `src/lib/content.ts` links to the Arizona Game & Fish Outdoor Expo 2025 page (event was March 2025). *Noted 2026-09-29.*

## ✅ Recently resolved

- [x] **Pre-launch audit fixes.** Skip link now works site-wide (`id="main"` on every page's `<main>`). Non-canonical hosts (e.g. `az-website-ruddy.vercel.app`) send `X-Robots-Tag: noindex, nofollow`; `azalpinetrail.org` and `www` do not. 3D terrain map shows its "unavailable" fallback instead of crashing when WebGL is missing. Download sign-in modal and mobile menu now trap keyboard focus (shared `src/lib/useFocusTrap.ts`); the modal also autofocuses and restores focus on close. Registration and password-login errors keep name/ZIP/email. Fixed dead Arizona DOT OHV link and removed the circular "AZAT: OHV information" link. Added a branded 404 page. Map zoom controls are 44px on touch devices; "View in 3D" moved left on mobile so the contact launcher no longer covers it. Logo link's accessible name now matches its visible text. The reported email-code "stuck after one wrong code" bug did not reproduce locally or on the live Vercel deployment. *Resolved 2026-09-29; deployment pending.*

- [x] **Canonical URLs and two broken legacy routes repaired.** Added page-specific canonical and Open Graph URLs to all 28 trail segments, all 7 news posts, and Rusty 1000. Added a permanent redirect for the retired Rusty 1000 article URL and redirected the missing goals/workshop article to `/news`. A production build and automated crawl confirmed all 46 sitemap pages return HTTP 200 with the exact expected `https://azalpinetrail.org` canonical; both repaired legacy routes return HTTP 308. *Resolved 2026-09-29; deployment pending.*
- [x] **Privacy page deliberately excluded from current launch scope.** The absent `/privacy` and `/privacy-policy` pages are intentional and are not being treated as DNS-cutover blockers at the site owner's direction. *Decision recorded 2026-09-29.*
- [x] **Indexing and baseline browser-security controls added.** Added generated `robots.txt` and `sitemap.xml`, marked Sanity Studio `noindex, nofollow`, removed the `X-Powered-By` response header, and added `nosniff`, same-origin framing, referrer, and browser permissions headers. Lint, type-checking, and a full 51-page production build pass. *Resolved 2026-09-29; deployment pending.*
- [x] **Linode runtime requirement removed from launch scope.** The new site is deploying on client-owned Vercel Pro while the existing Linode WordPress site remains available only as the temporary rollback host, so the old Linode does not need a Node.js runtime upgrade for this launch. *Resolved 2026-09-29.*
- [x] **Production ownership transferred.** Client ownership/access for the production systems was confirmed complete. *Confirmed 2026-09-22.*
- [x] **Preview authentication and contact delivery verified.** Email-code sign-in and Resend contact delivery both work on the protected Vercel Preview. Production Linode configuration remains tracked separately. *Verified 2026-09-22.*
- [x] **WordPress subscriber accounts migrated.** Imported 349 new passwordless accounts and matched one existing account, covering all 350 WordPress subscribers. The administrator, passwords, phone numbers, IP addresses, old terms acceptance, paid-member status, and download history were excluded. A post-import dry run confirmed zero accounts remain to create. *Resolved 2026-09-23.*
- [x] **Next.js security update completed.** Upgraded `next` and `eslint-config-next` together from `16.2.10` to `16.3.5`, above the `16.3.3` patched boundary in the critical image-optimization advisory. The production dependency audit no longer reports any vulnerability against Next.js. Remaining audit findings are tracked separately because they originate primarily in the Sanity CLI/workbench dependency tree and a forced audit fix proposes a breaking Sanity downgrade. *Resolved 2026-09-20.*
- [x] **`/impeccable polish` pass on the Downloads/nav work.** Fixed a real lint error the drawer work introduced (`react-hooks/set-state-in-effect`: closing the drawer on navigation via a raw `setState` inside a `pathname`-keyed effect) by switching to React's documented render-time state-adjustment pattern instead. Fixed a genuine a11y bug it also introduced: the drawer's open/close focus-management effect ran on initial mount too, silently stealing focus onto the hamburger button on every page load — guarded with an initial-render ref. Added a real missing empty state: `/downloads`' "Segment files" section would render a silent blank grid with zero explanation if Supabase is unreachable (the fallback data only covers the 3 overall files); both sections now show "aren't available right now — check back soon" text in that case, matching the site's existing honest-placeholder voice (`/shop`'s "coming soon"). `tsc`, `eslint`, and the mechanical detector all clean across every file touched this session; re-verified focus management, drawer-closes-on-navigate, and no-stolen-focus-on-load in the browser. *Resolved 2026-09-12.*
- [x] **Download links on `/downloads` given unique accessible names.** `/impeccable audit` flagged that all 31 download buttons on the new `/downloads` page shared the identical visible/accessible name "Download," so a screen-reader user browsing by link list heard "Download, link" 31 times with no way to tell files apart. `ProtectedDownloadLink` (`src/components/auth/ProtectedDownloadLink.tsx`) gained an `ariaLabel` prop; `/downloads` (`src/app/downloads/page.tsx`) now passes a distinct label per card — e.g. "Download Complete Trail GPX", "Download segment 12, Black River". Verified all 31 links have unique `aria-label`s in the rendered DOM. *Resolved 2026-09-12.*
- [x] **Mobile header navigation rebuilt as a slide-in drawer.** `/impeccable audit` flagged that adding the "Downloads" nav item pushed the header past what fits in one row — verified in-browser that the Register button was pushed fully off-screen and untappable at 375px. Rather than hiding another item, rebuilt the header for `<1024px` (`lg:` breakpoint) as a hamburger trigger + slide-in drawer (`src/components/Header.tsx`) matching `AuthModal`'s existing motion/visual language (scrim, `framer-motion`, `prefers-reduced-motion` handling, focus management — focus moves into the drawer on open and returns to the trigger on close, Escape closes it, body scroll locks while open). `AuthHeaderControls` (`src/components/auth/AuthHeaderControls.tsx`) gained a `variant: "drawer"` for the full-width stacked auth buttons inside it, replacing the old cramped `compact` top-bar variant. Verified at 375px, 768px, 1023px, and 1024px. *Resolved 2026-09-12.*
- [x] **Dedicated `/downloads` page built; header wrap bug fixed.** New `src/app/downloads/page.tsx` lists every active download (overall trail files + all 28 segments, sorted in trail order) by calling the already-built-but-previously-unused `listActiveDownloads()`, so it updates automatically as new files are published — no code change needed. Removed the old `/downloads` → `/resources` redirect; header and footer "Downloads" links now both point here. `/resources` no longer shows a downloads grid (moved out to avoid conflating it with FAQ/official-links content); it now links out to `/downloads` instead. Also fixed the header's desktop "Log in"/"Register"/"Account"/"Log out" buttons wrapping onto two lines at ~640-880px widths (missing `whitespace-nowrap`, which the mobile variant already had). *Resolved 2026-09-12.*
- [x] **Rusty's Sep 2 feedback batch resolved.** Deleted the "Zones & enforcement" FAQ section (dead per client request), fixed the broken Facebook group link in the footer, added a "Downloads" header nav link pointing to `/resources` (files existed but were undiscoverable), swapped the old circular logo on the "A Word From Our President" post for the current AZAT logo, and renamed "Rusty's Route 1000" to "Rusty 1000" site-wide (nav, route page, FAQ, homepage itinerary card, Sanity schema labels). *Resolved 2026-09-12.*
- [x] **Resources external link list added.** `/resources` now includes the official rider links from the migrated FAQ/live-site capture: AZAT OHV info, Arizona Game and Fish, ADOT, State Land, USFS MVUM, forest alerts, and Arizona 511. *Resolved 2026-08-29.*
- [x] **Authenticated download QA completed.** Verified 31 active download metadata rows, 31 publicly visible metadata rows, 3 full-route storage files, 28 segment GPX storage files, signed-out API denial, and authenticated API downloads for the complete GPX plus the Rye Creek segment GPX. *Resolved 2026-08-29.*
- [x] **Responsive QA pass completed.** Checked homepage, resources, trail, shop, and contact at desktop/mobile widths; verified no horizontal overflow, no framework overlays, clean contact form behavior, footer visibility, and trail segment search interaction. *Resolved 2026-08-29.*
- [x] **Town pages removed.** Deleted `/towns` and `/towns/[slug]`, removed active links to those pages, and redirected old town URLs to `/trail`. *Resolved 2026-08-29.*
- [x] **Footer contact/social links added.** Footer now includes Contact, Facebook, and a Facebook group discovery link alongside nonprofit identity text. *Resolved 2026-08-29.*
- [x] **SEO metadata pass completed.** Added stronger default metadata plus page-level titles, descriptions, canonical paths, Open Graph fields, and noindex rules for private/auth/download utility pages. *Resolved 2026-08-29.*
- [x] **Full legacy redirect map added.** Added 93 path-based redirects in `next.config.ts` covering the captured WordPress/WooCommerce URL inventory: route aliases, old A/B segment codes, towns, product/category URLs, old protected download IDs, old news slugs, auth/account paths, PDFs, and placeholder utility pages. Verified against `.firecrawl/azat-live-urls.json` with no uncovered old paths needing a decision; production build passes. *Resolved 2026-08-29.*
- [x] **Shop placeholder and navigation added.** `/shop` now intentionally ships as a simple "Shop coming soon" placeholder, and the shared header/footer include Shop links. Old WooCommerce product/category URLs redirect to `/shop` until commerce scope is revisited. *Resolved 2026-08-29.*
- [x] **Trail segment pages built — all 28, real content.** Commits `541bec2` (trail hub + Rye Creek, 2026-08-22) and `00069a8` (remaining 27 segments + Sanity media, 2026-08-23). Replaces the old A Route/B Route summary cards with a real trail hub (`/trail` — Mapbox 3D terrain synced to a searchable/filterable segment list with difficulty and mileage) plus 28 individual segment pages (`/trail/[slug]`, real named slugs like `rye-creek`, `tonto-basin`, `cherry-creek` — not the old A01–B17 numbering), each with real photos, facts, amenities, safety content, and a protected GPX download. Photos and segment docs are hosted in Sanity so they're editable from Studio. Verified live on production 2026-08-24.
- [x] **Protected downloads seeded and uploaded.** Generated 28 individual segment GPX files from the full trail GPX, added reusable `downloads:segments` and `downloads:upload` scripts, uploaded the three full-route files plus all 28 segment files to the private Supabase `protected-downloads` bucket, and verified all 31 `download_files` rows are queryable by both service role and the public active-metadata policy. *Resolved 2026-08-29.*
- [x] **FAQ page — full ~80-question migration.** Commit `98c10cc` (2026-08-18) + `930ad6c` (nav links). Replaced the 3-question placeholder with the real FAQ pulled from the live site: unified search, sticky category rail (11 sections), a persistent emergency-procedure callout, and a global legal disclaimer. Verified live on production 2026-08-24.
- [x] **Three UI bugs fixed.** Commit `3139d78` (2026-08-23): removed dead town markers/CSS from the 3D Mapbox view and homepage Leaflet map; fixed the segment photo gallery yanking the whole page to the top on auto-advance (was calling `scrollIntoView()`, which walks every scrollable ancestor — now scrolls the gallery's own strip via `scrollTo()`); fixed the invisible white-on-white "Take the route file with you" button on Rusty's Route (a Tailwind class-order/cascade bug in `DownloadButton`'s color prop).
- [x] **Untracked docs committed.** `git status` is clean as of 2026-08-24 — the docs flagged as untracked on 2026-08-18 are now in the repo.

---

### Format for new entries

```md
- [ ] **Short title** — What's wrong/missing, where (route or file), and any relevant context. *Found YYYY-MM-DD.*
```

When resolved, move to Recently Resolved as:

```md
- [x] **Short title** — one-line note on the fix. *Resolved YYYY-MM-DD.*
```
