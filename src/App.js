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
import TagView from 'components/TagPage/TagView';
import Notification from 'components/Notification';
import NavTags from 'components/Navbar/NavTags';
import { Loading, LoadingContainer } from 'utils/loading';
import { ModalContainer } from 'utils/modal';
import ScrollContainer from 'utils/scroll';
import colors from 'utils/colors';

faLib.loadFa();

const Wrapper = styled.div`
  min-height: 100vh;
  color: ${colors.regularBlack};
  background-color: ${colors.mainBg};
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
    <Route path="/" exact component={NavTags} />
    <Route path="/thread/:id" exact component={NavTags} />
    <ScrollContainer />
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/sign_in/" component={SignIn} />
      <Route path="/profile/" component={Profile} />
      <Route path="/tags/" component={TagPage} />
      <Route path="/tag/:slug" component={TagView} />
      <Route path="/thread/:id" component={ThreadView} />
      <Route path="/draft/:mode" component={Draft} />
      <Route path="/graphiql/" component={GraphiQL} />
      <Route path="/voyager/" component={GQLVoyager} />
      <Route path="/notification/" component={Notification} />
    </Switch>
  </Wrapper>
);

export default App;
