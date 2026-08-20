import { Link, useLoaderData, useSearchParams } from "react-router";
import { BookA, History } from "lucide-react";
import Avatars from "../../components/Avatars";
import Messages from "../../components/Messages";
import ExerciseForm from "../../components/Form";
import Log from "../../components/Log";
import Dictionary from "../../components/Dictionary";
import { Button } from "../../components/ui/button";
import type { loader } from "./loader";

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
    <div className="max-w-full m-auto p-4 md:max-w-screen-lg">
      <h2 className="text-xl font-bold mb-4">Historia</h2>
      <nav className="mb-6">
        <ul className="list-none flex gap-2">
          <li>
            <Button variant="outline" render={(
              <Link to={{
                search: `?page=${page}&dictionary=open`,
              }}>
                Diccionario
                <BookA />
              </Link>
            )}>
              </Button>
          </li>
          <li>
            <Button variant="outline" render={(
              <Link to={{
                search: `?page=${page}&log=open`,
              }}>
                Historico
                <History />
              </Link>
            )}>
              </Button>
          </li>
        </ul>
      </nav>
      <Avatars author={content.author} />
      <Messages message={content.message} author={content.author}>
        {content.exercise ? (
          <ExerciseForm pageNumber={page} />
        ): (
          <div className="flex gap-2">
            <Button variant="ghost" render={(
              <Link to={{ search: `?page=${page - 1}` }} preventScrollReset>Volver</Link>
            )}>
            </Button>
            <Button variant="outline" render={(
              <Link to={{ search: `?page=${page + 1}` }} preventScrollReset>Continuar</Link>
            )}>
            </Button>
          </div>
        )}
      </Messages>
      {!!log && (
        <Log isOpen={!!log} onClose={handleClose('log')} content={fullContent} />
      )}
      <Dictionary isOpen={!!dictionary} onClose={handleClose('dictionary')} />
    </div>
  );
}
