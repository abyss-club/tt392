import React, {
  useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ContentWrapper } from 'styles/MainContent';
import colors from 'utils/colors';
import { PositionContext } from 'components/ThreadView/Thread';
import Slider from './Slider';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: ${colors.mainBg};
  z-index: 15;
`;

const Content = styled(ContentWrapper)`
  height: ${props => (props.showSlider ? '26rem' : '3rem')};
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
  const [showSlider, setShowSlider] = useState(false);
  const [postId] = useContext(PositionContext);
  const idx = catalog && postId ? catalog.findIndex(ele => ele.postId === postId) : 0;
  console.log('cal idx', { catalog, postId, idx });

  const handleClick = useCallback(() => {
    setShowSlider(prev => !prev);
  }, []);
  let content;
  if (!showSlider) {
    const pageNum = `${idx + 1} of ${catalog.length} posts`;
    const percent = Math.round(1000 * (idx + 1) / catalog.length) / 10;
    content = (
      <>
        <ProgressBar percent={percent} />
        <PageNumber>
          <CatalogBtn onClick={handleClick}>
            {pageNum}
            <PagesIcon icon="sort" />
          </CatalogBtn>
        </PageNumber>
      </>
    );
  } else {
    content = (
      <>
        <Slider
          idx={idx}
          length={catalog.length}
          catalog={catalog}
          setCursor={setCursor}
          threadId={threadId}
          close={handleClick}
        />
      </>
    );
  }
  return (
    <Wrapper>
      <Content showSlider={showSlider}>
        {content}
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
