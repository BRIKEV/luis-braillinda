/**
 * The braille cell as this app encodes it: a six-character string read in the
 * DOM order of the 2-column x 3-row grid, NOT in dot-number order.
 *
 *   string index:  0 1        dot number:  1 4
 *                  2 3                     2 5
 *                  4 5                     3 6
 *
 * `1` is a raised dot, `-` an empty position. So 'l' = dots 1,2,3 = '1-1-1-'.
 */
export interface BrailleMap {
  [key: string]: string;
}

/** Every letter of the Spanish alphabet. Used for decorative braille the
 *  reader is not expected to decode, such as the home page title. */
export const brailleAlphabet: BrailleMap = {
  a: '1-----',
  b: '1-1---',
  c: '11----',
  d: '11-1--',
  e: '1--1--',
  f: '111---',
  g: '1111--',
  h: '1-11--',
  i: '-11---',
  j: '-111--',
  k: '1---1-',
  l: '1-1-1-',
  m: '11--1-',
  n: '11-11-',
  o: '1--11-',
  p: '111-1-',
  q: '11111-',
  r: '1-111-',
  s: '-11-1-',
  t: '-1111-',
  u: '1---11',
  v: '1-1-11',
  w: '-111-1',
  x: '11--11',
  y: '11-111',
  z: '1--111',
  'ñ': '1111-1',
  'á': '1-1111',
  'é': '-11-11',
  'í': '-1--1-',
  'ó': '-1--11',
  'ú': '-11111',
  'ü': '1-11-1',

  /* Not a letter. The capital sign is dots 4,6 and is written *before* the
     letter it raises, which `BrailleMessage` does for you from the case of the
     text. It is keyed like a letter only so it can be listed in the dictionary
     and written on its own into a page as `<BRAILLE>^</BRAILLE>`. */
  '^': '-1---1',
};

/** The key the capital sign is stored under. Nothing spells it — it is a
 *  prefix, and `^` is simply a character no Spanish word contains. */
export const CAPITAL = '^';
