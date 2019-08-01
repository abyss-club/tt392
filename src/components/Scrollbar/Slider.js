import React, {
  useContext, useCallback, useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HookedCosmeticRouter, useCosmeticRouter } from 'utils/cosmeticHistory';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'utils/colors';

const Wrapper = styled.div`
  background-color: white;
  padding: 2rem;
  height: 26rem;
  border-top: 1px solid ${colors.borderGrey};
`;

const thumb = `
  appearance: none;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: ${colors.accentGreen};
  cursor: ns-resize;
`;

const SliderWrapper = styled.div`
  display: inline-block;
  width: 20px;
  height: 150px;
  padding: 0;

  > input {
    appearance: none;
    color: ${colors.accentGreen};
    background-color: ${colors.borderGrey};
    width: 32rem;
    height: 1px;
    margin: 0;
    transform-origin: 75px 75px;
    transform: rotate(90deg);

    ::-webkit-slider-thumb {
      ${thumb}
    }
    ::-moz-range-thumb {
      ${thumb}
    }
  }
`;

const ScrollWrapper = styled.div`
  height: 20rem;
`;

const Head = styled.div`
  height: 1rem;
  lint-height: 1rem;
  font-size: 0.75rem;
  color: ${colors.textGrey};
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
`;

const DateInfo = styled.p`
  font-size: 0.75rem;
  color: ${colors.textGrey};
`;

const drag = {
  handleMouseDown: (e) => {
    console.log('down', e.clientY);
    this.setState({
      isDragging: true,
      prevy: e.clientY,
    });
  },
  handleMouseUp: (e) => {
    console.log('up');
    this.setState({
      isDragging: false,
    });
  },
  handleMouseLeave: (e) => {
    console.log('leave');
    this.setState({
      isDragging: false,
    });
  },
  handleMouseMove: (e) => {
    if (this.state.isDragging) {
      console.log('move', e.clientY);
      this.setState({
        y: e.clientY - this.state.prevy,
      });
    }
  },
};

const Slider = ({
  idx, length, catalog, setCursor, threadId, close,
}) => {
  const { history } = useCosmeticRouter();
  // console.log(history)
  const [loc, setLoc] = useState(idx);
  useEffect(() => {
    setLoc(idx);
  }, [idx]);
  const handleSliderChange = useCallback((e) => {
    setLoc(Number(e.target.value));
  }, []);

  const handleSliderOnMouseUp = useCallback(() => {
    // setCursor(catalog[loc].postId);
    history.replace(`/t/${threadId}/${catalog[loc].postId}`);
    // window.scrollTo({
    //   behavior: 'auto',
    //   top: threadView.get(catalog[loc].postId),
    // });
  }, [catalog, history, loc, threadId]);

  const onHandleMouseDown = (e) => {
    console.log('down', e.clientY);
  };
  const onHandleMouseUp = (e) => {
    console.log('up');
  };
  const onHandleMouseLeave = (e) => {
    console.log('leave');
  };
  const onHandleMouseMove = (e) => {
    // if (this.state.isDragging) {
    console.log('move', e.clientY);
    // }
  };

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

  // return (
  //   <Wrapper>
  //     <SliderWrapper>
  //       <input type="range" min="0" max={length} value={loc} step="1" onChange={handleSliderChange} onMouseUp={handleSliderOnMouseUp} />
  //       max:
  //       {' '}
  //       {length}
  //       , loc:
  //       {' '}
  //       {loc}
  //     </SliderWrapper>
  //   </Wrapper>
  // );
  const page = `${loc + 1} of ${length} posts`;
  const before = Math.round(100 * loc / (length - 1)) / 100;
  const after = 1 - before;
  return (
    <Wrapper ref={ref}>
      <Head>
        <FontAwesomeIcon icon="angle-double-up" />
        <span>最早</span>
      </Head>
      <ScrollWrapper>
        <PlaceHolder height={`calc(17rem * ${before})`} />
        <Handle
          onMouseDown={onHandleMouseDown}
          onMouseUp={onHandleMouseUp}
          onMouseLeave={onHandleMouseLeave}
          onMouseMove={onHandleMouseMove}
        >
          <Bar />
          <Info>
            <PageInfo>{page}</PageInfo>
            <DateInfo>2019年7月</DateInfo>
          </Info>
        </Handle>
        <PlaceHolder height={`calc(17rem * ${after})`} />
      </ScrollWrapper>
      <Head>
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
  })).isRequired,
  threadId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};


export default props => (
  <HookedCosmeticRouter>
    <Slider {...props} />
  </HookedCosmeticRouter>
);
