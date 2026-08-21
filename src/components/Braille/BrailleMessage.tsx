import { BrailleCharacter } from "./BrailleCharacter";
import type { BrailleMap } from "./alphabet";

interface Props {
  message: string;
  map?: BrailleMap;
  size?: "sm" | "md" | "lg";
}

const gaps = { sm: "gap-x-1 gap-y-1.5", md: "gap-x-1.5 gap-y-2", lg: "gap-x-2 gap-y-2.5" } as const;
const spaces = { sm: "w-3", md: "w-4", lg: "w-6" } as const;

export const BrailleMessage = ({ message, map, size = "md" }: Props) => {
  const words = message.split(" ");
  /* Runs across the whole phrase so dots emboss left-to-right, not per word. */
  let cell = 0;

  return (
    <span
      role="img"
      aria-label={`En braille: ${message}`}
      className={`inline-flex flex-wrap items-center align-middle ${gaps[size]}`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={`inline-flex ${gaps[size]}`}>
          {word.split("").map((char, charIndex) => (
            <BrailleCharacter
              key={charIndex}
              character={char.toLowerCase()}
              map={map}
              order={cell++}
              size={size}
            />
          ))}
          {wordIndex < words.length - 1 && (
            <span aria-hidden="true" className={`block ${spaces[size]}`} />
          )}
        </span>
      ))}
    </span>
  );
};
