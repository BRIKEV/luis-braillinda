import { BrailleCharacter } from "./BrailleCharacter";

interface Props {
  message: string;
}

export const BrailleMessage = ({ message }: Props) => {
  return (
    <span className="flex" aria-label={message}>
      {message.split('').map((value, index) => (
        <BrailleCharacter key={index} character={value.toLowerCase()} />
      ))}
    </span>
  );
};
