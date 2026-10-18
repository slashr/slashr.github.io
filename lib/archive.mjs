import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { parse as parseYaml } from "yaml";
import MarkdownIt from "markdown-it";
import { load } from "cheerio";

export const siteUrl = "https://slashr.github.io";
const markdown = new MarkdownIt({ html: true, linkify: true });
export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
export function legacyUrl(filename, permalink) {
  if (permalink) {
    // Jekyll treated this one absolute permalink as a local path. Keep that
    // published URL, including its colon, so existing links still resolve.
    if (/^https?:\/\//.test(permalink))
      return "/" + permalink.replace("://", ":/");
    return permalink;
  }
  const [, year, month, day, slug] =
    filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/) ?? [];
  if (!slug) throw new Error(`Unrecognized archive filename: ${filename}`);
  return `/${year}/${month}/${day}/${slug}.html`;
}
export function readPosts() {
  return readdirSync(resolve("_posts"))
    .filter((file) => file.endsWith(".md"))
    .map((filename) => {
      const source = readFileSync(resolve("_posts", filename), "utf8");
      const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!front) throw new Error(`Missing archive front matter: ${filename}`);
      const data = parseYaml(front[1]);
      const content = source.slice(front[0].length);
      const rendered = markdown.render(content);
      const $ = load(rendered);
      const heading = $("h1,h2,h3").first();
      const title = String(
        data.title ||
          heading.text() ||
          filename.slice(11, -3).replaceAll("-", " "),
      ).trim();
      const date = data.date
        ? new Date(data.date).toISOString()
        : filename.slice(0, 10) + "T00:00:00.000Z";
      const firstLink = heading.find("a").attr("href");
      const externalUrl =
        !data.title && firstLink?.startsWith("https://figments.medium.com/")
          ? firstLink
          : null;
      return {
        filename,
        title,
        date,
        year: date.slice(0, 4),
        url: legacyUrl(filename, data.permalink),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        excerpt: $("p")
          .first()
          .text()
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 175),
        content,
        externalUrl,
        sourceHash: createHash("sha256").update(source).digest("hex"),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
export function normalizeAsset(value) {
  if (!value) return value;
  const local = value.match(
    /(?:^|\.\.\/|https?:\/\/[^/]+\/)(?:assets\/images\/)(.+)$/,
  );
  if (local && existsSync(resolve("assets/images", local[1])))
    return "/assets/images/" + local[1];
  const upload = value.match(/\/wp-content\/uploads\/(.+)$/);
  if (upload && existsSync(resolve("assets/images", upload[1])))
    return "/assets/images/" + upload[1];
  if (value.startsWith("../assets/")) return value.slice(2);
  return value;
}
export function renderPost(post) {
  const $ = load(markdown.render(post.content), null, false);
  $("img").each((_, image) => {
    const el = $(image);
    el.attr("src", normalizeAsset(el.attr("src")));
    if (el.attr("srcset"))
      el.attr(
        "srcset",
        el
          .attr("srcset")
          .split(",")
          .map((item) => {
            const [url, size] = item.trim().split(/\s+/);
            return [normalizeAsset(url), size].filter(Boolean).join(" ");
          })
          .join(", "),
      );
    el.attr("loading", "lazy").attr("decoding", "async");
  });
  $("a[href]").each((_, anchor) => {
    const el = $(anchor);
    const href = el.attr("href");
    el.attr("href", normalizeAsset(href));
    if (el.attr("target") === "_blank") el.attr("rel", "noopener noreferrer");
  });
  $("script").each((_, script) => {
    const src = $(script).attr("src");
    if (src?.startsWith("https://gist.github.com/")) {
      const link = $("<p><a>View the original code on GitHub</a></p>");
      link.find("a").attr("href", src.replace(/\.js$/, ""));
      $(script).replaceWith(link);
    } else $(script).remove();
  });
  return $.html();
}
