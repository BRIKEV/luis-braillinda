import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
import { bookContent, isExercise } from "../data/content";

/**
 * The "Tu turno" pages: braille to decode, a box to type the answer in, and no
 * way forward until it is right.
 *
 * Every page number below is derived. Only about a third of the PDF has been
 * transcribed, and inserting a single line shifts every index after it, so a
 * hard-coded `?page=30` would rot the first time someone types in a missing
 * page. An entry is an exercise when it has a `solution` — there is no flag.
 */
const exerciseIndex = bookContent.findIndex((entry) => Boolean(entry.solution));
const exercisePage = exerciseIndex + 1;
const solution = bookContent[exerciseIndex]?.solution ?? "";

/** The braille the reader has to decode on that page. Every block before page
 *  13 is written lowercase, so its accessible name is lowercase too. */
const brailleWord = (
  bookContent[exerciseIndex]?.message.match(/<BRAILLE>([A-Za-z ]+)<\/BRAILLE>/)?.[1] ?? ""
).toLowerCase();

/**
 * The one exercise graded on its capitals: page 13, where Luis and Braillinda
 * invent the capital sign and write proper names with it. Found by looking for
 * the capital rather than by page number, because the rule *is* "the solution
 * carries a capital" — there is no flag on the entry to search for instead.
 */
const capitalIndex = bookContent.findIndex((entry) => /[A-ZÁÉÍÓÚÑ]/.test(entry.solution ?? ""));
const capitalPage = capitalIndex + 1;
const capitalSolution = bookContent[capitalIndex]?.solution ?? "";

/** Somewhere with no exercise on it, used to unmount the form between tests. */
const restPage = bookContent.findIndex((entry) => !isExercise(entry)) + 1;

const collapse = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();

/**
 * The first run of plain prose in a message — what the reader actually reads
 * once `<BRAILLE>` and `<br>` have been expanded. Enough to recognise a page
 * without asserting its whole contents, which would break every time the
 * transcription is corrected.
 */
const firstProse = (message: string) =>
  message
    .replace(/<BRAILLE>[\s\S]*?<\/BRAILLE>/g, "\n")
    .split(/<br>|\n/)
    .map(collapse)
    .filter(Boolean)[0] ?? "";

const panelText = () => collapse(screenDom.getByRole("main").textContent);

/** Same letters, opposite case, so a pass proves the grading is
 *  case-insensitive rather than the answer being echoed back verbatim. */
const swapCase = (text: string) =>
  [...text]
    .map((char) => (char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()))
    .join("");

