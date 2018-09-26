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
  background-color: ${colors.quoteGrey};
  border: 1px solid ${colors.quoteBorder};
  border-radius: 8px;

  display: inline-flex;
  flex-flow: row wrap;
  padding: 1rem;
`;

// const QuotedContentRow = styled.div`
//   width: 100%;
//   display: flex;
//   flex-flow: row nowrap;
// `;

const QuotedMeta = styled.div`
  width: 100%;
  color: ${colors.regularGrey};
  border: none
  cursor: pointer;
  outline: none;
  border-radius: 5px;
`;

const QuotedText = styled.p`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const QuotedContent = ({ refers }) => (refers) && refers.map(refer => (
  <QuotedContentArea key={refer.id}>
    <QuotedMeta>
      {refer.author}&nbsp;·&nbsp;
      {timeElapsed(refer.createTime).formatted}
    </QuotedMeta>
    <QuotedText>{refer.content}</QuotedText>
  </QuotedContentArea>
));
QuotedContent.propTypes = {
  refers: PropTypes.arrayOf(PropTypes.shape()),
};

export default QuotedContent;
