import { brailleAlphabet, type BrailleMap } from "./alphabet";

/**
 * The letters the story has taught so far, in the order Luis and Braillinda
 * invent them. This is the reader's progress, not a complete alphabet — the
 * Dictionary dialog lists exactly these, and a <BRAILLE> block in the story
 * should never use a letter that is not yet here.
 *
 * Dot patterns come from `brailleAlphabet` so there is one source of truth.
 */
const taught = ["a", "b", "d", "e", "i", "l", "m", "n", "o", "s", "u"] as const;

export const dictionary: BrailleMap = Object.fromEntries(
  taught.map((letter) => [letter, brailleAlphabet[letter]]),
);
