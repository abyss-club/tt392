import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const NotiContext = createContext({});

const initialState = {
  unreadNotiCount: {
    system: null,
    replied: null,
    quoted: null,
  },
};

const NotiProvider = ({ reducer, children }) => (
  <NotiContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </NotiContext.Provider>
);
NotiProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default NotiContext;
export { NotiProvider };
