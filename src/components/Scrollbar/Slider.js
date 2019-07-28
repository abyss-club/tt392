import React, { useContext, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CatalogContext from 'providers/Catalog';
import SliderContext from 'providers/Slider';
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

const Scroller = ({
  idx, length, catalog, setCursor,
}) => {
  const [{ loc, max }, dispatchSlider] = useContext(SliderContext);
  const [{ threadView }] = useContext(CatalogContext);

  useEffect(() => {
    dispatchSlider({ type: 'SET_SLIDER', loc: idx, max: length });
  }, [dispatchSlider, idx, length]);

  const handleSliderChange = useCallback((e) => {
    dispatchSlider({ type: 'SET_SLIDER_LOC', loc: Number(e.target.value) });
  }, [dispatchSlider]);

  const handleSliderOnMouseUp = useCallback(() => {
    console.log({ idx, loc });
    setCursor(catalog[loc].postId);
    // window.scrollTo({
    //   behavior: 'auto',
    //   top: threadView.get(catalog[loc].postId),
    // });
  }, [catalog, idx, loc, setCursor]);

  return (
    <Wrapper>
      <SliderWrapper>
        <input type="range" min="0" max={max} value={loc} step="1" onChange={handleSliderChange} onMouseUp={handleSliderOnMouseUp} />
        max:
        {' '}
        {max}
        , loc:
        {' '}
        {loc}
      </SliderWrapper>
    </Wrapper>
  );
};

export default Scroller;
