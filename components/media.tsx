import Image from "next/image";
import type { Story } from "@/lib/content/types";
import { outletOf } from "@/lib/content/outlets";

/** A small square mark for an outlet: its icon when we have one, else its initial. */
export function OutletIcon({ text, size = 20 }: { text: string; size?: number }) {
  const outlet = outletOf(text);
  if (!outlet) return null;
  return (
    <span className="outlet" style={{ width: size, height: size }} title={outlet.name}>
      <Image
        src={`/outlets/${outlet.domain}.png`}
        alt=""
        width={size}
        height={size}
        unoptimized
      />
    </span>
  );
}

/** Up to `max` outlet icons overlapping, for a summary line. */
export function OutletStack({ story, max = 5 }: { story: Story; max?: number }) {
  const press = story.sources.find((c) => c.heading === "Δημοσιεύματα")?.items ?? [];
  const seen = new Set<string>();
  const domains: string[] = [];
  for (const it of press) {
    const o = outletOf(it.text);
    if (o && !seen.has(o.domain)) {
      seen.add(o.domain);
      domains.push(o.domain);
    }
  }
  if (!domains.length) return null;
  return (
    <span className="stack" aria-hidden="true">
      {domains.slice(0, max).map((d) => (
        <span className="outlet" key={d}>
          <Image src={`/outlets/${d}.png`} alt="" width={20} height={20} unoptimized />
        </span>
      ))}
    </span>
  );
}

export function StoryImage({ story, priority = false }: { story: Story; priority?: boolean }) {
  if (!story.image) return null;
  const { src, alt, credit, license, href } = story.image;
  return (
    <figure className="photo">
      <div className="photo-frame">
        <Image src={src} alt={alt} fill sizes="(max-width: 1120px) 100vw, 920px" priority={priority} />
      </div>
      <figcaption className="meta">
        {alt} ·{" "}
        <a href={href} target="_blank" rel="noreferrer noopener">
          {credit}
        </a>{" "}
        · {license}
      </figcaption>
    </figure>
  );
}

export function StoryThumb({ story }: { story: Story }) {
  if (!story.image) return null;
  return (
    <div className="thumb">
      <Image src={story.image.src} alt="" fill sizes="200px" />
    </div>
  );
}
