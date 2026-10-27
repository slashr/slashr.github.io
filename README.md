# Akash Nair / slashr

A personal site built with Next.js and React, exported as static files
for [slashr.github.io](https://slashr.github.io). About, Projects, and Blog are
separate pages in a shared tab navigation. The homepage has an animated desk scene;
`/projects/` holds the interactive Workbench for Power Hour, iNAB, and the homelab. The earlier writing lives at `/blog/`.

## Development

Use Node 24 (`.nvmrc`), then:

```sh
npm ci
npm run dev
```

The Projects page uses real app captures. Screenshot provenance and the
fictional iNAB capture dataset are described in [docs/screenshots.md](docs/screenshots.md).
The homelab diagram shows the configured k3s cluster, its home/cloud node pools,
GitOps delivery and platform services. It does not connect to the private cluster.
Architecture sources are recorded in [docs/screenshots.md](docs/screenshots.md).

The desk scene is local SVG artwork. The tabby stays seated in a fixed spot
beside the laptop. Her head visibly turns, tilts, and looks up or down toward
the cursor, with smooth eye tracking and independent ear movement. Looking up
tips her whole head back around the neck and raises her chin. Her body
and paws stay still; she never walks, jumps, or flips. Animation respects
reduced motion and stored motion preferences. The controller stops when hidden
or offscreen and removes its listeners when leaving About.

## Checks and static preview

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Install Chromium once with `npx playwright install chromium` before the browser
checks. `npm run build` also exports and verifies the blog archive. To inspect
the actual static output, run `npm run preview` and open `http://127.0.0.1:4173`.

## GitHub Pages

Before merging this migration, change the repository's **Settings → Pages →
Build and deployment → Source** to **GitHub Actions**. It currently uses the
legacy Jekyll branch builder. This is a one-time publishing setup change;
opening this PR does not change the live site or its settings.

The Portfolio workflow checks pull requests. After a merge into `master`, it
builds the site, runs the browser checks, and deploys `out/` to GitHub Pages.
There is no runtime Node server, API, database, or secret required by the site.

## Preserving the blog

- The 25 Markdown originals in `_posts/` remain unchanged.
- `lib/archive.mjs` renders them only at build time. The original dates,
  per-post permalinks, dated `.html` URL, and even the historical malformed
  Medium path remain available.
- `tests/legacy-posts.json` pins the source hashes and URLs against the existing
  live site's sitemap. Source edits require deliberately updating that baseline.
- `assets/images/` stays in its original source location and is copied into the
  export. Historical WordPress and relative image paths resolve to these local
  copies where available. External historical links remain external.
- Old pagination, tag, search, and placeholder category links forward to the
  archive. `/feed.xml`, `/sitemap.xml`, the favicons, and Google verification file
  remain available. The old gist embed is retained as an ordinary code link.
- The archive is pre-rendered HTML, readable without JavaScript; Next.js serves
  the portfolio and searchable archive index. All local output links and archived
  images are checked during the build.
