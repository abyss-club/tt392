import QuotedPostsContext from 'providers/QuotedPosts';
import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconWrapper = styled.span`
  padding-right: .5em;
`;

const QuoteSelectorBtn = styled.button`
  color: ${props => (props.isQuoted ? 'white' : colors.regularGrey)};
  background-color: ${props => (props.isQuoted ? colors.skyblue : 'unset')};
  border: none;
  cursor: pointer;
  outline: none;
  padding: .25em .5em;
  margin: 0 0 0 .25em;
  border-radius: .3125rem;
  font-size: .75em;
  :disabled {
    color: ${colors.aluminiumLight};
  }
`;

const QuoteSelector = ({ postId }) => {
  const [quotedPosts, setQuotedPosts] = useContext(QuotedPostsContext);
  const isQuoted = quotedPosts.has(postId);
  const quotable = quotedPosts.size < 3;
  const handleQuoteToggle = useCallback(() => {
    setQuotedPosts((prevQP) => {
      const newQuotedPosts = new Set(prevQP);
      if (newQuotedPosts.has(postId)) {
        newQuotedPosts.delete(postId);
      } else {
        newQuotedPosts.add(postId);
      }
      return newQuotedPosts;
    });
  }, [postId, setQuotedPosts]);
  const disabled = (!isQuoted) && (!quotable);
  return (
    <QuoteSelectorBtn
      isQuoted={isQuoted}
      onClick={() => handleQuoteToggle({ postId })}
      disabled={disabled}
    >
      引用
      <IconWrapper>
        {isQuoted ? (<FontAwesomeIcon icon="check-square" />) : (<FontAwesomeIcon icon="reply" />)}
      </IconWrapper>
    </QuoteSelectorBtn>
  );
};
QuoteSelector.propTypes = {
  postId: PropTypes.string,
};
QuoteSelector.defaultProps = {
  postId: null,
};

export default QuoteSelector;
