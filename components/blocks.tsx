import type { Block } from "@/lib/content/types";
import { SourceLine, SourceList } from "./provenance";
import { FigureView } from "./figures";
import { tags } from "@/lib/content/tags";

function SectionHead({
  numeral,
  period,
  title,
}: {
  numeral: string;
  period?: string;
  title: string;
}) {
  return (
    <div className="col section">
      <div className="secno">
        <span>{numeral}</span>
        {period ? <span>{period}</span> : null}
      </div>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "keyFigures":
      return (
        <div className="wide">
          <div className="figs">
            {block.items.map((it, i) => (
              <div key={i}>
                <div className="fig-v">
                  {it.value}
                  {it.unit ? <span>{it.unit}</span> : null}
                </div>
                <div className="fig-l">{it.label}</div>
                <SourceList sources={it.sources} />
              </div>
            ))}
          </div>
        </div>
      );

    case "lead":
    case "para":
      return (
        <div className="col block prose">
          <p className={block.type === "lead" ? "lead" : undefined}>
            {block.text}
          </p>
          <SourceList sources={block.sources} />
        </div>
      );

    case "section":
      return (
        <SectionHead
          numeral={block.numeral}
          period={block.period}
          title={block.title}
        />
      );

    case "quote":
      return (
        <blockquote className="col quote">
          <p>«{block.text}»</p>
          <div className="att">
            {block.sources.map((s, i) => (
              <SourceLine key={i} source={s} />
            ))}
          </div>
        </blockquote>
      );

    case "versus":
      return (
        <div className="wide vs">
          {block.sides.map((side, i) => (
            <div key={i}>
              <h4>{side.title}</h4>
              {side.paras.map((t, j) => (
                <p key={j}>{t}</p>
              ))}
              <SourceLine source={side.source} />
            </div>
          ))}
        </div>
      );

    case "figure":
      return (
        <div className="wide block">
          <FigureView figure={block.figure} />
        </div>
      );

    case "timeline":
      return (
        <>
          <SectionHead numeral={block.numeral} title={block.title} />
          <div className="wide tl">
            {block.entries.map((e, i) =>
              e.kind === "gap" ? (
                <div className="tl-row" key={i}>
                  <div />
                  <div className="tl-gap">{e.text}</div>
                </div>
              ) : (
                <div className="tl-row" key={i}>
                  <div className="tl-when">
                    <b>{e.date}</b>
                    <span className="meta">{e.meta}</span>
                  </div>
                  <div className={`tl-item k-${e.kind}`}>
                    <h3>{e.title}</h3>
                    {e.tag ? (
                      <span className={`tag t-${tags[e.tag].tone}`}>{tags[e.tag].label}</span>
                    ) : null}
                    <p>{e.text}</p>
                    <SourceList sources={e.sources} />
                  </div>
                </div>
              ),
            )}
          </div>
        </>
      );

  }
}
