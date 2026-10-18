import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  readPosts,
  renderPost,
  escapeHtml as e,
  siteUrl,
} from "../lib/archive.mjs";
const out = resolve("out");
function write(url, content) {
  const file = resolve(
    out,
    "." + url + (url.endsWith("/") ? "index.html" : ""),
  );
  if (!file.startsWith(out + "/"))
    throw new Error("Archive path escapes output");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}
const posts = readPosts();
for (const post of posts) {
  const date = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(post.date));
  write(
    post.url,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(post.title)} · Akash Nair</title><meta name="description" content="${e(post.excerpt || post.title)}"><link rel="canonical" href="${e(siteUrl + post.url)}"><link rel="stylesheet" href="/archive.css"><link rel="icon" href="/favicon.ico"><link rel="alternate" type="application/rss+xml" title="Akash Nair — archive" href="/feed.xml"></head><body><a class="skip" href="#article">Skip to article</a><div class="archive-wrap"><header class="archive-nav"><a href="/">slashr <span>/ Akash Nair</span></a><nav aria-label="Main navigation"><a href="/">Projects</a><a href="/blog/">Blog archive</a></nav></header><main id="article"><a class="back" href="/blog/">← All archived posts</a><header class="article-header"><p class="eyebrow">Blog archive · <time datetime="${e(post.date)}">${e(date)}</time></p><h1>${e(post.title)}</h1>${post.externalUrl ? `<p class="external-note">This entry links to an article on Medium. <a href="${e(post.externalUrl)}">Read the original ↗</a></p>` : ""}</header><article class="article-body">${renderPost(post)}</article><footer class="article-footer"><a href="/blog/">← Back to the archive</a><a href="/">Personal projects →</a></footer></main><footer class="archive-footer">Akash Nair · Written in ${e(post.year)}</footer></div></body></html>`,
  );
}
cpSync(resolve("assets/images"), resolve(out, "assets/images"), {
  recursive: true,
});
for (const file of [
  "favicon.ico",
  "favicon.png",
  "google6659c0409b2514b2.html",
])
  cpSync(resolve(file), resolve(out, file));
writeFileSync(resolve(out, ".nojekyll"), "");
const aliases = [
  "/about.html",
  "/search.html",
  "/tags.html",
  "/category/markup.html",
  "/category/edge-case.html",
  "/page2/",
  "/page3/",
  "/page4/",
  "/page5/",
];
for (const url of aliases) {
  const target = url === "/about.html" ? "/" : "/blog/";
  write(
    url,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${siteUrl + target}"><title>Akash Nair</title></head><body><p><a href="${target}">Continue to ${target === "/" ? "the portfolio" : "the blog archive"}</a></p></body></html>`,
  );
}
write(
  "/feed.xml",
  `<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Akash Nair — blog archive</title><link>${siteUrl}/blog/</link><description>Archived writing from 2015–2022.</description>${posts.map((p) => `<item><title>${e(p.title)}</title><link>${e(siteUrl + p.url)}</link><guid isPermaLink="true">${e(siteUrl + p.url)}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${e(p.excerpt || p.title)}</description></item>`).join("")}</channel></rss>`,
);
write(
  "/sitemap.xml",
  `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", "/blog/", ...posts.map((p) => p.url)].map((url) => `<url><loc>${e(siteUrl + url)}</loc></url>`).join("")}</urlset>`,
);
write(
  "/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
console.log(
  `Preserved ${posts.length} original posts and their published URLs, images, feed, and legacy index links.`,
);
