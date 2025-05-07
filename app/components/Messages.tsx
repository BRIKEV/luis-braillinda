import React, { type ReactNode } from 'react';
import { BrailleMessage } from './Braille/BrailleMessage';

interface MessageProps {
  message: string;
  author: string;
  children?: ReactNode[] | ReactNode;
  displayImage?: boolean;
}

const pattern = /<BRAILLE>([a-zA-Z]+)<\/BRAILLE>/g;

const Message: React.FC<MessageProps> = ({ author, message, children }) => {
  const parts: (string | ReactNode)[] = [];
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
      <div className="bg-white rounded-md shadow-lg border border-gray-300 mb-2">
        <h3 className="text-lg font-bold bg-violet-700 text-white rounded-tl-md rounded-tr-md px-5 py-2">{author}:</h3>
        <div className="p-5">
          <p className="mb-2">{parts}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Message;