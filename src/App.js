import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';

import faLib from 'utils/fontAwesomeLib';

import Profile from 'components/Profile';
import Navbar from 'components/Navbar';
import Home from 'components/Home';
import SignIn from 'components/SignIn';
import ThreadView from 'components/ThreadView';
import Draft from 'components/Draft';
import Init from 'components/Init';
import TagPage from 'components/TagPage';
import { Loading, LoadingContainer } from 'utils/loading';
import { ModalContainer } from 'utils/modal';

faLib.loadFa();

const Wrapper = styled.div`
  height: 100%;
`;

const GraphiQL = Loadable({
  loader: () => import('components/GraphiQL'),
  loading: Loading,
});

const GQLVoyager = Loadable({
  loader: () => import('components/Voyager'),
  loading: Loading,
});

const App = () => (
  <Wrapper>
    <LoadingContainer />
    <ModalContainer />
    <Init />
    <Navbar />
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/sign_in/" component={SignIn} />
      <Route path="/profile/" component={Profile} />
      <Route path="/tags/" component={TagPage} />
      <Route path="/thread/:id" component={ThreadView} />
      <Route path="/draft/:mode" component={Draft} />
      <Route path="/graphiql/" component={GraphiQL} />
      <Route path="/voyager/" component={GQLVoyager} />
    </Switch>
  </Wrapper>
);

export default App;
