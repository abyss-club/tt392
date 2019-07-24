import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const LoadingContext = createContext({});

const initialState = {
  show: 0,
};

const LoadingProvider = ({ reducer, children }) => (
  <LoadingContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </LoadingContext.Provider>
);
LoadingProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const LoadingConsumer = LoadingContext.Consumer;

export default LoadingContext;
export { LoadingProvider };
