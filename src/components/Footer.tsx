/**
 * The site footer, on the two reading pages — the landing and Louis Braille's
 * story. `/story` deliberately has none: it is a full-bleed stage.
 *
 * Rendered as a sibling of `<main>`, never inside it. A `<footer>` nested in
 * `<main>` is not exposed as the `contentinfo` landmark, and this is the one
 * place on the site that says whose work the story is.
 */

/** The book this whole app transcribes. Named in full, on purpose. */
const BOOK_PDF =
  "https://www.once.es/servicios-sociales/braille/documentos-braille/" +
  "curso-de-autoaprendizaje-de-braille-pdf/download";

export default function Footer() {
  return (
    <footer className="relative mx-auto max-w-6xl px-5 pb-10 md:px-10 md:pb-14">
      <div aria-hidden="true" className="dot-rule text-parchment" />

      <div className="grid gap-8 pt-8 text-sm md:grid-cols-2 md:gap-10">
        <p className="max-w-md text-muted">
          El cuento, los ejercicios y el capítulo sobre Louis Braille son de{" "}
          <span className="text-parchment/85">Carmen Roig</span> y de la{" "}
          <span className="text-parchment/85">ONCE</span>. Esta web es una adaptación
          independiente y no es un producto oficial de la ONCE.{" "}
          <a
            className="link"
            href={BOOK_PDF}
            target="_blank"
            rel="noreferrer"
            aria-label="Descargar el libro original en PDF desde la ONCE (abre en una pestaña nueva)"
          >
            Lee el libro original
          </a>
          .
        </p>

        <div className="md:text-right">
          <p className="text-muted">
            Esta adaptación la hizo{" "}
            <span className="text-parchment/85">Kevin Julián Martínez Escobar</span>,
            Software Architect y creador de TWD.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            <a
              className="link"
              href="https://www.linkedin.com/in/kevinccbsg"
              target="_blank"
              rel="noreferrer"
              aria-label="Kevin Julián Martínez Escobar en LinkedIn (abre en una pestaña nueva)"
            >
              LinkedIn
            </a>
            <a
              className="link"
              href="https://github.com/BRIKEV/luis-braillinda"
              target="_blank"
              rel="noreferrer"
              aria-label="Código de esta web en GitHub (abre en una pestaña nueva)"
            >
              Código en GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
