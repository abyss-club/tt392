import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import faLib from 'utils/fontAwesomeLib';

import GraphiQL from 'components/GraphiQL';
import GQLVoyager from 'components/Voyager';
import Profile from 'components/Profile';
import Navbar from 'components/Navbar';
import Home from 'components/Home';
import SignIn from 'components/SignIn';
import ThreadView from 'components/ThreadView';
import Draft from 'components/Draft';

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
        <Route path="/sign_in/" component={SignIn} />
        <Route path="/profile/" component={Profile} />
        <Route path="/thread/:id" component={ThreadView} />
        <Route path="/draft/:mode" component={Draft} />
      </Switch>
    </MainContent>
    <Switch>
      <Route path="/graphiql/" component={GraphiQL} />
      <Route path="/voyager/" component={GQLVoyager} />
    </Switch>
  </Wrapper>
);

export default App;
