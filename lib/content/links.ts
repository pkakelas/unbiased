import type { Block, Source, Story } from "./types";
import { outletOf } from "./outlets";

const MONTHS: Record<string, string> = {
  Ιαν: "01", Φεβ: "02", Μαρ: "03", Απρ: "04", Μαΐ: "05", Μαι: "05", Ιουν: "06",
  Ιουλ: "07", Αυγ: "08", Σεπ: "09", Οκτ: "10", Νοε: "11", Δεκ: "12",
};

/** "15/07" from "ΔΣ 15/07 · 49′28″", or from a timeline date like "15 Ιουλ" / "15–16 Ιουλ". */
function dateIn(text: string): string | undefined {
  const num = text.match(/\b(\d{1,2})\/(\d{2})\b/);
  if (num) return `${num[1].padStart(2, "0")}/${num[2]}`;
  const gr = text.match(/\b(\d{1,2})(?:[–-]\d{1,2})?\s+(Ιαν|Φεβ|Μαρ|Απρ|Μαΐ|Μαι|Ιουν|Ιουλ|Αυγ|Σεπ|Οκτ|Νοε|Δεκ)/);
  if (gr) return `${gr[1].padStart(2, "0")}/${MONTHS[gr[2]]}`;
  return undefined;
}

function cityIn(text: string): string | undefined {
  if (/Ζωγράφου/.test(text)) return "zografou";
  if (/Αθήνας|Αθηναίων/.test(text)) return "athens";
  return undefined;
}

/** Which body the label names, so "ΔΕ 10/08" never resolves to a "ΔΣ" sitting on the same day. */
function bodyIn(text: string): "ΔΕ" | "ΔΣ" | "Κοινότητα" | "Λογοδοσία" | undefined {
  // \b is ASCII-only in JavaScript, so Greek tokens need an explicit letter boundary.
  if (/(?<!\p{L})ΔΕ(?!\p{L})/u.test(text)) return "ΔΕ";
  if (/Κοινότητα/.test(text)) return "Κοινότητα";
  if (/Λογοδοσία/.test(text)) return "Λογοδοσία";
  if (/(?<!\p{L})ΔΣ(?!\p{L})/u.test(text)) return "ΔΣ";
  return undefined;
}

/** "1ω 12′40″" → 4360, "49′28″" → 2968. */
function secondsIn(text: string): number | undefined {
  const h = text.match(/(\d+)ω\s*(\d+)′(\d+)″/);
  if (h) return +h[1] * 3600 + +h[2] * 60 + +h[3];
  const m = text.match(/(\d+)′(\d+)″/);
  if (m) return +m[1] * 60 + +m[2];
  return undefined;
}

function sittingUrl(story: Story, label: string, hint: string): string | undefined {
  const text = `${label} ${hint}`;
  const date = dateIn(label) ?? dateIn(hint);
  if (!date) return undefined;
  const city = cityIn(text);
  const body = bodyIn(label) ?? bodyIn(hint);
  // A story spanning two municipalities keeps one "Πρακτικά" column per city.
  const council = story.sources.filter((c) => c.heading.startsWith("Πρακτικά")).flatMap((c) => c.items);
  const hits = council.filter((it) => {
    if (!it.href || !it.text.includes(date)) return false;
    if (city && !it.href.includes(`/${city}/`)) return false;
    if (body && bodyIn(it.text) && bodyIn(it.text) !== body) return false;
    return true;
  });
  return hits.length === 1 ? hits[0].href : hits[0]?.href;
}

/** A moment inside the sitting when the label carries a timestamp, else the subject page. */
export function councilHref(story: Story, source: Source, hint = ""): string | undefined {
  if (source.mark !== "council" || source.href) return source.href;
  const url = sittingUrl(story, source.label, hint);
  if (!url) return undefined;
  const t = secondsIn(source.label);
  if (t === undefined) return url;
  const meeting = url.replace(/\/subjects\/.*$/, "");
  return `${meeting}/transcript?t=${t}`;
}

function pressHref(story: Story, label: string): string | undefined {
  const outlet = outletOf(label);
  if (!outlet) return undefined;
  const date = label.match(/\b(\d{1,2}\/\d{2})\b/)?.[1];
  const press = story.sources.find((c) => c.heading === "Δημοσιεύματα")?.items ?? [];
  const hits = press.filter((it) => it.href && outletOf(it.text)?.domain === outlet.domain);
  const exact = date ? hits.find((it) => it.text.includes(date)) : undefined;
  return (exact ?? (hits.length === 1 ? hits[0] : undefined))?.href;
}

function link(story: Story, s: Source, hint = ""): Source {
  if (s.href) return s;
  const href = s.mark === "press" ? pressHref(story, s.label) : councilHref(story, s, hint);
  return href ? { ...s, href } : s;
}

/** "Πρώτο Θέμα 15/07 · Έθνος 16/07" becomes two citations when both parts name an outlet. */
function expand(story: Story, s: Source, hint = ""): Source[] {
  if (s.mark === "press" && s.label.includes(" · ")) {
    const parts = s.label.split(" · ").map((p) => p.trim());
    if (parts.length > 1 && parts.every((p) => outletOf(p))) {
      return parts.map((label) => link(story, { mark: "press", label }));
    }
  }
  return [link(story, s, hint)];
}

/** Returns the story with every council citation linked to its sitting and every press citation to its article. */
export function withLinks(story: Story): Story {
  return withCouncilLinks(story);
}

function withCouncilLinks(story: Story): Story {
  const blocks: Block[] = story.blocks.map((b) => {
    switch (b.type) {
      case "lead":
      case "para":
        return { ...b, sources: b.sources?.flatMap((s) => expand(story, s)) };
      case "quote":
        return { ...b, sources: b.sources.flatMap((s) => expand(story, s)) };
      case "keyFigures":
        return { ...b, items: b.items.map((it) => ({ ...it, sources: it.sources.flatMap((s) => expand(story, s)) })) };
      case "versus":
        return { ...b, sides: b.sides.map((side) => ({ ...side, source: link(story, side.source, side.title) })) };
      case "timeline":
        return {
          ...b,
          entries: b.entries.map((e) =>
            e.kind === "gap" ? e : { ...e, sources: e.sources.flatMap((s) => expand(story, s, `${e.date} ${e.meta}`)) },
          ),
        };
      default:
        return b;
    }
  });
  return { ...story, blocks };
}

/** Citations that could not be resolved; used by the check script, never rendered. */
export function unresolvedLinks(story: Story): string[] {
  const out: string[] = [];
  for (const b of withLinks(story).blocks) {
    const scan = (s: Source) => { if ((s.mark === "council" || s.mark === "press") && !s.href) out.push(`${s.mark}: ${s.label}`); };
    if ((b.type === "lead" || b.type === "para") && b.sources) b.sources.forEach(scan);
    if (b.type === "quote") b.sources.forEach(scan);
    if (b.type === "keyFigures") b.items.forEach((it) => it.sources.forEach(scan));
    if (b.type === "versus") b.sides.forEach((s) => scan(s.source));
    if (b.type === "timeline") b.entries.forEach((e) => e.kind !== "gap" && e.sources.forEach(scan));
  }
  return out;
}
