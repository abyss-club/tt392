import React from 'react';

const Tick = props => (
  <svg viewBox="0 0 12 12" fill="none" width="1em" height="1em" {...props}>
    <path
      d="M1 6.878l2.903 3.081L10.601 3"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Tick;
