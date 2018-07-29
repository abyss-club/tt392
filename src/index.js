import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';

import App from 'App';
import Modal from 'components/Modal';
import registerServiceWorker from 'registerServiceWorker';

import 'normalize.css';
import 'assets/css/fonts.css';

import './index.css';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: 'http://api.uexky.com/graphql/',
      credentials: 'include',
      fetchOptions: {
        mode: 'cors',
      },
    }),
  ]),
  cache: new InMemoryCache(),
});

const Root = () => (
  <BrowserRouter>
    <Modal.Provider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Modal.Provider>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
