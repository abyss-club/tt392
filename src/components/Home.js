import React from 'react';

import ThreadList from 'components/ThreadList';
import PreviewInfo from 'components/PreviewInfo';
import MainContent from 'styles/MainContent';

const Home = () => (
  <MainContent>
    <PreviewInfo />
    <ThreadList type="home" />
  </MainContent>
);

export default Home;
