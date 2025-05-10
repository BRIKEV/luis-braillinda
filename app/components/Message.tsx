import React, { type ReactNode } from 'react';

interface MessageProps {
  author: string;
  children?: ReactNode[] | ReactNode;
  parts: (string | ReactNode)[];
}

const getAuthorStyles = (author: string) => {
  switch (author) {
    case 'Luis':
      return 'bg-violet-700 text-white text-left';
    case 'Braillinda':
      return 'bg-pink-700 text-white text-right';
    case 'Tu turno':
      return 'bg-green-700 text-white text-left';
    default:
      return 'bg-gray-200 text-black text-left';
  }
}

const Message: React.FC<MessageProps> = ({ author, parts, children }) => {
  const authorStyles = getAuthorStyles(author);
  return (
    <div>
      <div className="bg-white rounded-md shadow-lg border border-gray-300 mb-2">
        <h3 className={`text-lg font-bold rounded-tl-md rounded-tr-md px-5 py-2 ${authorStyles}`}>{author}</h3>
        <div className="p-5">
          <p className="mb-2">{parts}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Message;