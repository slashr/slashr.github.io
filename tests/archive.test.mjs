import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readPosts, renderPost, normalizeAsset } from "../lib/archive.mjs";
const originals = JSON.parse(
  readFileSync(new URL("./legacy-posts.json", import.meta.url), "utf8"),
);
test("all 25 posts retain their original source bytes and live published URLs", () => {
  const posts = readPosts();
  assert.equal(posts.length, originals.length);
  for (const expected of originals) {
    const post = posts.find((post) => post.filename === expected.filename);
    assert.ok(post, expected.filename);
    assert.equal(post.url, expected.url);
    assert.equal(post.sourceHash, expected.sourceHash);
    assert.ok(post.title.trim());
    assert.match(post.date, /^\d{4}-\d{2}-\d{2}T/);
  }
});
test("blank titles are recovered from the original linked heading", () => {
  const post = readPosts().find((post) => post.filename.startsWith("2022-04"));
  assert.equal(post.title, "ArgoCD: The first step towards GitOps");
  assert.equal(
    post.externalUrl,
    "https://figments.medium.com/argocd-the-first-step-towards-gitops-899732fbc33e",
  );
});
test("a no-permalink post keeps its dated .html URL and nested image resolves at root", () => {
  const post = readPosts()[0];
  assert.equal(post.url, "/2022/08/13/making-terraform-less-terrafying.html");
  assert.match(
    renderPost(post),
    /src="\/assets\/images\/terrafying-terraform.png"/,
  );
});
test("old WordPress image references use the preserved local copies", () => {
  assert.equal(
    normalizeAsset(
      "http://skywide.in/wp-content/uploads/2015/07/Blank-Flowchart-New-Page3-1024x972.png",
    ),
    "/assets/images/2015/07/Blank-Flowchart-New-Page3-1024x972.png",
  );
  const html = renderPost(
    readPosts().find(
      (p) => p.url === "/aws-designing-a-3-tier-web-application/",
    ),
  );
  assert.doesNotMatch(html, /src="http:\/\/skywide/);
  assert.match(html, /srcset="\/assets\/images/);
});
test("the historical malformed Medium path is preserved, with an ordinary external source link", () => {
  const post = readPosts().find((post) => post.filename.startsWith("2021-07"));
  assert.equal(
    post.url,
    originals.find((p) => p.filename === post.filename).url,
  );
  assert.match(renderPost(post), /href="https:\/\/figments.medium.com\//);
});
test("the archive keeps a direct link to embedded gist code without document.write scripts", () => {
  const post = readPosts().find(
    (post) => post.url === "/iam-restrict-ec2-access-specific-region/",
  );
  const html = renderPost(post);
  assert.doesNotMatch(html, /<script/);
  assert.match(
    html,
    /href="https:\/\/gist.github.com\/slashr\/f17eb97ac86e94160ce03cc920373143"/,
  );
});
