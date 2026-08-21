import { Link } from "react-router";
import { BrailleMessage } from "../../components/Braille/BrailleMessage";
import { brailleAlphabet } from "../../components/Braille/alphabet";
import braillindaImage from "../../images/braillinda.png";
import { buttonStyles } from "../../components/styles";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Lantern light, bleeding in from the top right the way it does in the
          classroom illustration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 h-[36rem] w-[36rem] rounded-full
                   bg-honey/20 blur-3xl md:-right-20"
      />

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

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/story" viewTransition className={buttonStyles("primary")}>
                Comenzar la historia
              </Link>
              <span className="font-sans text-sm text-muted">Son 11 signos para empezar</span>
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

        <footer className="grid gap-8 py-10 md:grid-cols-2 md:py-14 [&>section]:min-w-0">
          <section>
            <h2 className="text-2xl">Por qué con la vista</h2>
            <p className="mt-3 max-w-md text-parchment/80">
              Quien ve puede aprender el sistema braille sin gran esfuerzo, leyéndolo
              visualmente. Es el primer paso para acercarse a la lectura de quienes lo
              leen con los dedos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">El libro</h2>
            <p className="mt-3 max-w-md text-parchment/80">
              Este curso sigue{" "}
              <em>Luis y Braillinda te cuentan cómo es el Braille</em>, de Carmen Roig,
              una obra de la ONCE que se distribuye gratuitamente.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <a
                className="link"
                href="https://www.once.es/servicios-sociales/braille/aprender-braille"
                target="_blank"
                rel="noreferrer"
              >
                Descargar el libro
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
          </section>
        </footer>
      </div>
    </main>
  );
}
