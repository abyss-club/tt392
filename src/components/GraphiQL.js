import React from 'react';
import styled from 'styled-components';
import GQL from 'graphiql';
import 'graphiql/graphiql.css';

import Config from 'config';

/* because Nav's height is 3rem, TODO: not use hard code */
const Wrapper = styled.div`
  height: calc(100vh - 3.5rem);
  overflow-y: hidden;
`;

function graphQLFetcher(graphQLParams) {
  return fetch(`${Config.apiPrefix}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
    mode: 'cors',
    credentials: 'include',
  }).then(response => response.json());
}

const GraphiQL = () => (
  <Wrapper>
    <GQL fetcher={graphQLFetcher} />
  </Wrapper>
);

export default GraphiQL;
