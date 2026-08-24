import { expect } from "twd-js";
import { describe, it } from "twd-js/runner";
import { bookContent } from "../data/content";
import { dictionary } from "../components/Braille/dictionary";

/**
 * Data integrity rather than UI, and a deliberate exception to this project's
 * flow-first rule. The book is transcribed from the PDF by hand and stops
 * mid-story, so roughly forty more pages get typed in one at a time. Both
 * invariants below hold today with zero violations; the point is that they keep
 * holding once someone is pasting page 70 in at eleven at night.
 *
 * Extraction here is deliberately more permissive than `parseMessage`, which
 * matches `/<BRAILLE>([A-Za-z ]+)<\/BRAILLE>/`. A block containing an accent, a
 * digit or punctuation does not match there at all: the tag leaks to the page
 * as literal text instead of failing loudly. Matching anything between the tags
 * is what turns that silent leak into a named page number.
 */
const BRAILLE_BLOCK = /<BRAILLE>([\s\S]*?)<\/BRAILLE>/g;

const blocksIn = (message: string) => [...message.matchAll(BRAILLE_BLOCK)].map(([, text]) => text);

const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

/** Array position is the page number, so carry it alongside every entry. */
const pages = bookContent.map((entry, index) => ({ page: index + 1, entry }));

describe("Story data", () => {
  it("never puts a sign in a braille block before the story has taught it", () => {
    const taught = new Set(Object.keys(dictionary));
    const violations: string[] = [];
    let blocks = 0;

    for (const { page, entry } of pages) {
      for (const text of blocksIn(entry.message)) {
        blocks += 1;
        const unknown = [...new Set(text.toLowerCase())].filter(
          (char) => char !== " " && !taught.has(char),
        );

        if (unknown.length) {
          violations.push(
            `page ${page}: <BRAILLE>${text}</BRAILLE> uses ` +
              `${unknown.map((char) => `"${char}"`).join(", ")}, which the dictionary does not teach`,
          );
        }
      }
    }

    // Guards the extraction itself: if the markup ever changes shape, the loop
    // above would find nothing and pass by doing no work at all.
    expect(blocks, "no <BRAILLE> blocks were found anywhere in the book").to.be.greaterThan(0);

    expect(
      violations.length,
      `signs used before they are taught (dictionary teaches: ${[...taught].join(" ")})\n` +
        `${violations.join("\n")}\n`,
    ).to.equal(0);
  });

  it("keeps every exercise's braille and its solution saying the same thing", () => {
    const exercises = pages.filter(({ entry }) => Boolean(entry.solution));
    const violations: string[] = [];

    for (const { page, entry } of exercises) {
      // Several blocks on one page read as one phrase, so join them with a
      // space and then collapse — the reader sees words, not markup.
      const shown = collapse(blocksIn(entry.message).join(" "));
      const answer = collapse(entry.solution ?? "");

      if (shown.toLowerCase() !== answer.toLowerCase()) {
        violations.push(
          `page ${page}: the braille reads "${shown}" but the solution is "${entry.solution}"`,
        );
      }
    }

    expect(exercises.length, "the book has no exercises at all").to.be.greaterThan(0);

    expect(
      violations.length,
      `exercises whose braille and answer disagree\n${violations.join("\n")}\n`,
    ).to.equal(0);
  });
});
