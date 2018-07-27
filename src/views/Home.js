import React from 'react';
import styled from 'styled-components';

import Navbar from 'components/Navbar';
import ThreadList from 'components/ThreadList';

const HomeWrapper = styled.div`

`;

const Home = () => (
  <React.Fragment>
    <Navbar />
    <ThreadList />
  </React.Fragment>
);

export default Home;
