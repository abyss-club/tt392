import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import faLib from 'utils/fontAwesomeLib';

import GraphiQL from 'components/GraphiQL';
import GQLVoyager from 'components/Voyager';
import Profile from 'components/Profile';
import Navbar from 'components/Navbar';
import Home from 'components/Home';

import MainContent from 'styles/MainContent';

faLib.loadFa();

const Wrapper = styled.div`
  height: 100%;
`;

const App = () => (
  <Wrapper>
    <Navbar />
    <MainContent>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/graphiql/" component={GraphiQL} />
        <Route path="/voyager/" component={GQLVoyager} />
        <Route path="/profile/" component={Profile} />
      </Switch>
    </MainContent>
  </Wrapper>
);

export default App;
