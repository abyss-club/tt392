import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const OffsetPosContext = createContext([]);
const OffsetPosProvider = ({ children }) => {
  const [posMap, setPosMap] = useState(new Map());
  return (
    <OffsetPosContext.Provider value={[posMap, setPosMap]}>
      {children}
    </OffsetPosContext.Provider>
  );
};
OffsetPosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OffsetPosContext;
export { OffsetPosProvider };
