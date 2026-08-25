import { expect } from "twd-js";
import { describe, it } from "twd-js/runner";
import { accentAt, bookContent } from "../data/content";
import { dictionary } from "../components/Braille/dictionary";

/**
 * Data integrity rather than UI, and a deliberate exception to this project's
 * flow-first rule. The book is transcribed from the PDF by hand and stops
 * mid-story, so roughly forty more pages get typed in one at a time. Every
 * invariant below holds today with zero violations; the point is that they keep
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

      /* Capitals are graded from page 13 on, where the capital sign is
         invented — so an answer that carries one has to be shown with one, or
         the reader is asked to type a sign the page never displayed. */
      const strict = /[A-ZÁÉÍÓÚÜÑ]/.test(answer);
      const same = strict ? shown === answer : shown.toLowerCase() === answer.toLowerCase();

      if (!same) {
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

  it("keeps every fill-in word answerable from the word itself", () => {
    const exercises = pages.filter(({ entry }) => Boolean(entry.blanks));
    const taught = new Set(Object.keys(dictionary));
    const violations: string[] = [];
    let words = 0;

    for (const { page, entry } of exercises) {
      for (const blank of entry.blanks ?? []) {
        words += 1;
        const gap = accentAt(blank.word);

        // The gap's position and its answer are both read off the word, so a
        // word with two accents — or none — has no single cell to leave empty.
        const accents = [...blank.word].filter((char) => /[áéíóú]/.test(char));
        if (accents.length !== 1) {
          violations.push(
            `page ${page}: "${blank.word}" has ${accents.length} accented vowels, and a blank needs exactly one`,
          );
        }

        for (const word of [blank.word, ...(blank.also ?? [])]) {
          const unknown = [...new Set(word)].filter((char) => !taught.has(char));
          if (unknown.length) {
            violations.push(
              `page ${page}: "${word}" uses ` +
                `${unknown.map((char) => `"${char}"`).join(", ")}, which the dictionary does not teach`,
            );
          }
        }

        // An alternative is the same word with a different sign in the gap. If
        // it differs anywhere else, grading it by its accented vowel is wrong.
        for (const other of blank.also ?? []) {
          const swapped = other.slice(0, gap) + blank.word[gap] + other.slice(gap + 1);
          if (swapped !== blank.word) {
            violations.push(
              `page ${page}: "${other}" is offered as another reading of "${blank.word}" but differs somewhere other than the gap`,
            );
          }
        }
      }
    }

    expect(words, "the book has no fill-in words at all").to.be.greaterThan(0);

    expect(
      violations.length,
      `fill-in words that cannot be graded from the word\n${violations.join("\n")}\n`,
    ).to.equal(0);
  });

  it("never lets a yes/no page be passed without reading the braille", () => {
    const exercises = pages.filter(({ entry }) => Boolean(entry.questions));
    const violations: string[] = [];
    let asked = 0;

    for (const { page, entry } of exercises) {
      const questions = entry.questions ?? [];
      asked += questions.length;

      /* Two radios each and no partial credit, so a page whose answers are all
         "sí" is passed by clicking one column down the side without decoding a
         single cell. The book's own pages mix them; this is what stops a later
         one from quietly not doing so. */
      const yeses = questions.filter((question) => question.yes).length;
      if (questions.length > 0 && (yeses === 0 || yeses === questions.length)) {
        violations.push(
          `page ${page}: all ${questions.length} answers are "${yeses ? "sí" : "no"}", ` +
            `so the page is passed by answering the same thing every time`,
        );
      }

      if (questions.length < 2) {
        violations.push(`page ${page}: has ${questions.length} questions, and a page needs at least two`);
      }

      for (const question of questions) {
        if (!question.ask.trim()) {
          violations.push(`page ${page}: a question has nothing to ask`);
        }
      }
    }

    expect(asked, "the book has no yes/no questions at all").to.be.greaterThan(0);

    expect(
      violations.length,
      `yes/no pages that do not make the reader read\n${violations.join("\n")}\n`,
    ).to.equal(0);
  });
});
