import { bookContent } from "~/data/content";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aprende Braille junto a Luis y braillinda" },
    { name: "description", content: "Aprende Braille junto a Luis y braillinda" },
  ];
}

export default function Home() {
  return (
    <div className="max-w-full m-auto p-4 md:max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-4">Aprende Braille junto a Luis y braillinda</h1>
      <div className="mb-8">
        <p>Las personas que ven pueden aprender el sistema braille sin gran esfuerzo, pero leyéndolo visualmente.</p>
        <p>Animamos a todos a empezar a aprenderlo de forma muy sencilla. Con este curso interactivo utilizando el libro &quot;Luis y Braillinda te cuentan cómo es el Braille&quot; de Carmen Roig.</p>
        <p>Este libro es una obra de la ONCE que se distribuye de forma gratuita.</p>
        <p>Lo podeis descargar en formato PDF desde el siguiente enlace: <a className="link" href="https://www.once.es/servicios-sociales/braille/aprender-braille" target="_blank" rel="noreferrer">Luis y Braillinda te cuentan cómo es el Braille</a> o saber más sobre el braille en la web de la <a className="link" href="https://www.once.es/servicios-sociales/braille" target="_blank" rel="noreferrer" aria-label="Braille web de la Once (Nueva pestaña)">ONCE</a>.</p>
      </div>
      <Button asChild className="mb-4">
        <Link to="/story" viewTransition>
          Comenzar la historia
        </Link>
      </Button>
    </div>
  );
}
