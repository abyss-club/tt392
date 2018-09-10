import React from 'react';

const ChatBubble = props => (
  <svg viewBox="0 0 20 18" fill="none" width="1em" height="1em" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.085 17.26L1 12.562l-.46-.968a8.036 8.036 0 0 1-.487-2.761c0-4.855 4.345-8.79 9.706-8.79s9.707 3.935 9.707 8.79c0 4.855-4.346 8.79-9.707 8.79-1.59 0-3.091-.346-4.416-.96l-.682-.344-4.576.94z"
      fill="#fff"
    />
  </svg>
);

export default ChatBubble;
