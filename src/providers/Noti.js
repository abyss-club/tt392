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

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTI_COUNT': {
      const { system, replied, quoted } = action;
      return {
        ...state,
        unreadNotiCount: {
          system: system || 0,
          replied: replied || 0,
          quoted: quoted || 0,
        },
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

const NotiProvider = ({ children }) => (
  <NotiContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </NotiContext.Provider>
);
NotiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotiContext;
export { NotiProvider };
