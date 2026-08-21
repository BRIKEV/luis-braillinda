import React, { type ReactNode } from 'react';

interface MessageProps {
  author: string;
  children?: ReactNode[] | ReactNode;
  parts: (string | ReactNode)[];
}

const getAuthorStyles = (author: string) => {
  switch (author) {
    case 'Luis':
      return 'bg-speaker-luis text-speaker-luis-fg text-left';
    case 'Braillinda':
      return 'bg-speaker-braillinda text-speaker-braillinda-fg text-right';
    case 'Tu turno':
      return 'bg-speaker-turno text-speaker-turno-fg text-left';
    default:
      return 'bg-speaker-default text-speaker-default-fg text-left';
  }
}

const Message: React.FC<MessageProps> = ({ author, parts, children }) => {
  const authorStyles = getAuthorStyles(author);
  return (
    <div>
      <div className="bg-surface-card rounded-md shadow-lg border border-surface-border mb-2">
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