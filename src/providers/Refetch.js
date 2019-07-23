import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const RefetchContext = createContext({});

const initialState = {
  threadList: false,
};

const RefetchProvider = ({ reducer, children }) => (
  <RefetchContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </RefetchContext.Provider>
);
RefetchProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const StoreConsumer = StoreContext.Consumer;

export default RefetchContext;
export { RefetchProvider };
