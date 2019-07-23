import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const ScrollToContext = createContext({});

const initialState = {
  active: false,
  id: '',
};

const ScrollToProvider = ({ reducer, children }) => (
  <ScrollToContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ScrollToContext.Provider>
);
ScrollToProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const StoreConsumer = StoreContext.Consumer;

export default ScrollToContext;
export { ScrollToProvider };
