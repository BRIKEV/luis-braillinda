/**
 * Staging: which backdrop and which characters are on screen for a given page.
 *
 * This is presentation only. It reads nothing from `Content` beyond the page
 * number and deliberately lives next to the route rather than in `content.ts` —
 * the story data stays a plain script, and the staging is a view concern that
 * can be retuned without touching it.
 *
 * Page numbers are 1-based indices into `bookContent`.
 */

export type Backdrop = "meadow" | "paris" | "workshop";
export type Who = "braillinda" | "luis" | "abuela";

export interface Casting {
  who: Who;
  expression: string;
}

export interface Scene {
  backdrop: Backdrop;
  /** Stage left. Luis and the abuela are drawn facing right. */
  left: Casting | null;
  /** Stage right. Braillinda is drawn facing left, so they face each other. */
  right: Casting | null;
}

/** Where the story is, by page. */
const ACTS: { until: number; scene: Scene }[] = [
  // Braillinda alone in the meadow, sad that she cannot read.
  { until: 5, scene: { backdrop: "meadow", left: null, right: { who: "braillinda", expression: "wistful" } } },
  // Her grandmother joins her: the crown of dots, and the idea of Luis.
  { until: 12, scene: { backdrop: "meadow", left: { who: "abuela", expression: "thoughtful" }, right: { who: "braillinda", expression: "curious" } } },
  // The journey to Paris.
  { until: 13, scene: { backdrop: "paris", left: null, right: { who: "braillinda", expression: "curious" } } },
  // She finds Luis asleep at his work table and wakes him.
  { until: 14, scene: { backdrop: "workshop", left: { who: "luis", expression: "asleep" }, right: { who: "braillinda", expression: "curious" } } },
  { until: 16, scene: { backdrop: "workshop", left: { who: "luis", expression: "surprised" }, right: { who: "braillinda", expression: "curious" } } },
];

/** From here on they are inventing letters together. */
const DEFAULT_SCENE: Scene = {
  backdrop: "workshop",
  left: { who: "luis", expression: "explaining" },
  right: { who: "braillinda", expression: "curious" },
};

/**
 * Beats worth reacting to. Only the speaker's expression changes; the rest of
 * the scene is inherited. Keyed by page.
 */
const BEATS: Record<number, Partial<Record<Who, string>>> = {
  10: { abuela: "encouraging" }, // "¿Por qué no le haces una visita?"
  12: { abuela: "encouraging" }, // "Vete a verlo y ayúdale en todo lo que puedas"
  29: { braillinda: "delighted" }, // "¡¡Qué fácil! Ya puedo escribir"
  35: { luis: "pleased" }, // "Pone «ala». Queda muy bien"
  38: { braillinda: "delighted" }, // "¡Genial! Entonces ya puedo escribir esto"
  47: { braillinda: "cross" }, // "¡Yo no le doy mis alas a nadie!"
  52: { braillinda: "cross" }, // she kicks dot 5 across the cell
  55: { braillinda: "cross" }, // "A mí la 'n' me importa poco"
};

export function sceneFor(page: number): Scene {
  const base = ACTS.find((a) => page <= a.until)?.scene ?? DEFAULT_SCENE;
  const beat = BEATS[page];
  if (!beat) return base;

  const apply = (c: Casting | null): Casting | null =>
    c && beat[c.who] ? { ...c, expression: beat[c.who]! } : c;

  return { ...base, left: apply(base.left), right: apply(base.right) };
}

/** Narration and exercises have no-one speaking, so nobody is lit. */
export function speakerSlot(author: string): "left" | "right" | null {
  switch (author.toLowerCase()) {
    case "luis":
    case "abuela":
      return "left";
    case "braillinda":
      return "right";
    default:
      return null;
  }
}
