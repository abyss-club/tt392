import React from 'react';
import styled from 'styled-components';
import { Switch, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import faLib from 'utils/fontAwesomeLib';

import GraphiQL from 'components/GraphiQL';
import GQLVoyager from 'components/Voyager';
import Profile from 'components/Profile';
import Home from 'views/Home';

faLib.loadFa();

const Wrapper = styled.div`
  height: 100%;
`;

const IndexWrapper = styled.div`
  margin: 0 16px;
  @media (min-width: 992px) {
    max-width: 960px;
    margin: auto;
  }
`;

const Index = () => (
  <IndexWrapper>
    <h2>Welcome to Abyss! </h2>
    <p><FontAwesomeIcon icon="check-square" />本站尚处于开发初期</p>
    <p>后端由 <a href="https://gitlab.com/abyss.club/uexky">uexky</a> 项目驱动</p>
    <p>前端由 <a href="https://gitlab.com/abyss.club/tt392">tt392</a> 项目驱动</p>
    <br />
    <p>目前尚无法通过交互式界面使用 abyss，所幸我们使用的是 GraphQL API
      ( <a href="https://graphql.org/">了解 GraphQL</a> )，
    你可以点击下面的链接，使用 GraphiQL 工具，交互地通过 API 使用本站。
    </p>
    <Link to="/graphiql/"> GraphiQL </Link>
    <p>你可以点击下面的链接，使用 GraphQL Voyager 探索 API schema。</p>
    <Link to="/voyager/"> GraphQL Voyager </Link>
    <p>This is your logged in profile page</p>
    <Link to="/profile"> Profile </Link>
    <p>GraphQL API 本身具有自省的功能，但如果你想看的话，schema <a href="">在此</a></p>
  </IndexWrapper>
);

const App = () => (
  <Wrapper>
    <Switch>
      <Route path="/" component={Index} exact />
      <Route path="/home/" component={Home} />
      <Route path="/graphiql/" component={GraphiQL} />
      <Route path="/voyager/" component={GQLVoyager} />
      <Route path="/profile/" component={Profile} />
    </Switch>
  </Wrapper>
);

export default App;
