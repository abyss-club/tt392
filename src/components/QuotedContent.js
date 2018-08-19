import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MDPreview from 'components/MDPreview';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'providers/Store';

const QuotedContentArea = styled.div`
  width: 100%;
`;

const QuotedContentRow = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
`;

const QuotedContentBtn = styled.button`
  background-color: unset;
  color: ${colors.vulcanLight};
  border: none
  cursor: pointer;
  outline: none;
  border-radius: 5px;
  padding-bottom: .55em;

  font-size: .9em;
  text-decoration: underline;
`;

const QuotedContentWrapper = styled.div`
  display: inline-flex;
  flex-flow: row wrap;
  min-width: 15em;
  max-width: 100%;
  background-color: ${colors.zircon};
  padding: .5em .5em;
  border-radius: 5px;
  margin-bottom: .5em;
`;

const QuotedContentTime = styled.span`
  color: ${colors.aluminiumLight};
  margin-left: auto;
  font-size: .9em;
  font-family: 'Merriweather Sans', sans-serif;
`;

const QuotedText = styled.p`
  margin: 0 0 0 1.4em;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const QuotedContent = ({ refers }) => (refers) && (
  <React.Fragment>
    {refers.map(refer => (
      <React.Fragment key={refer.id}>
        <QuotedContentArea>
          <QuotedContentWrapper>
            <QuotedContentRow>
              <FontAwesomeIcon icon="quote-left" />
              <QuotedContentBtn>
                {refer.author}
              </QuotedContentBtn>
              <QuotedContentTime>
                {timeElapsed(refer.createTime).formatted}
              </QuotedContentTime>
            </QuotedContentRow>
            <QuotedText>{refer.content}</QuotedText>
          </QuotedContentWrapper>
        </QuotedContentArea>
      </React.Fragment>
    ))}
  </React.Fragment>
);
QuotedContent.propTypes = {
  refers: PropTypes.arrayOf(PropTypes.shape()),
};

export default QuotedContent;
