import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
import { bookContent, isExercise, type Question } from "../data/content";

/**
 * The yes/no pages: a braille text on the card before, four questions about it,
 * and one button that grades the lot.
 *
 * A third mechanic alongside the typing box and the fill-in blanks. It shares
 * the route and the action with them and nothing else, so it gets its own
 * flows. Page numbers are derived, as everywhere in this suite: the
 * transcription is unfinished and inserting a single line renumbers every page
 * after it.
 */
const questionsIndex = bookContent.findIndex((entry) => Boolean(entry.questions));
const questionsPage = questionsIndex + 1;
const questions: Question[] = bookContent[questionsIndex]?.questions ?? [];

/** Somewhere with no exercise on it. `twd.visit()` does not reload, so the form
 *  would otherwise carry its picks and its verdict into the next test. */
const restPage = bookContent.findIndex((entry) => !isExercise(entry)) + 1;

const rightFor = (question: Question) => (question.yes ? "Sí" : "No");
const wrongFor = (question: Question) => (question.yes ? "No" : "Sí");

/** The two radios of question N are the Nth "Sí" and the Nth "No", in document
 *  order — the same trick the fill-in flows use for their five vowels. */
const answer = async (
  user: ReturnType<typeof userEvent.setup>,
  question: number,
  reply: string,
) => {
  await user.click(screenDom.getAllByRole("radio", { name: reply })[question]);
};

const check = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screenDom.getByRole("button", { name: "Comprobar respuestas" }));
};

describe("Answer sí or no about the text", () => {
  beforeEach(async () => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
    await twd.visit(`/story?page=${restPage}`);
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it("asks every question in the book's own words, out loud", async () => {
    await twd.visit(`/story?page=${questionsPage}`);

    expect(questions.length, "the first yes/no page has no questions on it").to.be.greaterThan(1);

    /* Unlike the fill-in blanks, the question *is* text — there is nothing
       drawn to hide from assistive tech, so the legend is the visible label
       rather than an sr-only translation of some dots. It carries the number
       too: the verdict counts ("Te quedan 2 de 4") and a reader has to be able
       to tell which two, whether they are looking or listening. */
    questions.forEach((question, index) => {
      const legend = `${index + 1}. ${question.ask}`;

      // Once as the group's accessible name, which is what gets announced...
      twd.should(screenDom.getByRole("group", { name: legend }), "be.visible");
      // ...and once as text on the page, which is what gets read.
      twd.should(screenDom.getByText(legend), "be.visible");
    });
  });

  it("marks a wrong answer and an unanswered one apart, and lets neither through", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${questionsPage}`);

    expect(screenDom.queryByRole("link", { name: "Continuar" })).to.equal(null);

    // Question 1 left alone, question 2 answered the wrong way round, the rest
    // right — so the page has to report exactly two, not "wrong".
    await answer(user, 1, wrongFor(questions[1]));
    for (let index = 2; index < questions.length; index += 1) {
      await answer(user, index, rightFor(questions[index]));
    }
    await check(user);

    twd.should(await screenDom.findByText(/Te quedan 2 de/), "be.visible");
    twd.should(screenDom.getByText("Te falta esta."), "be.visible");
    twd.should(screenDom.getByText("Esta no es."), "be.visible");

    // Nothing is lost for getting it wrong: same questions, another go.
    expect(screenDom.queryByText("¡Correcto!")).to.equal(null);
    expect(screenDom.queryByRole("link", { name: "Continuar" })).to.equal(null);
    twd.should(screenDom.getByRole("button", { name: "Comprobar respuestas" }), "be.visible");
    await twd.url().should("contain.url", `page=${questionsPage}`);
  });

  it("will not be passed by answering sí to everything", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${questionsPage}`);

    // The point of the exercise is reading the braille, so a reader who clicks
    // one column all the way down has to be told no. `story-data` proves every
    // yes/no page mixes both answers, which is what makes this reachable.
    for (let index = 0; index < questions.length; index += 1) {
      await answer(user, index, "Sí");
    }
    await check(user);

    twd.should(await screenDom.findByText(/Te queda/), "be.visible");
    expect(screenDom.queryByText("¡Correcto!")).to.equal(null);
  });

  it("accepts the whole page and lets the reader carry on", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${questionsPage}`);

    for (let index = 0; index < questions.length; index += 1) {
      await answer(user, index, rightFor(questions[index]));
    }
    await check(user);

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");
    expect(screenDom.queryByRole("button", { name: "Comprobar respuestas" })).to.equal(null);

    await user.click(screenDom.getByRole("link", { name: "Continuar" }));
    await twd.url().should("contain.url", `page=${questionsPage + 1}`);
  });
});
