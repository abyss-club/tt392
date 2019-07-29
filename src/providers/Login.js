import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const LoginContext = createContext({});

const initialState = {
  initialized: false,
  profile: {
    isSignedIn: false,
    name: '',
    email: '',
  },
};

const LoginProvider = ({ reducer, children }) => (
  <LoginContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </LoginContext.Provider>
);
LoginProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default LoginContext;
export { LoginProvider };
