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

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      if (state.initialized) return state;
      return {
        ...state,
        initialized: true,
      };
    }
    case 'INIT_WITH_LOGIN': {
      const { profile } = action;
      return {
        ...state,
        initialized: true,
        profile: {
          isSignedIn: (profile.email || '') !== '',
          email: profile.email || '',
          name: profile.name || '',
        },
      };
    }
    case 'SET_NAME': {
      const { name } = action;
      return {
        ...state,
        profile: {
          ...state.profile,
          name,
        },
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

const LoginProvider = ({ children }) => (
  <LoginContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </LoginContext.Provider>
);
LoginProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginContext;
export { LoginProvider };
