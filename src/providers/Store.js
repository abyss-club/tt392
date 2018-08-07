import React from 'react';
import PropTypes from 'prop-types';

const { Provider, Consumer } = React.createContext();
const store = {
  tags: {
    mainTags: [],
    subscribled: [],
  },
};

const StoreProvider = ({ children }) => (
  <Provider value={store}>
    {children}
  </Provider>
);
StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default {
  Provider: StoreProvider,
  Consumer,
};
