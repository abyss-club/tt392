import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import colors from 'utils/colors';
import timeElapsed from 'utils/calculateTime';
import fontFamilies from 'utils/fontFamilies';

const QuotedContentArea = styled.article`
  font-size: .75rem;
  line-height: 1.5;
  background-color: ${colors.quoteGrey};

  display: inline-flex;
  flex-flow: row wrap;
  padding: 1rem;

  ${(props) => {
    if (props.inNoti) {
      return `
      padding-bottom: 0;
      :first-of-type {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
      }
      :last-of-type {
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
        padding-bottom: 1rem;
      }
      :not(:last-of-type):after {
        content: "";
        display: block;
        width: 100%;
        border-bottom: 1px solid ${colors.borderGrey};
        padding: 1rem 0 0;
      }
`;
    }
    return 'border-radius: .5rem;';
  }}
  ${(props) => {
    if (props.inList) return 'margin: 0 1rem .75rem;';
    else if (props.inDraft) return 'margin: 0 0 .75rem;';
    else if (props.inNoti) return 'margin: 0 1rem;';
    return 'margin: 0 1.5rem .75rem;';
  }}
  ${(props) => {
    if (props.inList) return 'width: calc(100% - 2rem);';
    else if (props.inDraft) return 'width: 100%;';
    else if (props.inNoti) return 'width: calc(100% - 2rem);';
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
  border-radius: .3125rem;
`;

const QuotedText = styled.p`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AuthorWrapper = styled.span`
  color: ${colors.regularBlack};
  font-family: ${props => (props.anonymous ? '"PT Mono", monospace' : fontFamilies.system)};
  line-height: ${props => (props.anonymous ? '1.3' : 'unset')};
`;

const authorText = ({ anonymous, author }) => (anonymous ? (
  <AuthorWrapper anonymous>匿名{author}</AuthorWrapper>
) : (
  <AuthorWrapper>{author}</AuthorWrapper>
));
authorText.propTypes = {
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
};

const QuotedContent = ({
  quotes, inList, inDraft, inNoti,
}) => (quotes) && quotes.map(quote => (
  <QuotedContentArea key={quote.id} inList={inList} inDraft={inDraft} inNoti={inNoti}>
    <QuotedMeta>
      {authorText({
        anonymous: quote.anonymous,
        author: quote.author,
      })}
      &nbsp;·&nbsp;
      {timeElapsed(quote.createTime).formatted}
    </QuotedMeta>
    <QuotedText>{quote.content}</QuotedText>
  </QuotedContentArea>
));
QuotedContent.propTypes = {
  quotes: PropTypes.arrayOf(PropTypes.shape()),
  inList: PropTypes.bool,
  inDraft: PropTypes.bool,
  inNoti: PropTypes.bool,
};

export default QuotedContent;
