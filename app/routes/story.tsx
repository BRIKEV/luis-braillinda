import { Link, useSearchParams } from "react-router";
import { BookA, History } from "lucide-react";
import Avatars from "~/components/Avatars";
import Messages from "~/components/Messages";
import ExerciseForm from "~/components/Form";
import Log from "~/components/Log";
import Dictionary from "~/components/Dictionary";
import { Button } from "~/components/ui/button";
import { bookContent } from "~/data/content";
import type { Route } from "./+types/story";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aprende Braille junto a Luis y braillinda - Historia" },
    { name: "description", content: "Aprende Braille junto a Luis y braillinda - Inicio de la historia" },
  ];
}

export const action = async ({ request }: Route.ActionArgs) => {
  const body = await request.formData();
  const userSolution = body.get("solution") as string;
  const page = body.get("page") as string;
  const pageNumber = parseInt(page || "1");
  const findContent = bookContent[pageNumber - 1];
  if (findContent.solution?.toLowerCase() === userSolution.toLowerCase()) {
    return { success: true };
  }
  return new Response(JSON.stringify({ success: false }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export function loader({ request }: Route.LoaderArgs) {
  // return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
  const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const pageNumber = parseInt(page || "1");
    const fullContent = bookContent.slice(0, pageNumber);
    if (page && pageNumber > 1) {
      const content = bookContent.slice(pageNumber - 1, pageNumber)[0];
      return {
        page: pageNumber,
        content,
        fullContent
      };
    }
    const content = bookContent.slice(0, 1)[0];
    return {
      page: 1,
      content,
      fullContent,
    };
}

export default function Story({ loaderData }: Route.ComponentProps) {
  const { page, content, fullContent } = loaderData;
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
            <Button asChild variant="outline">
              <Link to={{
                search: `?page=${page}&dictionary=open`,
              }}>
                Diccionario
                <BookA />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline">
              <Link to={{
                search: `?page=${page}&log=open`,
              }}>
                Historico
                <History />
              </Link>
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
            <Button asChild variant="ghost">
              <Link to={{ search: `?page=${page - 1}` }} preventScrollReset>Volver</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={{ search: `?page=${page + 1}` }} preventScrollReset>Continuar</Link>
            </Button>
          </div>
        )}
      </Messages>
      <Log isOpen={!!log} onClose={handleClose('log')} content={fullContent} />
      <Dictionary isOpen={!!dictionary} onClose={handleClose('dictionary')} />
    </div>
  );
}
