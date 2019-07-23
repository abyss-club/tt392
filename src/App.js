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
import Error from 'components/Error';
import TagSelector from 'components/TagPage/TagSelector';
import TagView from 'components/TagPage/TagView';
import Notification from 'components/Notification';
import NavTags from 'components/Navbar/NavTags';
import { Loading, LoadingContainer } from 'utils/loading';
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
    <Route render={({ location }) => !location.pathname.startsWith('/error') && (
      <>
        <Init />
        <Navbar />
      </>
    )}
    />
    <Route path="/error/:errCode" component={Error} />
    <Route path={['/', '/thread/:id']} exact component={NavTags} />
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/sign_in/" component={SignIn} exact />
      <Route path="/profile/" component={Profile} exact />
      <Route path="/tags/" component={TagSelector} exact />
      <Route path="/tag/:slug" component={TagView} exact />
      <Route path="/thread/:id" component={ThreadView} exact />
      <Route path="/notification/" component={Notification} exact />
      <Route path="/draft/:mode" component={Draft} exact />
      <Route path="/graphiql/" component={GraphiQL} exact />
      <Route path="/voyager/" component={GQLVoyager} exact />
      <Route component={Error} />
    </Switch>
  </Wrapper>
);

export default App;
