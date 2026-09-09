import { stories } from "../lib/content";
import { unresolvedLinks } from "../lib/content/links";
for (const s of stories) {
  let linked = 0, total = 0;
  for (const b of s.blocks) {
    const walk = (x: { mark: string; href?: string }) => { if (x.mark === "council" || x.mark === "press") { total++; if (x.href) linked++; } };
    if ((b.type === "lead" || b.type === "para") && b.sources) b.sources.forEach(walk);
    if (b.type === "quote") b.sources.forEach(walk);
    if (b.type === "keyFigures") b.items.forEach((i) => i.sources.forEach(walk));
    if (b.type === "versus") b.sides.forEach((x) => walk(x.source));
    if (b.type === "timeline") b.entries.forEach((e) => e.kind !== "gap" && e.sources.forEach(walk));
  }
  console.log(`${s.slug}: ${linked}/${total} council + press citations linked`);
  for (const u of unresolvedLinks(s)) console.log("   unresolved:", u);
}
