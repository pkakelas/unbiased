# unbiased

Ιστορίες χτισμένες πάνω στα πρακτικά των δημοτικών συμβουλίων, μέσω του
OpenCouncil. Κάθε ισχυρισμός φέρει το σήμα της προέλευσής του.

## Development

```bash
npm run dev     # http://localhost:3100
npm run build
npm run lint
```

## What the site promises

The promise is not impartiality, which cannot be demonstrated. It is
traceability, which can. Every number and every quotation carries one of four
provenance marks, and the marks differ in shape as well as colour, so they
survive a greyscale print:

| Mark | Meaning | Rule |
| --- | --- | --- |
| `council` | Said in a sitting | Links to the exact second of video. Only this mark may sit beside a quotation attributed to a named person. |
| `document` | A document a speaker read into the record | The hollow ring says the source is the reading, not the document. Nobody outside the chamber has seen it. |
| `press` | A report or a statement outside the chamber | Always names the outlet and the date. |
| `calc` | A number the newsroom derived | Always shows its inputs in `Source.inputs`. No derived number ships without them. |

The last rule exists because derived numbers are the failure mode. An early
draft of the first story labelled a three-sitting total as a six-sitting total
and was wrong by nineteen minutes.

## Adding a story

1. Write `lib/content/stories/<slug>.ts`, exporting one object typed `Story`
   from `lib/content/types.ts`.
2. Register it in `lib/content/index.ts`. The array order is the index order.
3. Give the story its own `accent` and `accentDark`. Each story carries the
   colour of its own subject: the metro line, the market, the park.

Run `npx tsc --noEmit` — the block union catches a malformed story at compile
time.

## The content model

A story is a header plus an ordered list of blocks. The blocks are
`lead`, `para`, `section`, `quote`, `versus`, `keyFigures`, `figure`,
`timeline` and `questions`.

`figure` holds the one slot whose shape changes per story. Three exist:

- `unitChart` — a whole divided into named parts, one cell per unit.
- `valueScale` — values on a linear axis from zero, where the spacing is the
  point. Label anchoring and row lifting are derived at render time, so a new
  set of points cannot collide or overflow.
- `yearGrid` — one cell per year, for stories measured in decades.

## Layout

The article grid is a 200px metadata rail, a 620px prose column, and the
remainder. Provenance lives in the rail beside the sentence it belongs to,
rather than in footnotes. Below 1080px the rail folds above the prose.

## Typography

`Relative Book Pro` is the house face and is named first in `--sans`. It is a
licensed face and is not bundled. `Commissioner` is the loaded fallback: a
low-contrast grotesque with a full Greek character set, which most Google
faces lack.
