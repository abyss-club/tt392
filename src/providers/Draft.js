import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const DraftContext = createContext({});

const initialState = {
  anonymous: true,
  title: '',
  content: '',
  mainTag: '',
  subTags: new Set(),
  quoteIds: new Set(),
  threadId: '',
};

const DraftProvider = ({ reducer, children }) => (
  <DraftContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </DraftContext.Provider>
);
DraftProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const DraftConsumer = DraftContext.Consumer;

export default DraftContext;
export { DraftProvider };
