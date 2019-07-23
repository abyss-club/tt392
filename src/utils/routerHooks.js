import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route } from 'react-router-dom';

const RouterContext = React.createContext({});

// FIXME: use official hooks API when https://github.com/ReactTraining/react-router/pull/6453 merged

export const HookedBrowserRouter = ({ children }) => (
  <BrowserRouter>
    <Route>
      {routeProps => (
        <RouterContext.Provider value={routeProps}>
          {children}
        </RouterContext.Provider>
      )}
    </Route>
  </BrowserRouter>
);

HookedBrowserRouter.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useRouter() {
  return React.useContext(RouterContext);
}
