import { dictionary } from "./dictionary";

interface Props {
  character: string;
}

export const BrailleCharacter = ({ character }: Props) => {
  const braille = dictionary[character];
  if (!braille) {
    return <span>Invalid character</span>;
  }
  return (
    <span className="block w-10 border border-solid border-black rounded-md" aria-label={character}>
      <span className="grid grid-cols-2 grid-rows-[repeat(3,20px)] justify-items-center items-center">
        {braille.split('').map((value, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${value !== '-' ? 'bg-black': ''}`}
          />
        ))}
      </span>
    </span>
  );
};
