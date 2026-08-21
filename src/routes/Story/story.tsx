import { Link, useLoaderData, useSearchParams } from "react-router";
import { BookA, History } from "lucide-react";
import Avatars from "../../components/Avatars";
import Messages from "../../components/Messages";
import ExerciseForm from "../../components/Form";
import Log from "../../components/Log";
import Dictionary from "../../components/Dictionary";
import { buttonStyles } from "../../components/styles";
import type { loader } from "./loader";

/* NOTE: still the pre-redesign layout, ported onto the new design tokens so it
   keeps working. The visual-novel staging lands in the next pass. */
export default function Story() {
  const { page, content, fullContent } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const log = searchParams.get('log');
  const dictionary = searchParams.get('dictionary');

  const handleClose = (key: string) => () => {
    setSearchParams((prev) => {
      prev.delete(key);
      return prev;
    });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-3">
        <Link to="/" className={buttonStyles("ghost")}>
          Inicio
        </Link>
        <span aria-hidden="true" className="dot-rule text-parchment min-w-8 flex-1" />
        <Link to={{ search: `?page=${page}&dictionary=open` }} className={buttonStyles("outline")}>
          <BookA />
          Diccionario
        </Link>
        <Link to={{ search: `?page=${page}&log=open` }} className={buttonStyles("outline")}>
          <History />
          Histórico
        </Link>
      </nav>

      <Avatars author={content.author} />

      <Messages message={content.message} author={content.author}>
        {content.exercise ? (
          <ExerciseForm pageNumber={page} />
        ) : (
          <div className="flex flex-wrap gap-3">
            <Link
              to={{ search: `?page=${page + 1}` }}
              preventScrollReset
              className={buttonStyles("primary")}
            >
              Continuar
            </Link>
            {page > 1 && (
              <Link
                to={{ search: `?page=${page - 1}` }}
                preventScrollReset
                className={buttonStyles("onPaper")}
              >
                Volver
              </Link>
            )}
          </div>
        )}
      </Messages>

      {!!log && <Log isOpen={!!log} onClose={handleClose('log')} content={fullContent} />}
      <Dictionary isOpen={!!dictionary} onClose={handleClose('dictionary')} />
    </main>
  );
}
