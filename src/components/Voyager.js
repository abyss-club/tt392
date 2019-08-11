import React from 'react';
import styled from 'styled-components';
import 'graphql-voyager/dist/voyager.css';
import { Voyager } from 'graphql-voyager';

import Config from 'config';

/* because Nav's height is 3rem, TODO: not use hard code */
const Wrapper = styled.div`
  height: calc(100vh - 3.5rem);
  overflow-y: hidden;
`;

/* eslint-disable-next-line jsdoc/require-jsdoc */
function introspectionProvider(query) {
  return fetch(`${Config.apiPrefix}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    mode: 'cors',
    credentials: 'include',
  }).then(response => response.json());
}

// function loadWorker(path, relative) {
//   const url = relative ? `${__dirname}/${path}` : path;
//   return fetch(url, {
//     mode: 'cors',
//     credentials: 'include',
//   })
//     .then(response => response.text())
//     .then((payload) => {
//     // HACK: to increase viz.js memory size from 16mb to 128mb
//     // should use response.blob()
//       payload = payload.replace('||16777216;', '||134217728;');
//       const script = new Blob([payload], { type: 'application/javascript' });
//       const url = URL.createObjectURL(script);
//       return new Worker(url);
//     });
// }

const GQLVoyager = () => (
  <Wrapper>
    <Voyager
      workerURI={`${process.env.PUBLIC_URL}/voyager.worker.js`}
      introspection={introspectionProvider}
    />
  </Wrapper>
);

export default GQLVoyager;
