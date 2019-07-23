import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import App from 'App';
import client from 'providers/client';
import Store from 'providers/Store';
import * as serviceWorker from './serviceWorker';

import 'normalize.css';
import 'assets/css/fonts.css';

import './index.css';


const Root = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Store.Provider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Store.Provider>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.register();
