import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "cheerio";
import { readPosts } from "../lib/archive.mjs";
const root = resolve("out");
function targetFile(path) {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  const file = resolve(root, "." + clean);
  if (!file.startsWith(root + "/") && file !== root) return null;
  if (existsSync(file) && statSync(file).isFile()) return file;
  if (existsSync(resolve(file, "index.html")))
    return resolve(file, "index.html");
  if (existsSync(file + ".html")) return file + ".html";
  return null;
}
let checked = 0;
for (const post of readPosts()) {
  const file = targetFile(post.url);
  if (!file) throw new Error("Missing original post URL: " + post.url);
  const $ = load(readFileSync(file, "utf8"));
  if ($("h1").text() !== post.title)
    throw new Error("Archive title mismatch: " + post.url);
  if ($("time").first().attr("datetime") !== post.date)
    throw new Error("Archive date mismatch: " + post.url);
  for (const image of $("img[src]").toArray()) {
    const src = $(image).attr("src");
    if (src.startsWith("/") && !targetFile(src))
      throw new Error("Missing archived image: " + src);
  }
  checked++;
}
for (const path of [
  "/",
  "/blog/",
  "/feed.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  "/google6659c0409b2514b2.html",
  "/archive.css",
  "/.nojekyll",
  "/projects/power-hour-workout.webp",
  "/projects/power-hour-muscles.webp",
  "/projects/inab-home.webp",
  "/projects/inab-budget.webp",
]) {
  if (!targetFile(path)) throw new Error("Missing exported asset: " + path);
}
for (const page of ["/", "/blog/"]) {
  const $ = load(readFileSync(targetFile(page), "utf8"));
  for (const el of $("a[href],script[src],link[href],img[src]").toArray()) {
    const value = $(el).attr("href") || $(el).attr("src");
    if (value?.startsWith("/") && !targetFile(value))
      throw new Error(`Broken local link on ${page}: ${value}`);
  }
}
console.log(
  `Export verified: ${checked} archived posts, original dates and local images, portfolio pages, screenshots, and feeds.`,
);
