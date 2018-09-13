import React from 'react';

import ThreadList from 'components/ThreadList';
import PreviewInfo from 'components/PreviewInfo';
import MainContent from 'styles/MainContent';

const Wrapper = MainContent.extend`
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
