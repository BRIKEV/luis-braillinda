import React from 'react';
import { BrailleMessage } from './Braille/BrailleMessage';

interface MessageProps {
  message: string;
}

const pattern = /<BRAILLE>([a-zA-Z]+)<\/BRAILLE>/g;

const Message: React.FC<MessageProps> = ({ message }) => {
  const parts: (string | JSX.Element)[] = [];
  // Split the message based on the pattern
  let lastIndex = 0;
  message.replace(pattern, (match, characters, index) => {
    // Add the text before the matched pattern
    
    parts.push(message.substring(lastIndex, index));

    // Add the BrailleMessage component
    parts.push(<BrailleMessage key={index} message={characters.toLowerCase()} />);

    // Update lastIndex to the end of the matched pattern
    lastIndex = index + match.length;

    // Return an empty string (to keep the original text unchanged)
    return '';
  });
  parts.push(message.substring(lastIndex));

  return (
    <div>
      <p>{parts}</p>
    </div>
  );
};

export default Message;