import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import colors from 'utils/colors';
import timeElapsed from 'utils/calculateTime';

const QuotedContentArea = styled.div`
  width: 100%;
  font-size: .75rem;
  line-height: 1.5;
  margin-bottom: .75rem;
`;

// const QuotedContentRow = styled.div`
//   width: 100%;
//   display: flex;
//   flex-flow: row nowrap;
// `;

const QuotedMeta = styled.div`
  width: 100%;
  background-color: unset;
  color: ${colors.regularGrey};
  border: none
  cursor: pointer;
  outline: none;
  border-radius: 5px;
`;

const QuotedContentWrapper = styled.div`
  display: inline-flex;
  flex-flow: row wrap;
  width: 100%;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
`;

const QuotedText = styled.p`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const QuotedContent = ({ refers }) => (refers) && refers.map(refer => (
  <QuotedContentArea key={refer.id}>
    <QuotedContentWrapper>
      <QuotedMeta>
        {refer.author}·
        {timeElapsed(refer.createTime).formatted}
      </QuotedMeta>
      <QuotedText>{refer.content}</QuotedText>
    </QuotedContentWrapper>
  </QuotedContentArea>
));
QuotedContent.propTypes = {
  refers: PropTypes.arrayOf(PropTypes.shape()),
};

export default QuotedContent;