describe("Story exercises", () => {
  beforeEach(async () => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();

    // `twd.visit()` does not reload the page, and the form keeps both its typed
    // value and its fetcher result for as long as it stays mounted. Landing on
    // a page without an exercise unmounts it, so each test starts on a blank
    // form rather than inheriting the previous test's verdict.
    await twd.visit(`/story?page=${restPage}`);
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it("turns a wrong answer down and keeps the reader on the same exercise", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${exercisePage}`);

    // There really is braille to read here, and no way past it yet.
    twd.should(screenDom.getByRole("img", { name: `En braille: ${brailleWord}` }), "be.visible");
    expect(screenDom.queryByRole("link", { name: "Continuar" })).to.equal(null);

    await user.type(screenDom.getByLabelText("¿Qué pone aquí?"), "una respuesta que no es");
    await user.click(screenDom.getByRole("button", { name: "Comprobar palabra" }));

    twd.should(await screenDom.findByText("No es esa. Vuelve a intentarlo."), "be.visible");

    // Wrong answers cost nothing: the same braille, the same box, another go.
    twd.should(screenDom.getByRole("button", { name: "Comprobar palabra" }), "be.visible");
    twd.should(screenDom.getByRole("img", { name: `En braille: ${brailleWord}` }), "be.visible");
    expect(screenDom.queryByText("¡Correcto!")).to.equal(null);
    await twd.url().should("contain.url", `page=${exercisePage}`);
  });

  it("accepts the right answer and lets the reader carry on to the next page", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${exercisePage}`);

    await user.type(screenDom.getByLabelText("¿Qué pone aquí?"), solution);
    await user.click(screenDom.getByRole("button", { name: "Comprobar palabra" }));

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");

    // Nothing left to check, so the checking is put away and only the way
    // forward remains.
    expect(screenDom.queryByRole("button", { name: "Comprobar palabra" })).to.equal(null);
    const carryOn = screenDom.getByRole("link", { name: "Continuar" });
    twd.should(carryOn, "be.visible");

    await user.click(carryOn);

    await twd.url().should("contain.url", `page=${exercisePage + 1}`);
    await twd.waitFor(() => {
      expect(panelText()).to.contain(firstProse(bookContent[exerciseIndex + 1]?.message ?? ""));
    });
  });

  it("grades the answer without caring about capitals", async () => {
    const user = userEvent.setup();
    const typed = swapCase(solution);

    // Every solution before page 13 is lowercase, and the action ignores case
    // unless the answer itself carries a capital. Flipping the case guarantees
    // we are not just retyping the data.
    expect(typed, "the first solution has no letters whose case can be flipped").to.not.equal(
      solution,
    );

    await twd.visit(`/story?page=${exercisePage}`);

    await user.type(screenDom.getByLabelText("¿Qué pone aquí?"), typed);
    await user.click(screenDom.getByRole("button", { name: "Comprobar palabra" }));

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");
    twd.should(screenDom.getByRole("link", { name: "Continuar" }), "be.visible");
  });
});

/**
 * Capitals are ignored everywhere except here. The suite above proves the
 * ignoring still works; this proves the exception does, which is the half a
 * regression would silently take away — grading everything case-insensitively
 * again would leave every test but these ones green.
 */
describe("Exercises graded on their capitals", () => {
  beforeEach(async () => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
    await twd.visit(`/story?page=${restPage}`);
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it("turns down the right words written without their capitals", async () => {
    const user = userEvent.setup();
    const lowercased = capitalSolution.toLowerCase();

    expect(capitalIndex, "no exercise in the book is graded on its capitals").to.not.equal(-1);
    expect(lowercased, "that exercise's answer has no capitals to drop").to.not.equal(
      capitalSolution,
    );

    await twd.visit(`/story?page=${capitalPage}`);
    await user.type(screenDom.getByLabelText("¿Qué pone aquí?"), lowercased);
    await user.click(screenDom.getByRole("button", { name: "Comprobar palabra" }));

    // Every letter is right. The page is about capitals, so that is not enough.
    twd.should(await screenDom.findByText("No es esa. Vuelve a intentarlo."), "be.visible");
    expect(screenDom.queryByText("¡Correcto!")).to.equal(null);
    expect(screenDom.queryByRole("link", { name: "Continuar" })).to.equal(null);
    await twd.url().should("contain.url", `page=${capitalPage}`);
  });

  it("accepts them once the capitals are there", async () => {
    const user = userEvent.setup();
    await twd.visit(`/story?page=${capitalPage}`);

    await user.type(screenDom.getByLabelText("¿Qué pone aquí?"), capitalSolution);
    await user.click(screenDom.getByRole("button", { name: "Comprobar palabra" }));

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");
    twd.should(screenDom.getByRole("link", { name: "Continuar" }), "be.visible");
  });

  it("forgives stray spaces without forgiving the capitals", async () => {
    const user = userEvent.setup();
    // Fourteen names in one box: a doubled or trailing space is a typing slip,
    // not a wrong answer, and must not cost the reader the whole page.
    const spaced = ` ${capitalSolution.replace(/ /g, "  ")} `;

    await twd.visit(`/story?page=${capitalPage}`);
    await user.type(screenDom.getByLabelText("¿Qué pone aquí?"), spaced);
    await user.click(screenDom.getByRole("button", { name: "Comprobar palabra" }));

    twd.should(await screenDom.findByText("¡Correcto!"), "be.visible");
  });
});
