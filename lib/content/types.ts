/**
 * The four ways a claim can reach the page. The mark is drawn next to every
 * number and every quotation, so a reader can tell a verbatim minute from a
 * document nobody outside the chamber has seen.
 */
export type Mark = "council" | "document" | "press" | "calc";

export type Source = {
  mark: Mark;
  /** Short, uppercase in the UI. e.g. "ΔΣ 15/07 · 49′28″" */
  label: string;
  href?: string;
  /** For `calc`, the inputs the number was derived from. e.g. "8/5 → 15/7" */
  inputs?: string;
};

export type Tone = "solid" | "tint" | "muted" | "empty";

export type KeyFigure = {
  value: string;
  /** Rendered smaller, next to the value. e.g. "mm", "ημέρες", "→ 20+" */
  unit?: string;
  label: string;
  sources: Source[];
};

/** A whole divided into named parts, one cell per unit. */
export type UnitChart = {
  type: "unitChart";
  title: string;
  caption: string;
  footnote: string;
  total: number;
  headline: string;
  headlineUnit: string;
  columns: number;
  groups: { count: number; label: string; tone: Tone }[];
};

/** Values on a linear axis from zero, where the spacing is the point. */
export type ValueScale = {
  type: "valueScale";
  title: string;
  caption: string;
  footnote: string;
  max: number;
  points: {
    value: number;
    display: string;
    label: string;
    side: "up" | "down";
    align?: "start" | "center" | "end";
    /** Raises the label above the default row to clear a neighbour. */
    lift?: boolean;
  }[];
};

/** One cell per year, for stories measured in decades. */
export type YearGrid = {
  type: "yearGrid";
  title: string;
  caption: string;
  footnote: string;
  from: number;
  to: number;
  marks: { year: number; tone: "solid" | "tint" }[];
  axis: number[];
  notes: { year: string; text: string }[];
};

export type Figure = UnitChart | ValueScale | YearGrid;

export type TimelineEntry =
  | { kind: "gap"; text: string }
  | {
      kind: Mark;
      date: string;
      meta: string;
      title: string;
      text: string;
      source: Source;
      tag?: { text: string; tone: "green" | "yellow" | "red" };
    };

export type Block =
  | { type: "lead"; text: string; sources?: Source[] }
  | { type: "para"; text: string; sources?: Source[] }
  | { type: "section"; numeral: string; period: string; title: string }
  | { type: "quote"; text: string; sources: Source[] }
  | {
      type: "versus";
      sides: { title: string; paras: string[]; source: Source }[];
    }
  | { type: "keyFigures"; items: KeyFigure[] }
  | { type: "figure"; figure: Figure }
  | { type: "timeline"; numeral: string; title: string; entries: TimelineEntry[] };

export type Story = {
  slug: string;
  /** Display title, sentence case. */
  title: string;
  /** Title for tabs and lists, where the sentence-case one reads oddly. */
  shortTitle: string;
  kicker: string[];
  dek: string;
  /** Hex. Each story carries the colour of its own subject. */
  accent: string;
  accentDark: string;
  status: "open" | "corrected" | "closed";
  updated: string;
  place: string;
  headMeta: { label: string; value: string }[];
  blocks: Block[];
  sources: { heading: string; items: { text: string; href?: string }[] }[];
  method: string[];
};
