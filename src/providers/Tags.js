import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const TagsContext = createContext({});

const initialState = {
  tags: {
    mainTags: new Set(),
    subTags: new Set(),
    subscribed: {
      main: new Set(),
      sub: new Set(),
    },
  },
};

const TagsProvider = ({ reducer, children }) => (
  <TagsContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </TagsContext.Provider>
);
TagsProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// const StoreConsumer = StoreContext.Consumer;

export default TagsContext;
export { TagsProvider };
