# Segment page template

Publishing a segment page needs **no code changes** — one folder holds everything.

## 1. Find the slug

[`content/trail-segment-index.json`](../../../content/trail-segment-index.json) lists all 28
unique segments with their official loop number(s), name, slug, mileage, elevation facts, and
difficulty from the master segment spreadsheet. Pick the one you're building — say `tonto-basin`.

## 2. Copy the template folder

```
cp -r public/azat/segments/_template public/azat/segments/tonto-basin
```

That gives you:

```
public/azat/segments/tonto-basin/
  content.json
  photos/
    hero.jpg          ← add this
    map.jpg            ← add this (optional)
    gallery/
      01-whatever.jpg  ← add these (any count)
      02-whatever.jpg
```

## 3. Drop in photos

Inside `photos/`:

| File | Required? | Notes |
|---|---|---|
| `hero.jpg` (or `.png` / `.webp`) | Recommended | Top-of-page photo. |
| `map.jpg` / `map.png` | Optional | Official route-map graphic; replaces the interactive map when present. There's no guessing which photo this is — it's the one file literally named `map.*`, never mixed in with the gallery. |
| `gallery/01-whatever.jpg`, `gallery/02-whatever.jpg`, … | Optional, any count | Sorted by filename — the leading number controls order. The rest of the name becomes the default caption ("whatever" → "Whatever"). |

Nothing to register or list — the page scans the folder.

## 4. Fill in content.json

Every field is optional except what you actually want to show. A full reference example is
[`rye-creek/content.json`](rye-creek/content.json).

Fields not in the starter template (add only if you need them):

- `heroAlt`, `mapAlt` — override the auto-generated alt text for `photos/hero.*` / `photos/map.*`.
- `galleryAlt` — `{ "01-whatever.jpg": "Better alt text" }`, keyed by filename inside
  `photos/gallery/`, overrides the humanized default for specific photos.
- `downloadNotes` — custom text for the download card. Default note explains the segment-specific
  GPX falls back to the full-trail file until it's uploaded.
- `downloads` — full override if a segment needs more than the default single-GPX download
  (e.g. KML/SHP too); shape matches `TrailSegmentDownload` in `src/lib/trail-segments.ts`.

`amenities` entries must be one of: `Food`, `Fuel`, `Lodging`, `Medical`, `Potable Water`,
`Restroom`, `Parking/Staging`, `Repair`.

Do not add or change mileage, elevation, or difficulty here. Those facts come from
`content/trail-segment-index.json` so the hub, maps, downloads, detail pages, and Sanity fallback
cannot drift apart.

**`content.json` is the on/off switch.** The moment it exists, `/trail/<slug>` goes live and the
segment shows up on the trail hub — no restart needed. Delete it and the page disappears again.

## Pushing into Sanity (optional)

`npm run sanity:seed` reads every segment folder the same way the app does and upserts a matching
`trailSegment` document in Sanity. Sanity can provide editorial copy and media, while the master
spreadsheet facts in `content/trail-segment-index.json` remain authoritative for number, mileage,
elevation, and difficulty. The folder stays as the permanent fallback if Sanity is unreachable.
