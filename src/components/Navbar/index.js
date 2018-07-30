import React from 'react';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';

import NavUtils from './NavUtils';
import NavTags from './NavTags';

const NavWrapper = styled.nav`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: .2em;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const NavTitle = styled.div`
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight: 700;
  font-size: 2em;
`;

const NavFirstRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 100%;
  padding-bottom: .25em;
  > a {
    text-decoration: none;
    color: black;
  }
`;

const Navbar = () => (
  <NavWrapper>
    <NavFirstRow>
      <Link to="/">
        <NavTitle>abyss</NavTitle>
      </Link>
      <NavUtils />
    </NavFirstRow>
    <Route path="/" component={NavTags} exact />
  </NavWrapper>
);

export default Navbar;
