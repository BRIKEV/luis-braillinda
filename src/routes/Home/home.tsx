import { Link } from "react-router";
import { BrailleMessage } from "../../components/Braille/BrailleMessage";
import { brailleAlphabet } from "../../components/Braille/alphabet";
import Footer from "../../components/Footer";
import { timeline } from "../../data/louisBraille";
import braillindaImage from "../../images/characters/braillinda/curious.webp";
import meadowImage from "../../images/backgrounds/bg-meadow.webp";
import { buttonStyles } from "../../components/styles";

/* The file itself, not the page that lists it — a reader who wants the book
   should get the book. */
const BOOK_PDF =
  "https://www.once.es/servicios-sociales/braille/documentos-braille/" +
  "curso-de-autoaprendizaje-de-braille-pdf/download";

export default function Home() {
  return (
    <>
      <main className="relative isolate min-h-dvh overflow-hidden">
        {/* The meadow the story opens in, pushed well back so it reads as
            atmosphere and never competes with the text on top of it. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <img src={meadowImage} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-dusk/85 via-dusk/75 to-dusk" />
          <div className="absolute -top-40 -right-32 h-[36rem] w-[36rem] rounded-full bg-honey/20 blur-3xl md:-right-20" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-10 md:px-10 md:py-16">
          {/* The dot border from the book's own title page. */}
          <div aria-hidden="true" className="dot-rule text-parchment" />

          <div className="grid items-center gap-10 py-12 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:py-20">
            <div className="min-w-0">
              <p className="font-sans text-xs font-bold tracking-[0.22em] text-honey uppercase">
                Un cuento de la ONCE
              </p>

              <h1 className="mt-5 text-[2.6rem] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                Aprende braille
                <span className="mt-1 block text-honey">con Luis y Braillinda</span>
              </h1>

              {/* The title echoed in braille, exactly as the book does on its own
                  title page. Decorative here — the reader has not learned these
                  signs yet, which is the point. */}
              <div className="mt-8">
                <BrailleMessage message="braille" map={brailleAlphabet} size="lg" />
              </div>

              <p className="mt-8 max-w-lg text-lg text-pretty text-parchment/85">
                Braillinda es un hada ciega que sueña con leer. Luis es el maestro que
                inventa un alfabeto de seis puntos. Acompáñalos y aprende a leer braille
                con la vista, signo a signo.
              </p>

              <div className="mt-9">
                <Link to="/story" viewTransition className={buttonStyles("primary")}>
                  Comenzar la historia
                </Link>
              </div>
            </div>

            {/* Braillinda, lit from her own aura. Hidden from assistive tech: she
                is atmosphere, and the text already introduces her. */}
            <div aria-hidden="true" className="relative min-w-0">
              <img
                src={braillindaImage}
                alt=""
                className="mx-auto w-40 max-w-full drop-shadow-[0_18px_45px_rgba(240,180,87,0.28)]
                           sm:w-52 md:w-full md:max-w-xs lg:max-w-md"
              />
            </div>
          </div>

          <div aria-hidden="true" className="dot-rule text-parchment" />

          <section className="grid gap-8 py-10 md:grid-cols-2 md:py-14 [&>div]:min-w-0">
            <div>
              <h2 className="text-2xl">Por qué con la vista</h2>
              <p className="mt-3 max-w-md text-parchment/80">
                Quien ve puede aprender el sistema braille sin gran esfuerzo, leyéndolo
                visualmente. Es el primer paso para acercarse a la lectura de quienes lo
                leen con los dedos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl">El libro</h2>
              <p className="mt-3 max-w-md text-parchment/80">
                Este curso sigue{" "}
                <em>Luis y Braillinda te cuentan cómo es el Braille</em>, de Carmen Roig,
                que la ONCE publicó en 2002 como edición conmemorativa del ciento cincuenta
                aniversario de la muerte de Louis Braille, y que distribuye gratuitamente.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <a
                  className="link"
                  href={BOOK_PDF}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Descargar el libro en PDF desde la ONCE (abre en una pestaña nueva)"
                >
                  Descargar el libro en PDF
                </a>
                <a
                  className="link"
                  href="https://www.once.es/servicios-sociales/braille"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="El braille en la web de la ONCE (abre en una pestaña nueva)"
                >
                  El braille en la ONCE
                </a>
              </p>
              {/* The book's own copyright page, near enough verbatim. The
                  "not official" disclaimer belongs to the footer, which every
                  page carries — saying it twice here would be noise. */}
              <p className="mt-4 max-w-md text-sm text-muted">
                © Organización Nacional de Ciegos Españoles (ONCE), Madrid, 2002. ISBN
                84-484-0246-4.
              </p>
            </div>
          </section>

          <div aria-hidden="true" className="dot-rule text-parchment" />

          <section className="py-10 md:py-14">
            <h2 className="text-2xl">Quién fue Louis Braille</h2>
            <p className="mt-3 max-w-2xl text-parchment/80">
              Louis Braille no nació ciego: perdió la vista a los tres años, jugando en el
              taller de talabartero de su padre. Tenía doce cuando un capitán de artillería
              llevó a su escuela un código para leer a oscuras. Louis lo redujo de doce
              puntos a seis y, con ellos, inventó un alfabeto.
            </p>

            {/* The dot border from the book's title page, stood on end: the
                chronology has a spine because these dates are a sequence. */}
            <div className="relative mt-8 max-w-3xl">
              <span
                aria-hidden="true"
                className="dot-rule-v absolute inset-y-2 left-0 hidden text-parchment sm:block"
              />
              <ol className="space-y-5 sm:pl-8">
                {timeline.map(({ year, event }) => (
                  <li key={year} className="grid gap-x-5 gap-y-1 sm:grid-cols-[4.5rem_1fr]">
                    <span className="font-display text-xl text-honey tabular-nums">
                      {year}
                    </span>
                    <span className="text-parchment/85">{event}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-9">
              <Link to="/louis-braille" className={buttonStyles("outline")}>
                Leer su historia completa
              </Link>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
