/**
 * The only verdicts a timeline entry may carry. Each is a full phrase, so the
 * pill explains itself; the colour only weights it. Adding a kind here is a
 * deliberate editorial decision, not something a story does on its own.
 */
export type TagKind = "unanimous" | "disputed" | "pending" | "refused";

export const tags: Record<TagKind, { label: string; tone: "green" | "red" | "yellow" | "grey" }> = {
  unanimous: { label: "Ομόφωνη απόφαση", tone: "green" },
  disputed: { label: "Οι πηγές διαφωνούν", tone: "red" },
  pending: { label: "Εκκρεμεί", tone: "yellow" },
  refused: { label: "Αίτημα απορρίφθηκε", tone: "grey" },
};
