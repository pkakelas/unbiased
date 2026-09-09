import type { Story } from "./types";
import { dekapenteXiliosta } from "./stories/dekapente-xiliosta";
import { eksintaEksiKatastimata } from "./stories/eksinta-eksi-katastimata";
import { eikosiDyoXronia } from "./stories/eikosi-dyo-xronia";

/** Newest first. The order here is the order on the index. */
export const stories: Story[] = [
  eikosiDyoXronia,
  dekapenteXiliosta,
  eksintaEksiKatastimata,
];

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export type { Story };
