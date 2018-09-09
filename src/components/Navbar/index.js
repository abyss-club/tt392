import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';

import Store from 'providers/Store';
import MainContent from 'styles/MainContent';
import AbyssLogo from 'components/icons/AbyssLogo';

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

const Navbar = ({ profile }) => (
  <Wrapper>
    <MainContent>
      <NavWrapper>
        <NavFirstRow>
          <Link to="/">
            <NavTitle />
          </Link>
          <SignInBtn profile={profile || {}} />
        </NavFirstRow>
        <Route path="/" exact component={NavTags} />
      </NavWrapper>
    </MainContent>
  </Wrapper>
);
Navbar.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default () => (
  <Store.Consumer>
    {({ profile, tags }) => (
      <Navbar
        profile={profile}
        tags={tags}
      />
    )}
  </Store.Consumer>
);
