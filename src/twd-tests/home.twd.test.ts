import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";

/**
 * Flows for the landing page. A reader arrives here knowing nothing about
 * braille: they read the invitation, then either start the story or follow the
 * links out to the ONCE. Everything the page needs lives in the component, so
 * there is nothing to mock.
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
      twd.should(screenDom.getByText("Son 11 signos para empezar"), "be.visible");

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

      const download = screenDom.getByRole("link", { name: "Descargar el libro" });
      twd.should(
        download,
        "have.attr",
        "href",
        "https://www.once.es/servicios-sociales/braille/aprender-braille",
      );
      twd.should(download, "have.attr", "target", "_blank");

      // The second link says out loud that it leaves the site, so its
      // accessible name is not the visible text.
      const once = screenDom.getByRole("link", {
        name: "El braille en la web de la ONCE (abre en una pestaña nueva)",
      });
      twd.should(once, "have.attr", "href", "https://www.once.es/servicios-sociales/braille");
      twd.should(once, "have.attr", "target", "_blank");
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
