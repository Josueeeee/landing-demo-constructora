import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses the Vercel-compatible Nitro build", async () => {
  const [packageJson, viteConfig, vercelConfig] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);

  const pkg = JSON.parse(packageJson);
  const vercel = JSON.parse(vercelConfig);
  assert.equal(pkg.name, "nexo-constructora");
  assert.equal(pkg.engines.node, "22.x");
  assert.equal(pkg.scripts.build, "vite build");
  assert.match(viteConfig, /nitro\(\)/);
  assert.match(viteConfig, /tailwindcss\(\)/);
  assert.equal(vercel.framework, "nitro");
});

test("keeps the construction brand identity in page metadata", async () => {
  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );
  assert.match(layout, /Nexo Constructora/);
  assert.match(layout, /es_HN/);
});
