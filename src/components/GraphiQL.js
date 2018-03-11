import React from 'react';
import GQL from 'graphiql';
import fetch from 'isomorphic-fetch';

import 'graphiql/graphiql.css';

function graphQLFetcher(graphQLParams) {
  return fetch('/api/graphql/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

const GraphiQL = () => (
  <GQL fetcher={graphQLFetcher} />
);

export default GraphiQL;
