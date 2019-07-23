import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const ScrollbarContext = createContext({});

const initialState = {
  threadView: {
    postId: '',
    createdAt: '',
  },
};

const ScrollbarProvider = ({ reducer, children }) => (
  <ScrollbarContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ScrollbarContext.Provider>
);
ScrollbarProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const StoreConsumer = StoreContext.Consumer;

export default ScrollbarContext;
export { ScrollbarProvider };
