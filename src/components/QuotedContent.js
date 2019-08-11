import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import colors from 'utils/colors';
import timeElapsed from 'utils/calculateTime';
import fontFamilies from 'utils/fontFamilies';
import DraftContext from 'providers/Draft';
import Cross from 'components/icons/Cross';

const QuotedContentArea = styled.article`
  font-size: .75rem;
  line-height: 1.5;

  display: inline-flex;
  flex-flow: row wrap;
  padding: .5rem;

  ${(props) => {
    if (props.inNotiReply) {
      return `
        padding-bottom: 0;
        background-color: ${colors.quotedBgInNoti};
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
    if (props.inNotiQuote) {
      return `
        padding-bottom: 1rem;
        background-color: ${colors.quotedBg};
        border-radius: 0 .125rem .125rem 0;
        border-left: 2px solid ${colors.quotedBorder};
      `;
    }
    return `
      background-color: ${colors.quotedBg};
      border-radius: 0 .125rem .125rem 0;
      border-left: 2px solid ${colors.quotedBorder};
    `;
  }}
  ${(props) => {
    if (props.inList || props.inDraft || props.inUser) return 'margin: 0 0 .75rem;';
    if (props.inNotiReply || props.inNotiQuote) return 'margin: 0 1rem;';
    return 'margin: 0 .5rem .75rem;';
  }}
  ${(props) => {
    if (props.inList || props.inDraft) return 'width: 100%;';
    if (props.inNotiReply || props.inNotiQuote || props.inUser) return 'width: calc(100% - 2rem);';
    return 'width: calc(100% - 1rem);';
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
  border: none;
  outline: none;
  border-radius: .3125rem;
`;

const QuotedInDraftWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;

  width: calc(100% - 1rem);
`;

const QuotedText = styled.p`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AuthorWrapper = styled.span`
  color: ${colors.regularBlack};
  font-weight: 600;
  font-family: ${props => (props.anonymous ? '"Roboto Mono", monospace' : fontFamilies.system)};
  line-height: ${props => (props.anonymous ? '1.3' : 'unset')};
`;

const DelBtn = styled.button`
  border: none;
  appearance: none;
  background: none;
  line-height: 0;
  padding: 0 1em;
  margin: 0 -1em;
  cursor: pointer;

  > svg {
    > path {
      stroke: ${colors.regularGrey};
    }
  }
`;

const authorText = ({ anonymous, author }) => (anonymous ? (
  <AuthorWrapper anonymous>
    匿名
    {author}
  </AuthorWrapper>
) : (
  <AuthorWrapper>{author}</AuthorWrapper>
));
authorText.propTypes = {
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
};

const QuotedContent = ({
  quotes, inList, inNotiReply, inNotiQuote, inUser,
}) => (quotes) && quotes.map(quote => (
  <QuotedContentArea
    key={quote.id}
    inList={inList}
    inNotiReply={inNotiReply}
    inNotiQuote={inNotiQuote}
    inUser={inUser}
  >
    <QuotedMeta>
      {authorText({
        anonymous: quote.anonymous,
        author: quote.author,
      })}
      {' · '}
      {timeElapsed(quote.createdAt).formatted}
    </QuotedMeta>
    <QuotedText>{quote.content}</QuotedText>
  </QuotedContentArea>
));
QuotedContent.propTypes = {
  quotes: PropTypes.arrayOf(PropTypes.shape()),
  inList: PropTypes.bool,
  inDraft: PropTypes.bool,
  inNotiQuote: PropTypes.bool,
  inNotiReply: PropTypes.bool,
  inUser: PropTypes.bool,
};

const QuotedInDraft = ({ quote }) => {
  const [, dispatch] = useContext(DraftContext);

  const handleClick = useCallback(() => {
    dispatch({ type: 'REMOVE_QUOTEID', quoteId: quote.id });
  }, [dispatch, quote.id]);

  return (
    <QuotedContentArea inDraft>
      <QuotedInDraftWrapper>
        <QuotedMeta>
          {authorText({
            anonymous: quote.anonymous,
            author: quote.author,
          })}
          {' · '}
          {timeElapsed(quote.createdAt).formatted}
        </QuotedMeta>
        <QuotedText>{quote.content}</QuotedText>
      </QuotedInDraftWrapper>
      <DelBtn type="button" onClick={handleClick}><Cross /></DelBtn>
    </QuotedContentArea>
  );
};
QuotedInDraft.propTypes = {
  quote: PropTypes.shape({
    id: PropTypes.string.isRequired,
    anonymous: PropTypes.bool.isRequired,
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default QuotedContent;
export { QuotedInDraft };
