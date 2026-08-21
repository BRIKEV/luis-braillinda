import React, { type ReactNode } from 'react';

interface MessageProps {
  author: string;
  children?: ReactNode[] | ReactNode;
  parts: (string | ReactNode)[];
}

/* Narration has no chip: it is a different register, not a character with a
   name tag. Everyone else is coloured from their own artwork. */
const chipStyles = (author: string) => {
  switch (author.toLowerCase()) {
    case 'luis':
      return 'bg-speaker-luis text-ink';
    case 'braillinda':
      return 'bg-speaker-braillinda text-ink';
    case 'abuela':
      return 'bg-speaker-abuela text-ink';
    case 'tu turno':
      return 'bg-speaker-turno text-parchment';
    default:
      return null;
  }
};

const Message: React.FC<MessageProps> = ({ author, parts, children }) => {
  const chip = chipStyles(author);

  return (
    <div className="paper rounded-card shadow-paper relative mb-3 p-5 sm:p-6">
      {chip ? (
        <h3
          className={`${chip} mb-3 inline-block rounded-full px-3.5 py-1 font-sans text-sm font-bold`}
        >
          {author}
        </h3>
      ) : (
        <h3 className="sr-only">{author}</h3>
      )}
      <p className={chip ? 'text-lg' : 'text-lg italic'}>{parts}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
};

export default Message;
