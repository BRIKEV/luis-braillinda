import React, { type ReactNode } from 'react';
import { BrailleMessage } from './Braille/BrailleMessage';
import Message from './Message';

interface MessageProps {
  message: string;
  author: string;
  children?: ReactNode[] | ReactNode;
  displayImage?: boolean;
}

const pattern = /<BRAILLE>([A-Za-z ]+)<\/BRAILLE>/g;

const Messages: React.FC<MessageProps> = ({ author, message, children }) => {
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
    <Message
      author={author}
      parts={parts}
    >
      {children}
    </Message>
  );
};

export default Messages;