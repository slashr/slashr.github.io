# Akash Nair / slashr

A project-first portfolio built with Next.js and React, exported as static files
for [slashr.github.io](https://slashr.github.io). The homepage is an interactive
Workbench for Power Hour, iNAB, and the homelab. The earlier writing lives at `/blog/`.

## Development

Use Node 24 (`.nvmrc`), then:

```sh
npm ci
npm run dev
```

The default homepage uses real app captures. Screenshot provenance and the
fictional iNAB capture dataset are described in [docs/screenshots.md](docs/screenshots.md).
The optional workout/budget sketches and deployment simulation run entirely in
the browser. They do not connect to the private apps or cluster.

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
