import { brailleAlphabet, type BrailleMap } from "./alphabet";

/**
 * The signs the story has taught so far, in the order Luis and Braillinda
 * invent them. Mostly letters, and from page 13 the capital sign too. This is
 * the reader's progress, not a complete alphabet — the Dictionary dialog lists
 * exactly these, and a <BRAILLE> block in the story should never use a sign
 * that is not yet here.
 *
 * Dot patterns come from `brailleAlphabet` so there is one source of truth.
 */
const taught = [
  "a", "b", "d", "e", "i", "l", "m", "n", "o", "s", "u",
  // The accented vowels, in the order Luis and Braillinda invent them.
  "á", "í", "ú", "ó", "é",
  // Letters the book never teaches but does use: "t" in "bonitas", "r" in
  // "una buena obra" on PDF page 14. Page 15's own recap of what the reader
  // knows lists neither, so they are grouped apart from the taught letters
  // rather than filed under the accents as if they belonged there.
  "t", "r",
  // Not a letter: the capital sign, invented on page 13 of the PDF.
  "^",
] as const;

export const dictionary: BrailleMap = Object.fromEntries(
  taught.map((letter) => [letter, brailleAlphabet[letter]]),
);

/** Signs that are not letters have nothing to print as their own caption. */
const names: Record<string, string> = { "^": "mayúscula" };

/** What a sign is called under its cell in the Diccionario. A letter is called
 *  by itself; the capital sign is a prefix and has to be named. */
export const signName = (sign: string) => names[sign] ?? sign;
