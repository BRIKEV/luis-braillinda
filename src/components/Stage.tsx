import type { Entry, Who } from "../data/content";
import Figure, { type Lit } from "./Figure";

const backdrops = import.meta.glob("../images/backgrounds/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/** Which character the current speaker is, so the stage knows who to light. */
const AUTHOR_IS: Record<string, Who> = {
  braillinda: "braillinda",
  luis: "luis",
  abuela: "abuela",
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
