import React, {
  useState, useContext, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { breakpoint, maxWidth } from 'styles/MainContent';
import { PositionContext } from 'components/ThreadView/Thread';

import Slider from './Slider';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: ${maxWidth}em;

  z-index: 15;
  height: 10rem;
  background-color: white;
`;

const Scrollbar = ({
  catalog, setCursor, threadId,
}) => {
  const [showSlider, setShowSlider] = useState(true);
  const [postId] = useContext(PositionContext);
  const idx = catalog ? catalog.findIndex(ele => ele.postId === postId) : 0;

  const handleClick = useCallback(() => {
    setShowSlider(prev => !prev);
  }, []);

  return (
    <Wrapper>
      <p>{idx} of {catalog ? catalog.length : 0} posts</p>
      {showSlider && <Slider idx={idx} length={catalog ? catalog.length : 0} catalog={catalog} setCursor={setCursor} threadId={threadId}/>}
      <button onClick={handleClick}>show slider</button>
    </Wrapper>
  );
};
Scrollbar.propTypes = {
  catalog: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setCursor: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
};

export default Scrollbar;
