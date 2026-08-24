import type { ExpressionOf, Who } from "../data/content";

/* Vite resolves these at build time; the map lets content.ts name sprites as
   plain strings instead of every route importing every file. */
const sprites = import.meta.glob("../images/characters/*/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const NAMES: Record<Who, string> = {
  braillinda: "El hada Braillinda",
  luis: "El maestro Luis",
  abuela: "La abuela de Braillinda",
};

/** Used when an entry does not name an expression. */
const DEFAULT_AS: { [W in Who]: ExpressionOf[W] } = {
  braillinda: "curious",
  luis: "explaining",
  abuela: "thoughtful",
};

/* Braillinda is a fairy: smaller than the adults, and she floats rather than
   standing, so she sits higher off the floor. */
const SIZE: Record<Who, string> = {
  braillinda: "h-[50%] sm:h-[48%] max-h-[62vh] bottom-[17%] sm:bottom-[15%]",
  luis: "h-[64%] sm:h-[56%] max-h-[72vh] bottom-[2%]",
  abuela: "h-[58%] sm:h-[52%] max-h-[68vh] bottom-[8%]",
};

export type Lit = "speaking" | "listening" | "ambient";

/* Never dim with `opacity`: it makes the backdrop show through the character
   and they read as a ghost rather than as someone standing in shadow. Push
   them back with brightness and saturation instead, which keeps them solid. */
const LIGHTING: Record<Lit, string> = {
  speaking: "z-[2] scale-100 drop-shadow-[0_12px_30px_rgba(20,14,8,0.45)]",
  listening: "z-[1] scale-[0.94] brightness-[0.66] saturate-[0.72] contrast-[0.95]",
  /* Narration and exercises: no-one is talking, so no-one is pushed back. */
  ambient: "z-[1] scale-[0.97] brightness-[0.88] saturate-[0.94]",
};

interface Props {
  who: Who;
  as?: ExpressionOf[Who];
  side: "left" | "right";
  lit: Lit;
}

/** One character standing on the stage. */
export default function Figure({ who, as, side, lit }: Props) {
  const expression = as ?? DEFAULT_AS[who];

  return (
    <img
      src={sprites[`../images/characters/${who}/${expression}.webp`]}
      alt={NAMES[who]}
      className={`pointer-events-none absolute w-auto max-w-[58%] object-contain
        transition-all duration-500 ease-out ${SIZE[who]}
        ${side === "left" ? "left-[1%] sm:left-[6%]" : "right-[1%] sm:right-[6%]"}
        ${LIGHTING[lit]}`}
    />
  );
}
