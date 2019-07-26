import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const CatalogContext = createContext({});

const initialState = {
  threadView: new Map(),
};

const CatalogProvider = ({ reducer, children }) => (
  <CatalogContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </CatalogContext.Provider>
);
CatalogProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const CatalogConsumer = CatalogContext.Consumer;

export default CatalogContext;
export { CatalogProvider };
