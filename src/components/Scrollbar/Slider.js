import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'utils/colors';
import timeElapsed from 'utils/calculateTime';

const Wrapper = styled.div`
  background-color: white;
  padding: 2rem;
  height: 26rem;
  border-top: 1px solid ${colors.borderGrey};
`;

const ScrollWrapper = styled.div`
  height: 20rem;
`;

const Head = styled.div`
  height: 1rem;
  font-size: 0.75rem;
  color: ${colors.textGrey};
  cursor: pointer;
  margin-left: -0.25em;
  > * {
    margin-right: 0.25rem;
  }
`;

const PlaceHolder = styled.div`
  height: ${props => props.height};
  border-left: 1px solid ${colors.borderGrey};
`;

const Handle = styled.div`
  height: 3rem;
  padding: 0.25rem 0;
  display: flex;
  justify-content: flex-start;
  cursor: ns-resize;
`;

const Bar = styled.div`
  height: 2.5rem;
  width: calc(0.25rem + 1px);
  background-color: ${colors.bgGreen};
  margin-left: -0.125rem;
  border-radius: 0.5rem;
`;

const Info = styled.div`
  height: 2.5rem;
  margin-left: 1rem;
`;

const PageInfo = styled.p`
  font-weight: bold;
  font-size: 0.875rem;
  user-select: none;
`;

const DateInfo = styled.p`
  font-size: 0.75rem;
  color: ${colors.textGrey};
  user-select: none;
`;

const Slider = ({
  idx, length, catalog, setCursor, close,
}) => {
  // click outside, close this
  const ref = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('click', handleClick);
    return () => { document.removeEventListener('click', handleClick); };
  });

  const init = {
    index: idx + 1,
    progress: idx / (length - 1),
  };
  const [state, setState] = useState(init);

  const scrollRef = useRef(null);
  const handleRef = useRef(null);
  useEffect(() => {
    scrollRef.current.rect = scrollRef.current.getBoundingClientRect();
    handleRef.current.rect = handleRef.current.getBoundingClientRect();
    function handleTouchMove(e) {
      dragMove(e.touches[0]);
      e.preventDefault();
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return function cleanup() {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  });

  // drag events
  const [isDragging, setIsDragging] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const dragStart = ({ clientY, target }) => {
    if (handleRef.current.contains(target)) {
      scrollRef.current.initY = clientY;
      setIsDragging(true);
      setIsDragged(true);
    }
  };
  const dragMove = ({ clientY }) => {
    if (isDragging) {
      const offset = clientY - scrollRef.current.initY;
      const { height: rh } = scrollRef.current.rect;
      const { height: hh } = handleRef.current.rect;
      let nextProgress = init.progress + offset / (rh - hh);
      if (nextProgress < 0) {
        nextProgress = 0;
      } else if (nextProgress > 1) {
        nextProgress = 1;
      }
      const nextIndex = Math.round(nextProgress * (length - 1) + 1);
      setState({
        index: nextIndex,
        progress: nextProgress,
      });
    }
  };
  const dragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setCursor(state.index > 1 ? catalog[state.index - 2].postId : '', index - 1);
      close();
    }
  };
  const goToOriginPost = () => {
    setCursor('', 0);
    close();
  };
  const goToLastPost = () => {
    setCursor(catalog[catalog.length - 2].postId, length - 1);
    close();
  };
  const index = isDragged ? state.index : init.index;
  const progress = isDragged ? state.progress : init.progress;
  const time = timeElapsed(catalog[index - 1].createdAt, index).formatted;

  return (
    <Wrapper ref={ref}>
      <Head onClick={goToOriginPost}>
        <FontAwesomeIcon icon="angle-double-up" />
        <span>最早</span>
      </Head>
      <ScrollWrapper
        ref={scrollRef}
        onMouseDown={dragStart}
        onMouseMove={dragMove}
        onMouseUp={dragEnd}
        onTouchStart={(e) => { dragStart(e.touches[0]); }}
        onTouchEnd={dragEnd}
        onTouchCancel={dragEnd}
      >
        <PlaceHolder height={`calc(17rem * ${progress})`} />
        <Handle
          ref={handleRef}
        >
          <Bar />
          <Info>
            <PageInfo>{`${index} of ${length} posts`}</PageInfo>
            <DateInfo>{time}</DateInfo>
          </Info>
        </Handle>
        <PlaceHolder height={`calc(17rem * ${1 - progress})`} />
      </ScrollWrapper>
      <Head onClick={goToLastPost}>
        <FontAwesomeIcon icon="angle-double-down" />
        <span>最新</span>
      </Head>
    </Wrapper>
  );
};
Slider.propTypes = {
  idx: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  setCursor: PropTypes.func.isRequired,
  catalog: PropTypes.arrayOf(PropTypes.shape({
    postId: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
  })).isRequired,
  close: PropTypes.func.isRequired,
};


export default Slider;
