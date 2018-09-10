import React from 'react';

const Plus = props => (
  <svg viewBox="0 0 12 12" fill="none" width="1em" height="1em" {...props}>
    <rect y={5} width={12} height={2} rx={1} fill="#323232" />
    <rect
      x={7}
      width={12}
      height={2}
      rx={1}
      transform="rotate(90 7 0)"
      fill="#323232"
    />
  </svg>
);

export default Plus;
