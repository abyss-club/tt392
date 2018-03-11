import React from 'react';
import styled from 'styled-components';
import { Switch, Route, Link } from 'react-router-dom';

import GraphiQL from './components/GraphiQL';

const Wrapper = styled.div`
  height: 100%;
`;

const Index = () => (
  <div>
    <h2> TT392 </h2>
    <Link to="/graphiql/"> GraphiQL </Link>
  </div>
);

const App = () => (
  <Wrapper>
    <Switch>
      <Route path="/" component={Index} exact />
      <Route path="/graphiql/" component={GraphiQL} />
    </Switch>
  </Wrapper>
);

export default App;
