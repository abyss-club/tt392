import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MDPreview from 'components/MDPreview';
import QuotedContent from 'components/QuotedContent';
import Tag from 'components/Tag';

import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';

import More from 'components/icons/More';

const Wrapper = styled.div`
  background-color: ${props => (props.isThread ? 'unset' : colors.bgGrey)};
  padding: 1rem 2rem 0;
  :not(:last-of-type):after {
    content: "";
    display: block;
    margin: 0 auto;
    width: 100%;
    padding-top: 1em;
    border-bottom: ${props => (props.hasReplies ? '0' : '1px')} solid ${colors.borderGrey};
  }
  :last-of-type {
    padding: 1rem 2rem;
    border-radius: 0 0 16px 16px;
  }
`;

const TopRowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const MetaRow = styled.div`
  width: 100%;
  display: flex;
`;

const MoreBtn = styled.button`
  margin-left: auto;
  background-color: unset;
  border: none;
  cursor: pointer;
  outline: none;
  font-size: 1.5em;
  line-height: 0;
`;

const Title = styled.h3`
  width: 100%;
  font-family: ${fontFamilies.system};
  margin: .5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const QuoteSelectorBtn = styled.button`
  color: ${props => (props.isQuoted ? 'white' : colors.regularGrey)};
  background-color: ${props => (props.isQuoted ? colors.skyblue : 'unset')};
  border: none;
  cursor: pointer;
  outline: none;
  padding: .25em .5em;
  margin: 0 0 0 .25em;
  border-radius: 5px;
  font-size: .75em;
  :disabled {
    color: ${colors.aluminiumLight};
  }
`;

const PublishTime = styled.span`
  font-family: ${fontFamilies.system};
  color: ${colors.regularGrey};
  font-size: .75em;
`;

const PostContent = styled.div`
  width: 100%;
  font-family: ${fontFamilies.system};
`;

const ViewThread = styled.p`
  margin-top: 1.775rem;
  font-size: .75em;
  color: ${colors.accentBlue};
`;

const AuthorWrapper = styled.span`
  color: ${colors.regularBlack};
  font-family: ${props => (props.anonymous ? '"PT Mono", monospace' : fontFamilies.system)};
  line-height: ${props => (props.anonymous ? '1.3' : 'unset')};
  font-size: .75em;
`;

const QuoteSelectorWrapper = ({
  postID, onQuoteToggle, isQuoted, quotable,
}) => {
  const disabled = (!isQuoted) && (!quotable);
  return (
    <QuoteSelectorBtn
      isQuoted={isQuoted}
      onClick={() => onQuoteToggle({ postID })}
      disabled={disabled}
    >
      引用
    </QuoteSelectorBtn>
  );
};
QuoteSelectorWrapper.propTypes = {
  postID: PropTypes.string,
  onQuoteToggle: PropTypes.func.isRequired,
  isQuoted: PropTypes.bool.isRequired,
  quotable: PropTypes.bool.isRequired,
};
QuoteSelectorWrapper.defaultProps = {
  postID: null,
};

const titlePlaceholder = '无题';
const Post = ({
  isThread, title, anonymous, author, createTime, content, refers, postID,
  onQuoteToggle, isQuoted, quotable, mainTag, subTags, hasReplies,
}) => {
  const titleRow = isThread ? (<Title>{title || titlePlaceholder}</Title>) : null;
  const authorText = anonymous ? (
    <AuthorWrapper anonymous>匿名{author}</AuthorWrapper>
  ) : (
    <AuthorWrapper>{author}</AuthorWrapper>
  );
  const quoteSelector = (!isThread) && onQuoteToggle && (
    <QuoteSelectorWrapper {...{
        postID, onQuoteToggle, isQuoted, quotable,
      }}
    />
  );
  const viewThread = (isThread) && (<ViewThread>查看整串</ViewThread>);
  const topRow = isThread ? (
    <TopRowWrapper>
      <MetaRow>
        <Tag text={mainTag} isMain />
        {(subTags || []).map(t => <Tag key={t} text={t} />)}
        <MoreBtn><More /></MoreBtn>
      </MetaRow>
      <MetaRow>
        {authorText}
        <PublishTime>·{timeElapsed(createTime).formatted}</PublishTime>
      </MetaRow>
    </TopRowWrapper>
  ) : (
    <TopRowWrapper>
      {authorText}
      <PublishTime>·{timeElapsed(createTime).formatted}</PublishTime>
      {quoteSelector}
      <MoreBtn><More /></MoreBtn>
    </TopRowWrapper>);
  return (
    <Wrapper isThread={isThread} hasReplies={hasReplies}>
      {topRow}
      {titleRow}
      <PostContent>
        <QuotedContent refers={refers} />
        <MDPreview text={content} isThread={isThread} />
      </PostContent>
      {viewThread}
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
  refers: PropTypes.arrayOf(PropTypes.shape()),
  postID: PropTypes.string,
  onQuoteToggle: PropTypes.func,
  isQuoted: PropTypes.bool,
  quotable: PropTypes.bool,
  mainTag: PropTypes.string,
  subTags: PropTypes.arrayOf(PropTypes.string),
  hasReplies: PropTypes.bool,
};
Post.defaultProps = {
  postID: null,
  onQuoteToggle: null,
  isQuoted: false,
  quotable: false,
  isThread: false,
  refers: null,
  title: '',
  subTags: null,
  mainTag: null,
  hasReplies: false,
};

export default Post;
