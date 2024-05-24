import React, { ReactNode } from 'react';
import { BrailleMessage } from './Braille/BrailleMessage';

interface MessageProps {
  message: string;
  author: string;
  children?: ReactNode[] | ReactNode;
}

const pattern = /<BRAILLE>([a-zA-Z]+)<\/BRAILLE>/g;

const Message: React.FC<MessageProps> = ({ author, message, children }) => {
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
    <div className="bg-white rounded-md shadow-lg border border-gray-300 p-5 mb-2">
      <p className="text-lg font-bold">{author}:</p>
      <p className="mb-2">{parts}</p>
      {children}
    </div>
  );
};

export default Message;