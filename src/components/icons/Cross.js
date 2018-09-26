import React from 'react';

const Cross = props => (
  <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
    <path
      d="M4 20L20 4M20 20L4 4"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Cross;
