import { twd, userEvent, screenDom, screenDomGlobal, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
import { bookContent } from "../data/content";
import { dictionary } from "../components/Braille/dictionary";

/**
 * Moving through the story: forwards, backwards, straight to a page by URL, and
 * the two dialogs hanging off the header.
 *
 * All state lives in the query string, so there is nothing to set up beyond the
 * URL — and every page number here is derived, because the transcription is
 * unfinished and inserting one line renumbers everything after it.
 */

/** Two consecutive pages with no exercise on either, so Continuar and Volver
 *  are both on screen. Exercise pages replace them with the answer form. */
const walkIndex = bookContent.findIndex(
  (entry, index) =>
    !entry.solution && index + 1 < bookContent.length && !bookContent[index + 1].solution,
);
const walkPage = walkIndex + 1;

const collapse = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();

/** The first run of plain prose in a message — what the reader actually reads
 *  once `<BRAILLE>` and `<br>` have been expanded. Used to recognise a page
 *  without asserting its whole contents. */
const firstProse = (message: string) =>
  message
    .replace(/<BRAILLE>[\s\S]*?<\/BRAILLE>/g, "\n")
    .split(/<br>|\n/)
    .map(collapse)
    .filter(Boolean)[0] ?? "";

/** The last page with prose on it and no exercise: far enough in that landing
 *  there proves the URL chose the page rather than the loader's default. */
const deepIndex = bookContent.reduce(
  (found, entry, index) => (!entry.solution && firstProse(entry.message) ? index : found),
  0,
);
const deepPage = deepIndex + 1;

/** The page where braille first appears, and the word it shows. */
const brailleIndex = bookContent.findIndex((entry) => entry.message.includes("<BRAILLE>"));
const braillePage = brailleIndex + 1;
const brailleWord = (
  bookContent[brailleIndex]?.message.match(/<BRAILLE>([A-Za-z ]+)<\/BRAILLE>/)?.[1] ?? ""
).toLowerCase();

const panelText = () => collapse(screenDom.getByRole("main").textContent);

const searchParam = (key: string) => new URLSearchParams(window.location.search).get(key);

describe("Story navigation", () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  describe("turning pages", () => {
    it("walks forward with Continuar and back again with Volver", async () => {
      const user = userEvent.setup();
      await twd.visit(`/story?page=${walkPage}`);

      expect(panelText()).to.contain(firstProse(bookContent[walkIndex].message));

      await user.click(screenDom.getByRole("link", { name: "Continuar" }));

      await twd.url().should("contain.url", `page=${walkPage + 1}`);
      await twd.waitFor(() => {
        expect(panelText()).to.contain(firstProse(bookContent[walkIndex + 1].message));
      });

      await user.click(screenDom.getByRole("link", { name: "Volver a la página anterior" }));

      await twd.url().should("contain.url", `page=${walkPage}`);
      await twd.waitFor(() => {
        expect(panelText()).to.contain(firstProse(bookContent[walkIndex].message));
      });
    });

    it("starts at the first page and offers no way back from it", async () => {
      await twd.visit("/story");

      // No ?page at all is the same as ?page=1 — the loader defaults rather
      // than erroring.
      await twd.waitFor(() => {
        expect(panelText()).to.contain(firstProse(bookContent[0].message));
      });

      twd.should(screenDom.getByRole("link", { name: "Continuar" }), "be.visible");
      expect(screenDom.queryByRole("link", { name: "Volver a la página anterior" })).to.equal(null);

      // The only "volver" on page one is the one that leaves the story, which
      // is also what makes the query above the right one to be asking.
      twd.should(screenDom.getByRole("link", { name: "Volver al inicio" }), "be.visible");

      await twd.visit("/story?page=1");
      await twd.waitFor(() => {
        expect(panelText()).to.contain(firstProse(bookContent[0].message));
      });
      expect(screenDom.queryByRole("link", { name: "Volver a la página anterior" })).to.equal(null);
    });

    it("opens straight at whatever page the URL names", async () => {
      await twd.visit(`/story?page=${deepPage}`);

      await twd.waitFor(() => {
        expect(panelText()).to.contain(firstProse(bookContent[deepIndex].message));
      });
      expect(panelText()).to.not.contain(firstProse(bookContent[0].message));

      // The page number reached the panel, not just the router: progress is
      // drawn from it.
      twd.should(
        screenDom.getByRole("progressbar", { name: "Progreso de la historia" }),
        "have.attr",
        "aria-valuenow",
        String(Math.round((deepPage / bookContent.length) * 100)),
      );
    });
  });

  describe("the header dialogs", () => {
    it("opens the dictionary of taught signs and clears the param on closing", async () => {
      const user = userEvent.setup();
      await twd.visit(`/story?page=${walkPage}`);

      await user.click(screenDom.getByRole("link", { name: "Abrir el diccionario" }));

      // Native <dialog> in the top layer, so query the whole document.
      const dialog = await screenDomGlobal.findByRole("dialog", { name: "Diccionario" });
      const letters = Object.keys(dictionary);

      twd.should(
        screenDomGlobal.getByText(
          `Los ${letters.length} signos que Luis y Braillinda han inventado hasta ahora.`,
        ),
        "be.visible",
      );
      expect([...dialog.querySelectorAll("li")].map((item) => collapse(item.textContent))).to.deep.equal(
        letters,
      );
      expect(searchParam("dictionary")).to.equal("open");

      await user.click(screenDomGlobal.getByRole("button", { name: "Cerrar" }));

      await twd.waitFor(() => {
        expect(searchParam("dictionary")).to.equal(null);
      });
      expect(screenDomGlobal.queryByRole("dialog", { name: "Diccionario" })).to.equal(null);

      // Closing a dialog must not cost the reader their place in the story.
      expect(searchParam("page")).to.equal(String(walkPage));
    });

    it("shows the story so far with its braille rendered, not as raw markup", async () => {
      const user = userEvent.setup();
      await twd.visit(`/story?page=${braillePage}`);

      await user.click(screenDom.getByRole("link", { name: "Abrir el histórico" }));

      const dialog = await screenDomGlobal.findByRole("dialog", { name: "Lo que va de historia" });

      // Everything from page one up to and including where the reader is.
      expect(collapse(dialog.textContent)).to.contain(firstProse(bookContent[0].message));
      expect(collapse(dialog.textContent)).to.contain(firstProse(bookContent[brailleIndex].message));

      // The regression this guards: the history used to print the tags
      // verbatim instead of expanding them into cells.
      expect(dialog.textContent ?? "").to.not.contain("<BRAILLE>");

      const rendered = [...dialog.querySelectorAll('[role="img"]')].map((cell) =>
        cell.getAttribute("aria-label"),
      );
      expect(rendered).to.contain(`En braille: ${brailleWord}`);

      await user.click(screenDomGlobal.getByRole("button", { name: "Cerrar" }));

      await twd.waitFor(() => {
        expect(searchParam("log")).to.equal(null);
      });
    });
  });
});
