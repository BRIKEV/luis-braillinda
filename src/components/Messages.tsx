import React, { type ReactNode } from 'react';
import Message from './Message';
import { parseMessage } from './parseMessage';

interface MessageProps {
  message: string;
  author: string;
  children?: ReactNode[] | ReactNode;
}

/** A message rendered as a standalone card. Used by the history dialog. */
const Messages: React.FC<MessageProps> = ({ author, message, children }) => (
  <Message author={author} parts={parseMessage(message, 'sm')}>
    {children}
  </Message>
);

export default Messages;
