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
const jumpLinePattern = /<br>/g;

const Messages: React.FC<MessageProps> = ({ author, message, children }) => {
  const parts: (string | ReactNode)[] = [];
  // Split the message based on the pattern
  let lastIndex = 0;
  const matches = [...message.matchAll(pattern)];

  matches.forEach((match, index) => {
    const [fullMatch, characters] = match;
    const matchIndex = match.index || 0;

    // Add the text before the matched pattern
    if (lastIndex < matchIndex) {
      parts.push(message.substring(lastIndex, matchIndex));
    }

    // Add the BrailleMessage component
    parts.push(<BrailleMessage key={`braille-${index}`} message={characters.toLowerCase()} />);

    // Update lastIndex to the end of the matched pattern
    lastIndex = matchIndex + fullMatch.length;
  });

  // Add any remaining text after the last match
  if (lastIndex < message.length) {
    parts.push(message.substring(lastIndex));
  }

  // Split message by <br> tag and handle line breaks
  const partsWithLineBreaks: (string | ReactNode)[] = parts.flatMap((part, index) => {
    if (typeof part === 'string') {
      return part.split(jumpLinePattern).flatMap((splitPart, splitIndex, array) => {
        const elements: (string | ReactNode)[] = [];
        // Add the split part
        if (splitPart) elements.push(splitPart);
        // Add a line break if it's not the last part
        if (splitIndex < array.length - 1) {
          elements.push(<br key={`line-break-${index}-${splitIndex}`} />);
        }
        return elements;
      });
    }
    return part;
  });
  
  return (
    <Message
      author={author}
      parts={partsWithLineBreaks}
    >
      {children}
    </Message>
  );
};

export default Messages;