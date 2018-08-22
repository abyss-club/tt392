import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MDPreview from 'components/MDPreview';
import QuotedContent from 'components/QuotedContent';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
  padding: 1rem 0 0 0;
  border-bottom: .5px solid #A7A7A7;
`;

const TitleRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: .5rem 0;
`;

const Title = styled.h3`
  font-family: ${fontFamilies.system};
  margin: 0 0.5rem 0 0;
  font-size: 1.5rem;
`;

const TitleRight = styled.div`
  margin-left: auto;
`;

const IconWrapper = styled.span`
  padding-right: .5em;
`;

const QuoteSelectorBtn = styled.button`
  color: ${props => (props.quotedPosts.has(props.postID) ? 'white' : 'unset')};
  background-color: ${props => (props.quotedPosts.has(props.postID) ? colors.skyblue : 'unset')};
  border: none;
  cursor: pointer;
  outline: none;
  padding: .5em .5em;
  margin-right: .25em;
  border-radius: 5px;
`;

const PublicTime = styled.span`
  font-family: 'Merriweather Sans', sans-serif;
`;

const PostContent = styled.div`
  width: 100%;
  font-family: ${fontFamilies.system};
`;

const AuthorWrapper = styled.span`
  color: ${props => (props.anonymous ? colors.vulcan : colors.orangeLight)};
  font-family: ${props => (props.anonymous ? '"PT Mono", monospace' : fontFamilies.system)};
`;

const QuoteSelectorWrapper = ({
  postID, onQuoteToggle, quotedPosts,
}) => (
  <QuoteSelectorBtn
    quotedPosts={quotedPosts}
    postID={postID}
    isSelected={postID}
    onClick={() => onQuoteToggle({ postID })}
  >
    <IconWrapper>
      {quotedPosts.has(postID) ? (<FontAwesomeIcon icon="check-square" />) : (<FontAwesomeIcon icon="quote-left" />)}
    </IconWrapper>
    引用
  </QuoteSelectorBtn>
);
QuoteSelectorWrapper.propTypes = {
  postID: PropTypes.string.isRequired,
  onQuoteToggle: PropTypes.func.isRequired,
  quotedPosts: PropTypes.shape().isRequired,
};

const titlePlaceholder = '无题';
const Post = ({
  isThread, title, anonymous, author, createTime, content, refers, postID, onQuoteToggle, quotedPosts,
}) => {
  const titleText = isThread ? (<Title>{title || titlePlaceholder}</Title>) : null;
  const authorText = anonymous ? (
    <AuthorWrapper anonymous>匿名{author}</AuthorWrapper>
  ) : (
    <AuthorWrapper>{author}</AuthorWrapper>
  );
  const quoteSelector = !isThread ? (
    <QuoteSelectorWrapper postID={postID} onQuoteToggle={onQuoteToggle} quotedPosts={quotedPosts} />
  ) : null;
  return (
    <Wrapper>
      <TitleRow>
        {titleText}
        {authorText}
        <TitleRight>
          {quoteSelector}
          <PublicTime>{timeElapsed(createTime).formatted}</PublicTime>
        </TitleRight>
      </TitleRow>
      <PostContent>
        <QuotedContent refers={refers} />
        <MDPreview text={content} />
      </PostContent>
    </Wrapper>
  );
};

Post.propTypes = {
  isThread: PropTypes.bool,
  title: PropTypes.string,
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
  createTime: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  postID: PropTypes.string,
  refers: PropTypes.arrayOf(PropTypes.shape()),
  quotedPosts: PropTypes.shape(),
  onQuoteToggle: PropTypes.func,
};
Post.defaultProps = {
  quotedPosts: new Set(),
  onQuoteToggle: () => {},
  isThread: false,
  postID: null,
  refers: null,
  title: '',
};

export default Post;
