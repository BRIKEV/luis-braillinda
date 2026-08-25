import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
import { accentAt, bookContent, isExercise, type Blank } from "../data/content";

/**
 * The fill-in-the-blank pages: braille words with one cell missing, five signs
 * to choose from, and one button that grades the lot.
 *
 * A different mechanic from the typing exercise, so it gets its own flows —
 * the two share a route and an action but nothing else. Page numbers are
 * derived, as everywhere in this suite: the transcription is unfinished and
 * inserting a single line renumbers every page after it.
 */
const blanksIndex = bookContent.findIndex((entry) => Boolean(entry.blanks));
const blanksPage = blanksIndex + 1;
const blanks = bookContent[blanksIndex]?.blanks ?? [];

/** Somewhere with no exercise on it. `twd.visit()` does not reload, so the form
 *  would otherwise carry its picks and its verdict into the next test. */
const restPage = bookContent.findIndex((entry) => !isExercise(entry)) + 1;

const VOWELS = ["á", "é", "í", "ó", "ú"];

/** Every accepted word differs from the others only at the gap, so the signs a
 *  blank accepts are just their accented vowels. */
const acceptedFor = (blank: Blank) =>
  [blank.word, ...(blank.also ?? [])].map((word) => word[accentAt(word)]);

const rightFor = (blank: Blank) => blank.word[accentAt(blank.word)];

const wrongFor = (blank: Blank) =>
  VOWELS.filter((vowel) => !acceptedFor(blank).includes(vowel))[0];

/** The five radios of word N are the Nth of each vowel, in document order. */
const pick = async (user: ReturnType<typeof userEvent.setup>, word: number, vowel: string) => {
  await user.click(screenDom.getAllByRole("radio", { name: vowel })[word]);
};

const check = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screenDom.getByRole("button", { name: "Comprobar palabras" }));
};

describe("Fill in the accented vowels", () => {
  beforeEach(async () => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
    await twd.visit(`/story?page=${restPage}`);
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it("names each word for a reader who cannot see the dots", async () => {
    await twd.visit(`/story?page=${blanksPage}`);

    // The braille is drawn dots, so it is hidden from assistive tech and the
    // legend carries the word instead — with the gap named, not skipped.
    const first = blanks[0];
    const spelled = [...first.word]
      .map((char, index) => (index === accentAt(first.word) ? "hueco" : char))
      .join(", ");

    twd.should(screenDom.getByRole("group", { name: `Palabra 1: ${spelled}` }), "be.visible");
    expect(spelled, "the gap is not named in the legend").to.contain("hueco");
  });

  it("marks a wrong pick and an unanswered one apart, and lets neither through", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${blanksPage}`);

    expect(screenDom.queryByRole("link", { name: "Continuar" })).to.equal(null);

    // Word 1 left alone, word 2 answered with a sign it does not take, the
    // rest right — so the page has to report exactly two, not "wrong".
    await pick(user, 1, wrongFor(blanks[1]));
    for (let word = 2; word < blanks.length; word += 1) {
      await pick(user, word, rightFor(blanks[word]));
    }
    await check(user);

    twd.should(await screenDom.findByText(/Te quedan 2 de/), "be.visible");
    twd.should(screenDom.getByText("Te falta esta."), "be.visible");
    twd.should(screenDom.getByText("Esta no es."), "be.visible");

    // Nothing is lost for getting it wrong: same words, same choices, another go.
    expect(screenDom.queryByText("¡Correcto!")).to.equal(null);
    expect(screenDom.queryByRole("link", { name: "Continuar" })).to.equal(null);
    twd.should(screenDom.getByRole("button", { name: "Comprobar palabras" }), "be.visible");
    await twd.url().should("contain.url", `page=${blanksPage}`);
  });

  it("accepts the whole page and lets the reader carry on", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${blanksPage}`);

    for (let word = 0; word < blanks.length; word += 1) {
      await pick(user, word, rightFor(blanks[word]));
    }
    await check(user);

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");
    expect(screenDom.queryByRole("button", { name: "Comprobar palabras" })).to.equal(null);

    await user.click(screenDom.getByRole("link", { name: "Continuar" }));
    await twd.url().should("contain.url", `page=${blanksPage + 1}`);
  });

  it("takes the other vowel when the gap spells more than one real word", async () => {
    const user = userEvent.setup();
    const alternate = blanks.findIndex((blank) => (blank.also ?? []).length > 0);

    // The book prints the gap empty, so it never states an answer. If no word
    // on this page has a second reading the rule is untested, not satisfied.
    expect(alternate, "no blank on the first page carries an alternative").to.not.equal(-1);

    await twd.visit(`/story?page=${blanksPage}`);

    for (let word = 0; word < blanks.length; word += 1) {
      await pick(user, word, rightFor(blanks[word]));
    }

    const also = blanks[alternate].also ?? [];
    const second = also[0][accentAt(also[0])];
    expect(second, "the alternative uses the same vowel as the word itself").to.not.equal(
      rightFor(blanks[alternate]),
    );
    await pick(user, alternate, second);
    await check(user);

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");
  });
});
