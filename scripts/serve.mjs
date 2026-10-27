import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve("out");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url || "/", "http://localhost").pathname,
    );
    let file = resolve(root, "." + path);
    if (!file.startsWith(root + "/") && file !== root) {
      response.writeHead(403);
      response.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    } catch {
      if (!extname(file)) file += ".html";
    }
    const content = await readFile(file);
    response.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    try {
      response.end(await readFile(resolve(root, "404.html")));
    } catch {
      response.end("Not found");
    }
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Portfolio preview: http://127.0.0.1:${port}`),
);
