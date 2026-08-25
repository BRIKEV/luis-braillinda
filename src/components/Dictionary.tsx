import { Dialog } from "./Dialog";
import { dictionary } from "./Braille/dictionary";
import { BrailleCharacter } from "./Braille/BrailleCharacter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/** Signs that are not letters have nothing to print as their own caption. */
const NAMES: Record<string, string> = { "^": "mayúscula" };

export default function Dictionary({ isOpen, onClose }: Props) {
  const letters = Object.keys(dictionary);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Diccionario">
      <p className="mb-5 text-ink/70">
        Los {letters.length} signos que Luis y Braillinda han inventado hasta ahora.
      </p>
      <ul className="grid grid-cols-4 gap-4 sm:grid-cols-6">
        {letters.map((letter) => (
          <li key={letter} className="flex flex-col items-center gap-2">
            <BrailleCharacter character={letter} size="lg" />
            <span
              className={`font-display font-semibold text-ink text-center ${
                NAMES[letter] ? "text-sm" : "text-xl"
              }`}
            >
              {NAMES[letter] ?? letter}
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
