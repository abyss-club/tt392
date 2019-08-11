import React from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router-dom';

const cosmeticHistory = createBrowserHistory();

const CosmeticRouterContext = React.createContext({});

export const HookedCosmeticRouter = ({ children }) => (
  <Router history={cosmeticHistory}>
    <Route>
      {routeProps => (
        <CosmeticRouterContext.Provider value={routeProps}>
          {children}
        </CosmeticRouterContext.Provider>
      )}
    </Route>
  </Router>
);

HookedCosmeticRouter.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function useCosmeticRouter() {
  return React.useContext(CosmeticRouterContext);
}
