import React from 'react';
import styled from 'styled-components';

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
`;

const Navbar = () => (
  <NavWrapper>
    <NavFirstRow>
      <NavTitle>Abyss</NavTitle>
      <NavUtils />
    </NavFirstRow>
    <NavTags />
  </NavWrapper>
);

export default Navbar;
