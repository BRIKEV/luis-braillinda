import { bookContent } from "~/data/content";
import type { Route } from "./+types/home";
import { Link, useSearchParams } from "react-router";
import { BookA, History } from "lucide-react";
import Avatars from "~/components/Avatars";
import Message from "~/components/Messages";
import ExerciseForm from "~/components/Form";
import Log from "~/components/Log";
import Dictionary from "~/components/Dictionary";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aprende Braille junto a Luis y braillinda" },
    { name: "description", content: "Aprende Braille junto a Luis y braillinda" },
  ];
}

export const action = async ({ request }: Route.ActionArgs) => {
  const body = await request.formData();
  const userSolution = body.get("solution") as string;
  const page = body.get("page") as string;
  const pageNumber = parseInt(page || "1");
  const findContent = bookContent[pageNumber - 1];
  if (findContent.solution === userSolution) {
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

export default function Home({ loaderData }: Route.ComponentProps) {
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
      <h1 className="text-3xl font-bold mb-4">Aprende Braille junto a Luis y braillinda</h1>
      <div className="mb-8">
        <p>Las personas que ven pueden aprender el sistema braille sin gran esfuerzo, pero leyéndolo visualmente.</p>
        <p>Animamos a todos a empezar a aprenderlo de forma muy sencilla. Con este curso interactivo utilizando el libro &quot;Luis y Braillinda te cuentan cómo es el Braille&quot; de Carmen Roig.</p>
        <p>Este libro es una obra de la ONCE que se distribuye de forma gratuita.</p>
        <p>Lo podeis descargar en formato PDF desde el siguiente enlace: <a className="link" href="https://www.once.es/servicios-sociales/braille/aprender-braille" target="_blank" rel="noreferrer">Luis y Braillinda te cuentan cómo es el Braille</a> o saber más sobre el braille en la web de la <a className="link" href="https://www.once.es/servicios-sociales/braille" target="_blank" rel="noreferrer" aria-label="Braille web de la Once (Nueva pestaña)">ONCE</a>.</p>
      </div>
      <h2 className="text-xl font-bold mb-4">Historia</h2>
      <nav className="mb-6">
        <ul className="list-none flex gap-2">
          <li>
            <Button asChild variant="outline">
              <Link to={`/?page=${page}&dictionary=open`}>
                Diccionario
                <BookA />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline">
              <Link to={`/?page=${page}&log=open`}>
                Historico
                <History />
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
      <Avatars author={content.author} />
      <Message message={content.message} author={content.author}>
        {content.exercise ? (
          <ExerciseForm pageNumber={page} />
        ): (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to={`/?page=${page - 1}`} preventScrollReset>Volver</Link>
            </Button>
            <Button asChild>
              <Link to={`/?page=${page + 1}`} preventScrollReset>Continuar</Link>
            </Button>
          </div>
        )}
      </Message>
      <Log isOpen={!!log} onClose={handleClose('log')} content={fullContent} />
      <Dictionary isOpen={!!dictionary} onClose={handleClose('dictionary')} />
    </div>
  );
}
