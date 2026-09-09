import Link from "next/link";
import { stories, type Story } from "@/lib/content";
import { Masthead, Footer } from "@/components/chrome";
import { SourceList } from "@/components/provenance";

const statusLabel = {
  open: "Σε εξέλιξη",
  corrected: "Διορθώθηκε",
  closed: "Ολοκληρώθηκε",
} as const;

function leadFigure(story: Story) {
  const block = story.blocks.find((b) => b.type === "keyFigures");
  return block?.type === "keyFigures" ? block.items[0] : undefined;
}

function accentStyle(story: Story) {
  return { "--accent": story.accent } as React.CSSProperties;
}

export default function IndexPage() {
  const [lead, ...rest] = stories;
  const figure = leadFigure(lead);
  const latest = stories
    .map((s) => s.updated)
    .sort((a, b) => b.split("/").reverse().join().localeCompare(a.split("/").reverse().join()))[0];

  return (
    <main className="page">
      <Masthead />

      <section className="intro">
        <p className="intro-text">
          Ιστορίες χτισμένες πάνω στα πρακτικά των δημοτικών συμβουλίων. Κάθε
          αριθμός και κάθε παράθεμα φέρει το σήμα της προέλευσής του.
        </p>
        <span className="meta">
          {stories.length} ιστορίες · τελευταία ενημέρωση {latest}
        </span>
      </section>

      <Link href={`/stories/${lead.slug}`} className="lead-story" style={accentStyle(lead)}>
        <div className="lead-main">
          <div className="kicker">
            {lead.kicker.map((k, i) => (
              <span key={i}>{k}</span>
            ))}
          </div>
          <h2>{lead.title}</h2>
          <p>{lead.dek}</p>
          <span className={`meta status s-${lead.status}`}>
            <span className="dot" />
            {statusLabel[lead.status]} · ενημερώθηκε {lead.updated}
          </span>
        </div>
        {figure ? (
          <div className="lead-figure">
            <div className="fig-v">
              {figure.value}
              {figure.unit ? <span>{figure.unit}</span> : null}
            </div>
            <div className="fig-l">{figure.label}</div>
            <SourceList sources={figure.sources} />
          </div>
        ) : null}
      </Link>

      <ul className="list">
        {rest.map((s) => (
          <li key={s.slug} style={accentStyle(s)}>
            <Link href={`/stories/${s.slug}`}>
              <div className="li-side">
                <span className="li-place">{s.kicker[0]}</span>
                <span className={`meta status s-${s.status}`}>
                  <span className="dot" />
                  {statusLabel[s.status]}
                </span>
              </div>
              <div className="li-main">
                <h3>{s.title}</h3>
                <p>{s.dek}</p>
                <span className="meta">
                  {s.headMeta
                    .slice(0, 2)
                    .map((m) => m.value)
                    .join(" · ")}{" "}
                  · ενημερώθηκε {s.updated}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Footer note="Ιστορίες" />
    </main>
  );
}
