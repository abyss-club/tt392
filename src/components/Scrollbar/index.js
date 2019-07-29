import React, {
  useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ContentWrapper } from 'styles/MainContent';
import colors from 'utils/colors';
import { PositionContext } from 'components/ThreadView/Thread';
// import Slider from './Slider';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: transparent;
  z-index: 15;
`;

const Content = styled(ContentWrapper)`
  height: calc(3rem);
  background-color: white;
`;

const ProgressBar = styled.div`
  height: 2px;
  width: ${props => props.percent}%;
  background-color: ${colors.accentGreen};
  transition: width 0.25s ease-in-out;
`;

const PageNumber = styled.div`
  height: 100%;
  padding: 0 0 2px 0;
  text-align: center;
`;

const PagesIcon = styled(FontAwesomeIcon)`
  margin-left: 0.25rem;
`;

const CatalogBtn = styled.button`
  height: calc(3rem - 4px);
  font-weight: bold;
  font-size: 0.875rem;
  line-height: 1rem;
  padding: calc(1rem - 2px) 1rem;
  color: ${colors.accentGreen};
  text-align: center;
  border: 0;
  margin: 0 auto;
  background: white;
  :focus {
    outline: none;
  }
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
  const pageNum = `${idx} of ${catalog.length} posts`;
  const percent = Math.round(1000 * idx / catalog.length) / 10;
  /*
   * {showSlider &&
   * <Slider idx={idx} length={catalog.length} catalog={catalog}
   * setCursor={setCursor} threadId={threadId}/>}
   * <button type="button" onClick={handleClick}>show slider</button>
   */
  return (
    <Wrapper>
      <Content>
        <ProgressBar percent={percent} />
        <PageNumber>
          <CatalogBtn>
            {pageNum}
            <PagesIcon icon="sort" />
          </CatalogBtn>
        </PageNumber>
      </Content>
    </Wrapper>
  );
};
Scrollbar.propTypes = {
  catalog: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setCursor: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
};

export default Scrollbar;
