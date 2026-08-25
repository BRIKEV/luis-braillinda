import { expect } from "twd-js";
import { describe, it } from "twd-js/runner";
import { brailleAlphabet } from "../components/Braille/alphabet";

/**
 * A unit test, deliberately — flows are the rule in this project, and this is
 * one of the two sanctioned exceptions. A dot pattern is simply right or wrong,
 * and getting one wrong teaches a blind-adjacent reader a sign that does not
 * exist in the real world. There is no flow that would catch that.
 *
 * `alphabet.ts` stores a cell as six characters in the DOM order of a
 * 2-column x 3-row grid, which is NOT dot-number order:
 *
 *   string index:  0 1        dot number:  1 4
 *                  2 3                     2 5
 *                  4 5                     3 6
 *
 * Writing expectations in that order by hand is how a typo gets copied into the
 * test as well as the data. So the tables below are in real braille dot
 * numbers, checkable against any braille chart, and `cell()` does the mapping.
 */
const DOTS_IN_DOM_ORDER = [1, 4, 2, 5, 3, 6];

/** Real braille dot numbers -> the six-character string this app stores. */
const cell = (...dots: number[]) =>
  DOTS_IN_DOM_ORDER.map((dot) => (dots.includes(dot) ? "1" : "-")).join("");

/** The signs Luis and Braillinda have invented so far, letters and not. */
const taught: Record<string, number[]> = {
  a: [1],
  b: [1, 2],
  d: [1, 4, 5],
  e: [1, 5],
  i: [2, 4],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  s: [2, 3, 4],
  u: [1, 3, 6],
  // The "vocales acentuadas" section, plus the "t" that "bonitas" needs.
  "á": [1, 2, 3, 5, 6],
  "í": [3, 4],
  t: [2, 3, 4, 5],
  "ú": [2, 3, 4, 5, 6],
  "ó": [3, 4, 6],
  "é": [2, 3, 4, 6],
  // Not a letter: the capital sign, written before the letter it raises.
  // Braillinda proposes dot 6 alone and Luis talks her up to 4 and 6.
  "^": [4, 6],
};

/** Signs still ahead in the story, sampled across the alphabet. `ñ` is here
 *  because Spanish braille has its own sign for it and it is easy to invent. */
const stillAhead: Record<string, number[]> = {
  c: [1, 4],
  f: [1, 2, 4],
  z: [1, 3, 5, 6],
  "ñ": [1, 2, 4, 5, 6],
};

const check = (letters: Record<string, number[]>) => {
  for (const [letter, dots] of Object.entries(letters)) {
    expect(
      brailleAlphabet[letter],
      `"${letter}" is dots ${dots.join(",")} in braille, so it should be stored as "${cell(...dots)}"`,
    ).to.equal(cell(...dots));
  }
};

describe("Braille alphabet", () => {
  it("stores a cell in the DOM order of the grid, not in dot-number order", () => {
    // 'l' is dots 1,2,3 — the whole left column. In dot order that would be
    // '111---'; down the grid's columns it is '1-1-1-'.
    expect(cell(1, 2, 3)).to.equal("1-1-1-");
    expect(brailleAlphabet.l).to.equal("1-1-1-");

    // Dot 4 is the second character, not the fourth: 'c' is dots 1 and 4.
    expect(cell(1, 4)).to.equal("11----");
    expect(brailleAlphabet.c).to.equal("11----");

    // Dot 6 is the last one, and dot 3 the one before it: 'u' is dots 1,3,6.
    expect(cell(1, 3, 6)).to.equal("1---11");
    expect(brailleAlphabet.u).to.equal("1---11");
  });

  it("encodes the signs the story has already taught as real braille", () => {
    check(taught);
  });

  it("encodes the signs still ahead in the story as real braille", () => {
    check(stillAhead);
  });
});
