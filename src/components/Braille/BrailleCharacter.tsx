import { dictionary } from "./dictionary";
import type { BrailleMap } from "./alphabet";

interface Props {
  character: string;
  /** Which letters may be rendered. Defaults to the letters taught so far, so
   *  the story cannot silently show a sign the reader has not met yet. */
  map?: BrailleMap;
  /** Index within a word, used to stagger the embossing animation. */
  order?: number;
  size?: "sm" | "md" | "lg";
}

/* Sizes step up with the viewport: seven `lg` cells at their desktop width
   overflow a 360px phone, and a braille word must never break mid-cell. */
const sizes = {
  sm: { cell: "w-5 gap-y-0.5 p-0.5 sm:w-6 sm:p-1", dot: "size-1.5" },
  md: { cell: "w-7 gap-y-1 p-1 sm:w-8 sm:p-1.5", dot: "size-1.5 sm:size-2" },
  lg: { cell: "w-9 gap-y-1 p-1.5 sm:w-11 sm:gap-y-1.5 sm:p-2", dot: "size-2 sm:size-2.5" },
} as const;

export const BrailleCharacter = ({
  character,
  map = dictionary,
  order = 0,
  size = "md",
}: Props) => {
  const braille = map[character];
  const s = sizes[size];

  if (!braille) {
    return <span className="text-poppy text-sm">?</span>;
  }

  return (
    <span
      className={`braille-cell rounded-cell grid shrink-0 grid-cols-2 justify-items-center ${s.cell}`}
      aria-hidden="true"
    >
      {braille.split("").map((value, index) => (
        <span
          key={index}
          /* Capped: a 30-cell phrase must not take 1.7s to finish arriving.
             No dot ever waits longer than ~350ms. */
          style={{ animationDelay: `${Math.min(order, 8) * 35 + index * 15}ms` }}
          className={`animate-emboss rounded-full ${s.dot} ${
            value === "-" ? "braille-dot-empty" : "braille-dot-raised"
          }`}
        />
      ))}
    </span>
  );
};
