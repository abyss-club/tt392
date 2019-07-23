import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const SliderContext = createContext({});

const initialState = {
  loc: 0,
  max: 0,
};

const SliderProvider = ({ reducer, children }) => (
  <SliderContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </SliderContext.Provider>
);
SliderProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const StoreConsumer = StoreContext.Consumer;

export default SliderContext;
export { SliderProvider };
