#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Tiny static server: dist/ plus a /live overlay from LIVE_DIR,
 * and a read-only /api proxy to PocketBase (POCKETBASE_UPSTREAM).
 * Default port 7890. No framework.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(root, "dist");
const liveDir = resolve(root, process.env.LIVE_DIR || "./live");
const port = Number(process.env.PORT || 7890);
const host = process.env.HOST || "0.0.0.0";
const pocketBaseUpstream = (
  process.env.POCKETBASE_UPSTREAM || "http://127.0.0.1:5789"
).replace(/\/$/, "");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function under(parent, candidate) {
  const rel = candidate.slice(parent.length);
  return candidate.startsWith(parent + sep) || candidate === parent
    ? !rel.split(sep).includes("..")
    : false;
}

function fileFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  if (decoded.startsWith("/live/") || decoded === "/live") {
    const rest = decoded === "/live" ? "" : decoded.slice("/live/".length);
    const target = resolve(liveDir, rest);
    if (!under(liveDir, target)) return null;
    return target;
  }
  let relative = decoded === "/" ? "index.html" : decoded.slice(1);
  if (relative === "thanks" || relative === "thanks/") {
    relative = "thanks.html";
  }
  const target = resolve(distDir, relative);
  if (!under(distDir, target)) return null;
  return target;
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": status === 200 && type.startsWith("text/html")
      ? "no-cache"
      : "public, max-age=300",
  });
  res.end(body);
}

function isApiPath(urlPath) {
  return urlPath === "/api" || urlPath.startsWith("/api/");
}

function proxyPocketBase(req, res) {
  let target;
  try {
    target = new URL(req.url || "/api", `${pocketBaseUpstream}/`);
  } catch {
    send(res, 502, "Bad Gateway");
    return;
  }

  if (target.origin !== new URL(pocketBaseUpstream).origin) {
    send(res, 400, "Bad Request");
    return;
  }

  const transport = target.protocol === "https:" ? httpsRequest : httpRequest;
  const proxyReq = transport(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === "https:" ? 443 : 80),
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers: {
        accept: req.headers.accept || "*/*",
        "user-agent": "pfc-api-proxy",
      },
    },
    (proxyRes) => {
      const headers = {
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      };
      if (proxyRes.headers["content-type"]) {
        headers["Content-Type"] = proxyRes.headers["content-type"];
      }
      if (proxyRes.headers["content-length"]) {
        headers["Content-Length"] = proxyRes.headers["content-length"];
      }
      res.writeHead(proxyRes.statusCode || 502, headers);
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", () => {
    if (!res.headersSent) send(res, 502, "Bad Gateway");
    else res.end();
  });
  proxyReq.end();
}

const server = createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method Not Allowed");
    return;
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (isApiPath(urlPath)) {
    proxyPocketBase(req, res);
    return;
  }

  let path = fileFor(req.url || "/");
  if (!path) {
    send(res, 400, "Bad Request");
    return;
  }

  if (existsSync(path) && statSync(path).isDirectory()) {
    path = join(path, "index.html");
  }

  if (!existsSync(path) || !statSync(path).isFile()) {
    send(res, 404, "Not Found");
    return;
  }

  const type = MIME[extname(path).toLowerCase()] || "application/octet-stream";
  const stat = statSync(path);
  const isLive = path.startsWith(liveDir + sep);
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": type.startsWith("text/html") || isLive ? "no-cache" : "public, max-age=300",
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(path).pipe(res);
});

server.listen(port, host, () => {
  process.stdout.write(
    `private-fundraising-campaign listening on http://${host}:${port} (dist=${distDir}, live=${liveDir}, pb=${pocketBaseUpstream})\n`,
  );
});
