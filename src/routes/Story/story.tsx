import { Link, useLoaderData, useSearchParams } from "react-router";
import { BookA, ChevronLeft, History, Home } from "lucide-react";
import Stage from "../../components/Stage";
import DialoguePanel from "../../components/DialoguePanel";
import ExerciseForm from "../../components/Form";
import Log from "../../components/Log";
import Dictionary from "../../components/Dictionary";
import { buttonStyles } from "../../components/styles";
import { bookContent } from "../../data/content";
import type { loader } from "./loader";

export default function Story() {
  const { page, content, fullContent } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const log = searchParams.get("log");
  const dictionary = searchParams.get("dictionary");

  const handleClose = (key: string) => () => {
    setSearchParams((prev) => {
      prev.delete(key);
      return prev;
    });
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Stage entry={content} />

      <header className="relative z-10 px-3 pt-3 sm:px-6 sm:pt-5">
        <nav className="mx-auto flex max-w-3xl items-center gap-2">
          <Link
            to="/"
            className={`${buttonStyles("glass")} px-3`}
            aria-label="Volver al inicio"
          >
            <Home />
            <span className="sr-only sm:not-sr-only">Inicio</span>
          </Link>

          <span aria-hidden="true" className="dot-rule min-w-4 flex-1 text-parchment/70" />

          <Link
            to={{ search: `?page=${page}&dictionary=open` }}
            className={`${buttonStyles("glass")} px-3`}
            aria-label="Abrir el diccionario"
          >
            <BookA />
            <span className="sr-only sm:not-sr-only">Diccionario</span>
          </Link>
          <Link
            to={{ search: `?page=${page}&log=open` }}
            className={`${buttonStyles("glass")} px-3`}
            aria-label="Abrir el histórico"
          >
            <History />
            <span className="sr-only sm:not-sr-only">Histórico</span>
          </Link>
        </nav>
      </header>

      {/* Holds the panel down against the bottom of the stage, and gives long
          narration somewhere to grow into rather than covering the scene. */}
      <div className="min-h-[26vh] flex-1" />

      <main className="relative z-10 mx-auto w-full max-w-3xl sm:px-6 sm:pb-6">
        <DialoguePanel
          author={content.author}
          message={content.message}
          progress={page / bookContent.length}
        >
          {content.solution ? (
            <ExerciseForm pageNumber={page} />
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={{ search: `?page=${page + 1}` }}
                preventScrollReset
                viewTransition
                className={buttonStyles("primary")}
              >
                Continuar
              </Link>
              {page > 1 && (
                <Link
                  to={{ search: `?page=${page - 1}` }}
                  preventScrollReset
                  viewTransition
                  className={buttonStyles("onPaper")}
                  aria-label="Volver a la página anterior"
                >
                  <ChevronLeft />
                  Volver
                </Link>
              )}
            </div>
          )}
        </DialoguePanel>
      </main>

      {!!log && <Log isOpen={!!log} onClose={handleClose("log")} content={fullContent} />}
      <Dictionary isOpen={!!dictionary} onClose={handleClose("dictionary")} />
    </div>
  );
}
