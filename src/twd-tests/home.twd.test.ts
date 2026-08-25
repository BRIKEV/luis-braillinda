import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";

/**
 * Flows for the landing page. A reader arrives here knowing nothing about
 * braille: they read the invitation, then either start the story, read who
 * Louis Braille was, or follow the links out to the ONCE. Everything the page
 * needs lives in the component, so there is nothing to mock.
 */
describe("Home page", () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
    twd.clearComponentMocks();
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  describe("arriving", () => {
    it("shows the reader what the course is and how to begin", async () => {
      await twd.visit("/");

      twd.should(screenDom.getByText("Un cuento de la ONCE"), "be.visible");
      twd.should(
        screenDom.getByRole("heading", { level: 1, name: /Aprende braille con Luis y Braillinda/i }),
        "be.visible",
      );

      // The title repeated in braille, exactly as the book's own title page
      // does it. The reader cannot decode it yet — that is the invitation.
      twd.should(screenDom.getByRole("img", { name: "En braille: braille" }), "be.visible");

      twd.should(
        screenDom.getByText(/Braillinda es un hada ciega que sueña con leer/i),
        "be.visible",
      );

      twd.should(screenDom.getByRole("link", { name: "Comenzar la historia" }), "be.visible");

      // Braillinda and the meadow are atmosphere: the text already introduces
      // her, so neither reaches assistive tech. Only the braille title does.
      expect(screenDom.queryByRole("img", { name: /braillinda/i })).to.equal(null);
    });

    it("explains why a sighted reader is here and links out to the book", async () => {
      await twd.visit("/");

      twd.should(screenDom.getByRole("heading", { level: 2, name: "Por qué con la vista" }), "be.visible");
      twd.should(
        screenDom.getByText(/Quien ve puede aprender el sistema braille sin gran esfuerzo/i),
        "be.visible",
      );

      twd.should(screenDom.getByRole("heading", { level: 2, name: "El libro" }), "be.visible");
      twd.should(
        screenDom.getByText(/Luis y Braillinda te cuentan cómo es el Braille/i),
        "be.visible",
      );

      // The book itself, not the page that lists it. Both ONCE links say out
      // loud that they leave the site, so their accessible names are not the
      // visible text.
      const download = screenDom.getByRole("link", {
        name: "Descargar el libro en PDF desde la ONCE (abre en una pestaña nueva)",
      });
      twd.should(
        download,
        "have.attr",
        "href",
        "https://www.once.es/servicios-sociales/braille/documentos-braille/curso-de-autoaprendizaje-de-braille-pdf/download",
      );
      twd.should(download, "have.attr", "target", "_blank");

      const once = screenDom.getByRole("link", {
        name: "El braille en la web de la ONCE (abre en una pestaña nueva)",
      });
      twd.should(once, "have.attr", "href", "https://www.once.es/servicios-sociales/braille");
      twd.should(once, "have.attr", "target", "_blank");

      // Whose work this is, in the words of the book's own copyright page.
      twd.should(screenDom.getByText(/ISBN 84-484-0246-4/), "be.visible");
    });

    it("summarises who Louis Braille was, with only the dates the book gives", async () => {
      await twd.visit("/");

      twd.should(
        screenDom.getByRole("heading", { level: 2, name: "Quién fue Louis Braille" }),
        "be.visible",
      );
      twd.should(screenDom.getByText(/Louis Braille no nació ciego/i), "be.visible");

      // Seven milestones, every one of them a year the chapter states outright.
      const milestones = screenDom.getAllByRole("listitem");
      expect(milestones.length).to.equal(7);
      twd.should(screenDom.getByText("1809"), "be.visible");
      twd.should(screenDom.getByText("1827"), "be.visible");
      twd.should(screenDom.getByText("1878"), "be.visible");

      const chapter = screenDom.getByRole("link", { name: "Leer su historia completa" });
      twd.should(chapter, "have.attr", "href", "/louis-braille");
    });

    it("credits the book and its adaptation in the footer", async () => {
      await twd.visit("/");

      // Said once per page, and only here — the footer is on every page.
      twd.should(
        screenDom.getByText(/no es un producto oficial de la ONCE/),
        "be.visible",
      );
      twd.should(screenDom.getByText(/Kevin Julián Martínez Escobar/), "be.visible");

      const linkedin = screenDom.getByRole("link", {
        name: "Kevin Julián Martínez Escobar en LinkedIn (abre en una pestaña nueva)",
      });
      twd.should(linkedin, "have.attr", "href", "https://www.linkedin.com/in/kevinccbsg");
      twd.should(linkedin, "have.attr", "target", "_blank");

      const repo = screenDom.getByRole("link", {
        name: "Código de esta web en GitHub (abre en una pestaña nueva)",
      });
      twd.should(repo, "have.attr", "href", "https://github.com/BRIKEV/luis-braillinda");
    });
  });

  describe("starting the story", () => {
    it("takes the reader into the story from the main call to action", async () => {
      const user = userEvent.setup();
      await twd.visit("/");

      const cta = screenDom.getByRole("link", { name: "Comenzar la historia" });

      // A real anchor pointing at the story, not a div with a click handler:
      // that is what makes it keyboard-activatable and openable in a new tab.
      twd.should(cta, "have.attr", "href", "/story");
      cta.focus();
      expect(document.activeElement).to.equal(cta);

      await user.click(cta);

      // The landing page is gone and the router has moved to the story.
      await twd.waitFor(() => {
        expect(screenDom.queryByRole("heading", { level: 1, name: /Aprende braille/i })).to.equal(null);
      });
      await twd.url().should("contain.url", "/story");
    });
  });
});
