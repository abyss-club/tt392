import React from 'react';
import GQL from 'graphiql';

import 'graphiql/graphiql.css';
import Config from '../config';

function graphQLFetcher(graphQLParams) {
  return fetch(`${Config.apiPrefix}/graphql/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
    mode: 'cors',
    // credentials: 'include',
  }).then(response => response.json());
}

const GraphiQL = () => (
  <GQL fetcher={graphQLFetcher} />
);

export default GraphiQL;
