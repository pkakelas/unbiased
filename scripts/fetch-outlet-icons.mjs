// One-off: pulls a 64px favicon per outlet domain into public/outlets/.
// Run `node scripts/fetch-outlet-icons.mjs` after adding a domain to lib/content/outlets.ts.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const source = await readFile(new URL("../lib/content/outlets.ts", import.meta.url), "utf8");
const domains = [...new Set([...source.matchAll(/:\s*"([a-z0-9.-]+\.[a-z]+)"/g)].map((m) => m[1]))];
await mkdir(new URL("../public/outlets/", import.meta.url), { recursive: true });

for (const domain of domains) {
  const res = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
  if (!res.ok) {
    console.error("miss", domain, res.status);
    continue;
  }
  await writeFile(new URL(`../public/outlets/${domain}.png`, import.meta.url), Buffer.from(await res.arrayBuffer()));
  console.log("ok", domain);
}
