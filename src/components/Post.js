import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MDPreview from 'components/MDPreview';
import QuotedContent from 'components/QuotedContent';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'providers/Store';

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
  color: ${props => (props.quotedPosts.has(props.postid) ? 'white' : 'unset')};
  background-color: ${props => (props.quotedPosts.has(props.postid) ? colors.skyblue : 'unset')};
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

const toggleQuote = ({ quotedPosts, postid, setStore }) => {
  const newQuotedPosts = new Set(quotedPosts);
  if (newQuotedPosts.has(postid)) newQuotedPosts.delete(postid);
  else newQuotedPosts.add(postid);
  setStore(() => ({
    quotedPosts: newQuotedPosts,
  }));
};

const QuoteSelectorWrapper = ({
  quotable, postid,
}) => (quotable) && (
  <Store.Consumer>
    {({ quotedPosts, setStore }) => (
      <React.Fragment>
        <QuoteSelectorBtn
          quotedPosts={quotedPosts}
          postid={postid}
          onClick={() => toggleQuote({ postid, setStore, quotedPosts })}
        >
          <IconWrapper>
            {quotedPosts.has(postid) ? (<FontAwesomeIcon icon="check-square" />) : (<FontAwesomeIcon icon="quote-left" />)}
          </IconWrapper>
          引用
        </QuoteSelectorBtn>
      </React.Fragment>
    )}
  </Store.Consumer>
);
QuoteSelectorWrapper.propTypes = {
  quotable: PropTypes.bool,
  postid: PropTypes.string,
};
QuoteSelectorWrapper.defaultProps = {
  quotable: false,
};

const titlePlaceholder = '无题';
const Post = ({
  isThread, title, anonymous, author, createTime, content, quotable, postid, refers,
}) => {
  const titleText = isThread ? (<Title>{title || titlePlaceholder}</Title>) : null;
  const authorText = anonymous ? (
    <AuthorWrapper anonymous>匿名{author}</AuthorWrapper>
  ) : (
    <AuthorWrapper>{author}</AuthorWrapper>
  );
  return (
    <Wrapper>
      <TitleRow>
        {titleText}
        {authorText}
        <TitleRight>
          <QuoteSelectorWrapper quotable={quotable} postid={postid} />
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
  quotable: PropTypes.bool,
  postid: PropTypes.string,
  refers: PropTypes.arrayOf(PropTypes.shape()),
};
Post.defaultProps = {
  isThread: false,
  quotable: false,
  postid: null,
  refers: null,
  title: '',
};

export default Post;
