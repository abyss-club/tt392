import React, {
  useState, useContext, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { breakpoint, maxWidth } from 'styles/MainContent';
import ScrollbarContext from 'providers/Scrollbar';
import SliderContext from 'providers/Slider';

import Slider from './Slider';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: ${maxWidth}em;

  z-index: 15;
  height: 26rem;
  background-color: white;
`;

const Scrollbar = ({ catalog }) => {
  const [{ threadView }] = useContext(ScrollbarContext);
  const [showSlider, setShowSlider] = useState(true);
  const idx = catalog.findIndex(ele => ele.postId === threadView.postId);

  const handleClick = useCallback(() => {
    setShowSlider(prev => !prev);
  });

  return (
    <Wrapper>
      <p>{idx} of {catalog.length} posts</p>
      {showSlider && <Slider idx={idx} length={catalog.length} catalog={catalog} />}
      <button onClick={handleClick}>show slider</button>
    </Wrapper>
  );
};
Scrollbar.propTypes = {
  catalog: PropTypes.arrayOf(PropTypes.shape({
    findIndex: PropTypes.func,
    length: PropTypes.number.isRequired,
  })).isRequired,
};

export default Scrollbar;
