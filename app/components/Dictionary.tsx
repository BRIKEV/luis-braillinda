import { Dialog } from "./Dialog";
import { dictionary } from "./Braille/dictionary";
import { BrailleCharacter } from "./Braille/BrailleCharacter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Dictionary({ isOpen, onClose }: Props) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Diccionario</h2>
      <div className="grid grid-cols-6 gap-4">
        {Object.keys(dictionary).map((key) => (
          <div key={key}>
            <p>{key}</p>
            <BrailleCharacter character={key} />
          </div>
        ))}
      </div>
    </Dialog>
  );
}
