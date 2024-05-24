import React, { ReactNode } from 'react';
import { BrailleMessage } from './Braille/BrailleMessage';
import luisImage from '../images/luis.png';
import braillindaImage from '../images/braillinda.png';

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
    <div>
      <div className="flex">
        <img className={`w-1/2 ${author.toLowerCase() === 'luis' ? 'opacity-100': 'opacity-70'}`} src={luisImage} alt="Maestro luis" />
        <img className={`w-1/2 ${author.toLowerCase() === 'braillinda' ? 'opacity-100' : 'opacity-70'}`} src={braillindaImage} alt="Hada braillinda" />
      </div>
      <div className="bg-white rounded-md shadow-lg border border-gray-300 mb-2">
        <h2 className="text-lg font-bold bg-violet-700 text-white rounded-tl-md rounded-tr-md px-5 py-2">{author}:</h2>
        <div className="p-5">
          <p className="mb-2">{parts}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Message;