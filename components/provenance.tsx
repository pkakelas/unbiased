import type { Mark, Source } from "@/lib/content/types";

const markClass: Record<Mark, string> = {
  council: "mk mk-council",
  press: "mk mk-press",
  document: "mk mk-document",
  calc: "mk mk-calc",
};

/** Screen-reader wording for each mark, so the dot is not the only signal. */
const markName: Record<Mark, string> = {
  council: "Πρακτικό συμβουλίου",
  press: "Δημοσίευμα ή δήλωση",
  document: "Έγγραφο όπως αναγνώστηκε στο σώμα",
  calc: "Υπολογισμός της σύνταξης",
};

export function SourceLine({ source }: { source: Source }) {
  const text = source.inputs
    ? `${source.label} · ${source.inputs}`
    : source.label;

  const inner = (
    <>
      <span className={markClass[source.mark]} aria-hidden="true" />
      <span>
        <span className="sr-only">{markName[source.mark]}: </span>
        {text}
      </span>
    </>
  );

  if (source.href) {
    return (
      <a
        className="src"
        href={source.href}
        target="_blank"
        rel="noreferrer noopener"
      >
        {inner}
      </a>
    );
  }
  return <span className="src">{inner}</span>;
}

export function SourceList({ sources }: { sources?: Source[] }) {
  if (!sources?.length) return null;
  return (
    <div className="notes">
      {sources.map((s, i) => (
        <SourceLine key={i} source={s} />
      ))}
    </div>
  );
}
