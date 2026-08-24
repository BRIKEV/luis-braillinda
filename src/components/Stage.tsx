import type { Entry, Expression, Who } from "../data/content";

/* Vite resolves these at build time; the maps let content.ts name assets as
   plain strings instead of every route importing every sprite. */
const sprites = import.meta.glob("../images/characters/*/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const backdrops = import.meta.glob("../images/backgrounds/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const NAMES: Record<Who, string> = {
  braillinda: "El hada Braillinda",
  luis: "El maestro Luis",
  abuela: "La abuela de Braillinda",
};

/** Used when an entry does not name an expression. */
const DEFAULT_AS: Record<Who, Expression> = {
  braillinda: "curious",
  luis: "explaining",
  abuela: "thoughtful",
};

/* Braillinda is a fairy: smaller than the adults, and she floats rather than
   standing, so she sits higher off the floor. */
const FIGURE: Record<Who, string> = {
  braillinda: "h-[50%] sm:h-[48%] max-h-[62vh] bottom-[17%] sm:bottom-[15%]",
  luis: "h-[64%] sm:h-[56%] max-h-[72vh] bottom-[2%]",
  abuela: "h-[58%] sm:h-[52%] max-h-[68vh] bottom-[8%]",
};

/** Which slot the speaker occupies, so the stage knows who to light. */
const AUTHOR_IS: Record<string, Who> = {
  braillinda: "braillinda",
  luis: "luis",
  abuela: "abuela",
};

type Lit = "speaking" | "listening" | "ambient";

/* Never dim with `opacity`: it makes the backdrop show through the character
   and they read as a ghost rather than as someone standing in shadow. Push
   them back with brightness and saturation instead, which keeps them solid. */
const LIGHTING: Record<Lit, string> = {
  speaking: "z-[2] scale-100 drop-shadow-[0_12px_30px_rgba(20,14,8,0.45)]",
  listening: "z-[1] scale-[0.94] brightness-[0.66] saturate-[0.72] contrast-[0.95]",
  /* Narration and exercises: no-one is talking, so no-one is pushed back. */
  ambient: "z-[1] scale-[0.97] brightness-[0.88] saturate-[0.94]",
};

const Figure = ({ who, as, side, lit }: {
  who: Who;
  as: Expression | undefined;
  side: "left" | "right";
  lit: Lit;
}) => {
  const expression = as ?? DEFAULT_AS[who];
  const src = sprites[`../images/characters/${who}/${expression}.webp`];

  if (!src) {
    // A typo in `leftAs`/`rightAs` would otherwise make the character silently
    // vanish, which is a confusing thing to debug from the page alone.
    if (import.meta.env.DEV) {
      console.warn(`[Stage] no sprite for ${who}/${expression}.webp — check content.ts`);
    }
    return null;
  }

  return (
    <img
      src={src}
      alt={NAMES[who]}
      className={`pointer-events-none absolute w-auto max-w-[58%] object-contain
        transition-all duration-500 ease-out ${FIGURE[who]}
        ${side === "left" ? "left-[1%] sm:left-[6%]" : "right-[1%] sm:right-[6%]"}
        ${LIGHTING[lit]}`}
    />
  );
};

/**
 * The seen world: a full-bleed illustrated backdrop with the cast standing on
 * it. Fixed rather than scrolled, so long narration moves the panel over a
 * still scene instead of dragging the room up the screen.
 */
export default function Stage({ entry }: { entry: Entry }) {
  const speaker = AUTHOR_IS[entry.author.toLowerCase()] ?? null;
  const lightingFor = (who: Who): Lit =>
    speaker === null ? "ambient" : speaker === who ? "speaking" : "listening";

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-dusk-deep">
      <img
        key={entry.backdrop}
        src={backdrops[`../images/backgrounds/bg-${entry.backdrop}.webp`]}
        alt=""
        className="absolute inset-0 h-full w-full animate-[fade-in_600ms_ease-out] object-cover object-[50%_68%] sm:object-center"
      />

      {/* Warms the scene toward the palette and darkens the lower half so the
          dialogue panel always has something quiet to sit on. */}
      <div className="absolute inset-0 bg-gradient-to-b from-dusk-deep/35 via-transparent to-dusk-deep/80" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_28%,transparent_35%,rgba(27,46,47,0.55)_100%)]" />

      <div className="absolute inset-0">
        {entry.left && (
          <Figure who={entry.left} as={entry.leftAs} side="left" lit={lightingFor(entry.left)} />
        )}
        {entry.right && (
          <Figure who={entry.right} as={entry.rightAs} side="right" lit={lightingFor(entry.right)} />
        )}
      </div>
    </div>
  );
}
