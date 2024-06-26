import React from 'react';

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return message ? <p>{message}</p> : null;
};

export default Message;
