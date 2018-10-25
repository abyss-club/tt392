import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import colors from 'utils/colors';
import timeElapsed from 'utils/calculateTime';

const QuotedContentArea = styled.div`
  font-size: .75rem;
  line-height: 1.5;
  background-color: ${colors.quoteGrey};
  border-radius: 8px;

  display: inline-flex;
  flex-flow: row wrap;
  padding: 1rem;

  ${(props) => {
    if (props.inList) return 'margin: 0 1rem .75rem;';
    else if (props.inDraft) return 'margin: 0 0 .75rem;';
    return 'margin: 0 1.5rem .75rem;';
  }}
  ${(props) => {
    if (props.inList) return 'width: calc(100% - 2rem);';
    else if (props.inDraft) return 'width: 100%;';
    return 'width: calc(100% - 3rem);';
  }}
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

const QuotedContent = ({ quotes, inList, inDraft }) => (quotes) && quotes.map(quote => (
  <QuotedContentArea key={quote.id} inList={inList} inDraft={inDraft}>
    <QuotedMeta>
      {quote.author}&nbsp;·&nbsp;
      {timeElapsed(quote.createTime).formatted}
    </QuotedMeta>
    <QuotedText>{quote.content}</QuotedText>
  </QuotedContentArea>
));
QuotedContent.propTypes = {
  quotes: PropTypes.arrayOf(PropTypes.shape()),
  inList: PropTypes.bool,
  inDraft: PropTypes.bool,
};

export default QuotedContent;
