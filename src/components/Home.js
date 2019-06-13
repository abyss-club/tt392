import React from 'react';

import styled from 'styled-components';
import ThreadList from 'components/ThreadList';
import PreviewInfo from 'components/PreviewInfo';
import MainContent from 'styles/MainContent';

const Wrapper = styled(MainContent)`
  display: flex;
  flex-flow: column;
`;

const Home = () => (
  <Wrapper>
    <PreviewInfo />
    <ThreadList type="home" />
  </Wrapper>
);

export default Home;
