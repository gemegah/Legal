import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readProjectFile(relativePath) {
  return readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("package.json pins the Cloudflare adapter to a Next 14 compatible release", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));

  assert.equal(packageJson.dependencies["@opennextjs/cloudflare"], "1.15.1");
  assert.match(packageJson.scripts.preview, /opennextjs-cloudflare build/);
  assert.match(packageJson.scripts.deploy, /opennextjs-cloudflare deploy/);
  assert.equal(packageJson.scripts.test, "node --test test/*.test.mjs");
});

test("wrangler.jsonc targets the OpenNext worker output", () => {
  const wranglerConfig = JSON.parse(readProjectFile("wrangler.jsonc"));

  assert.equal(wranglerConfig.main, ".open-next/worker.js");
  assert.equal(wranglerConfig.assets.directory, ".open-next/assets");
  assert.equal(wranglerConfig.assets.binding, "ASSETS");
  assert.deepEqual(wranglerConfig.compatibility_flags, ["nodejs_compat"]);
});

test("next.config.mjs initializes the Cloudflare dev adapter", () => {
  const nextConfig = readProjectFile("next.config.mjs");

  assert.match(nextConfig, /initOpenNextCloudflareForDev/);
});

test("dynamic app routes were not rewritten to edge runtime", () => {
  const appRoutes = [
    "src/app/(app)/billing/page.tsx",
    "src/app/(app)/billing/[id]/page.tsx",
    "src/app/(app)/calendar/page.tsx",
    "src/app/(app)/cases/page.tsx",
    "src/app/(app)/cases/[id]/layout.tsx",
    "src/app/(app)/cases/[id]/page.tsx",
    "src/app/(app)/cases/[id]/audit/page.tsx",
    "src/app/(app)/cases/[id]/billing/page.tsx",
    "src/app/(app)/cases/[id]/calendar/page.tsx",
    "src/app/(app)/cases/[id]/documents/page.tsx",
    "src/app/(app)/cases/[id]/notes/page.tsx",
    "src/app/(app)/cases/[id]/tasks/page.tsx",
    "src/app/(app)/tasks/page.tsx",
    "src/app/portal/invoices/[id]/page.tsx",
    "src/app/portal/cases/[id]/page.tsx",
  ];

  for (const route of appRoutes) {
    const fileContents = readProjectFile(route);
    assert.doesNotMatch(fileContents, /export const runtime = ["']edge["']/);
  }
});
