import type { Figure, UnitChart, ValueScale, YearGrid } from "@/lib/content/types";

function FigureFrame({
  title,
  caption,
  footnote,
  children,
}: {
  title: string;
  caption: string;
  footnote: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="fg">
      <div className="fg-head">
        <h3>{title}</h3>
      </div>
      <figcaption className="fg-cap">{caption}</figcaption>
      <div className="fg-body">{children}</div>
      <div className="fg-foot">{footnote}</div>
    </figure>
  );
}

function UnitChartView({ f }: { f: UnitChart }) {
  const cells: { tone: string }[] = [];
  for (const g of f.groups) {
    for (let i = 0; i < g.count; i++) cells.push({ tone: g.tone });
  }
  return (
    <FigureFrame title={f.title} caption={f.caption} footnote={f.footnote}>
      <div className="unit">
        <div
          className="cells"
          style={{ gridTemplateColumns: `repeat(${f.columns}, minmax(0, 1fr))` }}
          role="img"
          aria-label={`${f.headline}${f.headlineUnit}. ${f.groups
            .map((g) => `${g.count} ${g.label}`)
            .join(", ")}.`}
        >
          {cells.map((c, i) => (
            <span key={i} className={`cell c-${c.tone}`} />
          ))}
        </div>
        <div className="key">
          <div className="key-big">
            {f.headline}
            <span>{f.headlineUnit}</span>
          </div>
          {f.groups.map((g, i) => (
            <div className="key-row" key={i}>
              <span className={`sw c-${g.tone}`} />
              <b>{g.count}</b>
              <span>{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
}

function ValueScaleView({ f }: { f: ValueScale }) {
  // Geometry is derived, not authored: a label near either edge is anchored
  // inward so it cannot overflow, and a label whose same-side neighbour is
  // too close is lifted to a second row. Authored values win when present.
  const LABEL_PCT = 20;
  const last: Record<"up" | "down", { x: number; lifted: boolean } | null> = {
    up: null,
    down: null,
  };

  const points = [...f.points]
    .sort((a, b) => a.value - b.value)
    .map((p) => {
      const x = (p.value / f.max) * 100;
      const prev = last[p.side];
      const crowded = prev !== null && x - prev.x < LABEL_PCT;
      const lifted = p.lift ?? (crowded ? !prev!.lifted : false);
      last[p.side] = { x, lifted };
      const align =
        p.align ?? (x < 12 ? "start" : x > 88 ? "end" : "center");
      return { ...p, x, lifted, align };
    });

  return (
    <FigureFrame title={f.title} caption={f.caption} footnote={f.footnote}>
      <div className="scale-scroll">
        <div className="scale">
          <div className="axis" />
          {points.map((p, i) => {
            const left = `${p.x}%`;
            const gap = p.lifted ? 92 : 26;
            return (
              <div key={i}>
                <span className="pt" style={{ left }} />
                <span
                  className="stem"
                  style={
                    p.side === "up"
                      ? { left, top: `calc(50% - ${gap}px)`, height: gap }
                      : { left, top: "50%", height: gap }
                  }
                />
                <span
                  className={`lb a-${p.align}`}
                  style={
                    p.side === "up"
                      ? { left, bottom: `calc(50% + ${gap}px)` }
                      : { left, top: `calc(50% + ${gap}px)` }
                  }
                >
                  <b>{p.display}</b>
                  <i>{p.label}</i>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </FigureFrame>
  );
}

function YearGridView({ f }: { f: YearGrid }) {
  const years: number[] = [];
  for (let y = f.from; y <= f.to; y++) years.push(y);
  const toneOf = (y: number) => f.marks.find((m) => m.year === y)?.tone ?? "";
  const cols = { gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` };

  return (
    <FigureFrame title={f.title} caption={f.caption} footnote={f.footnote}>
      <div className="years">
        <div
          className="yrow"
          style={cols}
          role="img"
          aria-label={`${f.from} έως ${f.to}. Σημειωμένα έτη: ${f.marks
            .map((m) => m.year)
            .join(", ")}.`}
        >
          {years.map((y) => (
            <span key={y} className={`yr ${toneOf(y) ? `y-${toneOf(y)}` : ""}`} />
          ))}
        </div>
        <div className="yaxis" style={cols}>
          {years.map((y) => (
            <span key={y}>{f.axis.includes(y) ? `’${String(y).slice(2)}` : ""}</span>
          ))}
        </div>
        <div className="ynotes">
          {f.notes.map((n, i) => (
            <div key={i}>
              <b>{n.year}</b>
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
}

export function FigureView({ figure }: { figure: Figure }) {
  switch (figure.type) {
    case "unitChart":
      return <UnitChartView f={figure} />;
    case "valueScale":
      return <ValueScaleView f={figure} />;
    case "yearGrid":
      return <YearGridView f={figure} />;
  }
}
