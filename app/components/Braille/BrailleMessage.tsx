import { BrailleCharacter } from "./BrailleCharacter";

interface Props {
  message: string;
}

export const BrailleMessage = ({ message }: Props) => {
  return (
    <span className="flex gap-1 flex-wrap" aria-label={message}>
      {message.split(' ').map((value, index) => (
        <span key={index} className="flex gap-1">
          {value.split('').map((char, charIndex) => (
            <BrailleCharacter key={charIndex} character={char.toLowerCase()} />
          ))}
          {index < message.split(' ').length - 1 && (
            <span className="block w-10 rounded-md" />
          )}
        </span>
      ))}
    </span>
  );
};
