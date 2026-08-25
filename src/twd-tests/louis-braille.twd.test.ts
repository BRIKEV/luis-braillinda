import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
import { chapter, timeline } from "../data/louisBraille";

/**
 * The book's closing chapter, reachable from the landing page. A reader who
 * wants the history rather than the course goes down this path, reads it, and
 * comes back to start the story.
 */
describe("Louis Braille", () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  describe("reading the chapter", () => {
    it("walks from the landing page into the chapter and back", async () => {
      const user = userEvent.setup();
      await twd.visit("/");

      await user.click(screenDom.getByRole("link", { name: "Leer su historia completa" }));

      await twd.waitFor(() => {
        expect(
          screenDom.queryByRole("heading", { level: 1, name: "Quién fue Louis Braille" }),
        ).to.not.equal(null);
      });
      await twd.url().should("contain.url", "/louis-braille");

      // The chapter really is the chapter: its opening and closing lines.
      twd.should(
        screenDom.getByText(/Louis Braille, el inventor del sistema de lectura y escritura/),
        "be.visible",
      );
      twd.should(screenDom.getByText(/Su casa natal es un museo/), "be.visible");

      await user.click(screenDom.getByRole("link", { name: /Volver al inicio/i }));

      await twd.waitFor(() => {
        expect(
          screenDom.queryByRole("heading", { level: 1, name: /Aprende braille/i }),
        ).to.not.equal(null);
      });
      expect(window.location.pathname).to.equal("/");
    });

    it("says whose chapter it is and where the original lives", async () => {
      await twd.visit("/louis-braille");

      twd.should(screenDom.getByText(/Capítulo final de/), "be.visible");
      twd.should(screenDom.getByText(/ISBN 84-484-0246-4/), "be.visible");
      twd.should(
        screenDom.getByText(/Edición conmemorativa del ciento cincuenta aniversario/),
        "be.visible",
      );

      const pdf = screenDom.getByRole("link", {
        name: "Descargar el libro completo en PDF desde la ONCE (abre en una pestaña nueva)",
      });
      twd.should(
        pdf,
        "have.attr",
        "href",
        "https://www.once.es/servicios-sociales/braille/documentos-braille/curso-de-autoaprendizaje-de-braille-pdf/download",
      );
      twd.should(pdf, "have.attr", "target", "_blank");
    });
  });

  /**
   * Data integrity rather than UI, like `story-data`. The landing page shows a
   * dated summary of a chapter that lives beside it, and the two are edited by
   * hand — so the summary is pinned to the text it summarises.
   */
  describe("chapter data", () => {
    it("only claims dates the chapter itself states", () => {
      const text = chapter.join(" ");
      const unsupported = timeline.filter(({ year }) => !text.includes(year));

      expect(unsupported.map(({ year }) => year)).to.deep.equal([]);
    });

    it("carries the whole chapter, with the printed text's two slips corrected", () => {
      expect(chapter.length).to.equal(23);
      expect(chapter.filter((paragraph) => paragraph.trim() === "")).to.deep.equal([]);

      const text = chapter.join(" ");
      // "Coupvay" for Coupvray, and a stray "una" in "no se limita a una realizar".
      expect(text).to.not.contain("Coupvay,");
      expect(text).to.not.contain("a una realizar");
      expect(text).to.contain("enterrado en Coupvray");
      expect(text).to.contain("no se limita a realizar una modificación");
    });
  });
});
