import { ApolloClient } from 'apollo-client';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import config from 'config';

export default new ApolloClient({
  link: ApolloLink.from([
    onError(({
      forward, graphQLErrors, networkError, operation,
    }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          /* eslint-disable */
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          /* eslint-enable */
          // TODO: global error components
        });
      }
      if (networkError) {
        if (networkError.statusCode >= 500) {
          window.location = '/error/NETWORK_ERROR';
        }
        forward(operation);
      }
    }),
    new HttpLink({
      uri: `${config.apiPrefix}/graphql`,
      credentials: 'include',
      fetchOptions: {
        mode: 'cors',
      },
    }),
  ]),
  cache: new InMemoryCache({
    dataIdFormObject: (object) => {
      // eslint-disable-next-line no-underscore-dangle
      switch (object.__typename) {
        case 'User': return object.email;
        case 'Thread': return object.id;
        case 'Post': return object.id;
        default: return defaultDataIdFromObject(object);
      }
    },
  }),
});
