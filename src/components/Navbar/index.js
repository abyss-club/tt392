import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Link, Switch, withRouter } from 'react-router-dom';

import Store from 'providers/Store';
import MainContent from 'styles/MainContent';
import AbyssLogo from 'components/icons/AbyssLogo';
import Tick from 'components/icons/Tick';
import colors from 'utils/colors';

import NavTags from './NavTags';
import SignInBtn from './SignInBtn';

const Wrapper = styled.div`
  width: 100%;
`;

const NavWrapper = styled.nav`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0 1rem;
`;

const NavFirstRow = styled.div`
  height: 3.5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  > a {
    text-decoration: none;
    color: black;
  }
`;

const NavTitle = styled(AbyssLogo)`
  font-size: 1em;
`;

const TickBtnWrapper = styled.button`
  background-color: ${colors.buttonBgBlack};
  font-size: 1em;
  border: 0;
  outline: 0;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  line-height: 0;
  cursor: pointer;
  > svg {
    > path {
      stroke: white;
    }
  }
`;

const TickBtn = ({ onClick }) => (
  <TickBtnWrapper onClick={onClick}>
    <Tick />
  </TickBtnWrapper>
);
TickBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
};


const Navbar = ({ profile, history }) => (
  <Wrapper>
    <MainContent>
      <NavWrapper>
        <NavFirstRow>
          <Link to="/">
            <NavTitle />
          </Link>
          <Switch>
            <Route path="/tags" exact render={() => <TickBtn onClick={() => { history.push('/'); }} />} />
            <Route path="/" render={() => <SignInBtn profile={profile || {}} />} />
          </Switch>
        </NavFirstRow>
        <Route path="/" exact component={NavTags} />
        <Route path="/thread/:id" exact component={NavTags} />
      </NavWrapper>
    </MainContent>
  </Wrapper>
);
Navbar.propTypes = {
  profile: PropTypes.shape().isRequired,
  history: PropTypes.shape({}).isRequired,
};

const NavbarWithRouter = withRouter(Navbar);

export default () => (
  <Store.Consumer>
    {({ profile, tags }) => (
      <NavbarWithRouter
        profile={profile}
        tags={tags}
      />
    )}
  </Store.Consumer>
);
