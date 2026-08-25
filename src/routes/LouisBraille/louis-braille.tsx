import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import Footer from "../../components/Footer";
import { buttonStyles } from "../../components/styles";
import { chapter, commemoration } from "../../data/louisBraille";

/* The chapter is prose to be read, so it goes on paper — the same surface the
   story's dialogue panel uses. The landing stays on the dusk ground; this is a
   reading page, and reading text on parchment is already the app's idiom. */
const BOOK_PDF =
  "https://www.once.es/servicios-sociales/braille/documentos-braille/" +
  "curso-de-autoaprendizaje-de-braille-pdf/download";

export default function LouisBraille() {
  return (
    <>
      <main className="min-h-dvh px-5 py-8 md:px-10 md:py-12">
        {/* Narrower than the landing's container: eleven hundred words want a
            measure of roughly sixty characters, not the full grid width. */}
        <div className="mx-auto max-w-2xl">
          <p>
            <Link to="/" className={buttonStyles("ghost")}>
              <ChevronLeft />
              Volver al inicio
            </Link>
          </p>

          <article className="paper rounded-card shadow-paper mt-6 px-5 py-8 sm:px-10 sm:py-12">
            <h1 className="text-3xl sm:text-4xl">Quién fue Louis Braille</h1>

            <div aria-hidden="true" className="dot-rule mt-6 text-ink" />

            <div className="mt-8 space-y-5 text-lg text-pretty">
              {chapter.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div aria-hidden="true" className="dot-rule mt-10 text-ink" />

            <footer className="mt-6 text-sm text-ink/70">
              <p>
                Capítulo final de{" "}
                <em>Luis y Braillinda te cuentan cómo es el Braille</em>, de Carmen Roig. ©
                Organización Nacional de Ciegos Españoles (ONCE), Madrid, 2002. ISBN
                84-484-0246-4.
              </p>
              <p className="mt-2">{commemoration}</p>
              <p className="mt-3">
                <a
                  className="link-paper"
                  href={BOOK_PDF}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Descargar el libro completo en PDF desde la ONCE (abre en una pestaña nueva)"
                >
                  Descargar el libro completo en PDF
                </a>
              </p>
            </footer>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
