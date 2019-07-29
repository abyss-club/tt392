import React, {
  useContext, useCallback, useEffect, useState
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HookedCosmeticRouter, useCosmeticRouter } from 'utils/cosmeticHistory';
import { withRouter } from 'react-router-dom';
import colors from 'utils/colors';

const Wrapper = styled.div`
  background-color: white;
`;

const SliderWrapper = styled.div`
  display: inline-block;
  width: 20px;
  height: 150px;
  padding: 0;

  > input {
    appearance: none;
    background-color: ${colors.borderGrey};
    width: 150px;
    height: 20px;
    margin: 0;
    transform-origin: 75px 75px;
    transform: rotate(90deg);

    ::-webkit-slider-thumb {
      appearance: none;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      border: 1px solid #000000;
      height: 36px;
      width: 16px;
      border-radius: 3px;
      background: #ffffff;
      cursor: ns-resize;
    }
    ::-moz-range-thumb {
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      border: 1px solid #000000;
      height: 36px;
      width: 16px;
      border-radius: 3px;
      background: #ffffff;
      cursor: ns-resize;
    }
  }
`;

const Slider = ({
  idx, length, catalog, setCursor, threadId,
}) => {
  const { history } = useCosmeticRouter();
  console.log(history)
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

  return (
    <Wrapper>
      <SliderWrapper>
        <input type="range" min="0" max={length} value={loc} step="1" onChange={handleSliderChange} onMouseUp={handleSliderOnMouseUp} />
        max:
        {' '}
        {length}
        , loc:
        {' '}
        {loc}
      </SliderWrapper>
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
};


export default props => (
  <HookedCosmeticRouter>
    <Slider {...props} />
  </HookedCosmeticRouter>
);
