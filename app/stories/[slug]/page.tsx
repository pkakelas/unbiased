import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStory, stories } from "@/lib/content";
import { BlockView } from "@/components/blocks";
import { Masthead, Footer } from "@/components/chrome";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return { title: story.shortTitle, description: story.dek };
}

const statusLabel = {
  open: "Σε εξέλιξη",
  corrected: "Διορθώθηκε",
  closed: "Ολοκληρώθηκε",
} as const;

export default async function StoryPage({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <main
      className="page"
      style={{ "--accent": story.accent } as React.CSSProperties}
    >
      <Masthead />

      <article>
        <header className="col head">
          <div className="kicker">
            {story.kicker.map((k, i) => (
              <span key={i}>{k}</span>
            ))}
          </div>
          <h1 className="title">{story.title}</h1>
          <p className="dek">{story.dek}</p>
          <div className={`headline-meta s-${story.status}`}>
            <span className="status">
              <span className="dot" />
              {statusLabel[story.status]} · ενημερώθηκε {story.updated}
            </span>
            {story.headMeta
              .filter((m) => m.label !== "Κατάσταση")
              .map((m, i) => (
                <span key={i}>{m.value}</span>
              ))}
          </div>
        </header>

        {story.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}

        <section className="wide srcs">
          <span className="hd">Πηγές</span>
          {story.sources.map((col, i) => (
            <div className="srccol" key={i}>
              <span className="colhd">{col.heading}</span>
              {col.items.map((item, j) =>
                item.href ? (
                  <a key={j} href={item.href} target="_blank" rel="noreferrer noopener">
                    {item.text}
                  </a>
                ) : (
                  <span className="item" key={j}>
                    {item.text}
                  </span>
                ),
              )}
            </div>
          ))}
        </section>

        <div className="wide method">
          {story.method.map((m, i) => (
            <span key={i}>
              {i === 0 ? <b>Μέθοδος. </b> : null}
              {m}
            </span>
          ))}
        </div>
      </article>

      <Footer note={`${story.shortTitle} · ${story.updated}`} />
    </main>
  );
}
