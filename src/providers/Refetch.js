import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const RefetchContext = createContext({});

const initialState = {
  threadList: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFETCH_THREADLIST': {
      const { status } = action;
      if (!!status === state.threadList) return state;
      return {
        ...state,
        threadList: !!status,
      };
    }
    case 'REFETCH_THREAD': {
      const { status } = action;
      if (!!status === state.thread) return state;
      return {
        ...state,
        thread: !!status,
      };
    }

    default:
      throw new Error('Invalid action type.');
  }
};

const RefetchProvider = ({ children }) => (
  <RefetchContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </RefetchContext.Provider>
);
RefetchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RefetchContext;
export { RefetchProvider };
