import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MDPreview from 'components/MDPreview';
import QuotedContent from 'components/QuotedContent';
import Tag from 'components/Tag';
import { breakpoint } from 'styles/MainContent';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';

import More from 'components/icons/More';

const Wrapper = styled.div`
  background-color: ${props => (props.isThread ? 'unset' : colors.bgGrey)};
  padding: 1rem 0 0;
  :not(:last-of-type):after {
    content: "";
    display: block;
    ${props => (props.inList ? 'width: calc(100% - 2rem);' : 'width: calc(100% - 3rem);')}
    ${props => props.isThread || `border-bottom: 1px solid ${colors.borderGrey};`}
    ${props => (props.inList ? 'margin: 0 1rem;' : 'margin: 0 1.5rem;')}
  }
  :last-of-type {
    ${props => (props.inList ? 'padding-bottom: 0;' : 'padding-bottom: 1rem;')}
    border-bottom: none;
  }
  @media (min-width: ${breakpoint}em) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const IconWrapper = styled.span`
  padding-right: .5em;
`;

const TopRowWrapper = styled.div`
  ${props => (props.inList ? 'padding: 0 1rem;' : 'padding: 0 1.5rem;')}
  width: 100%;
`;

const TagRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const MetaRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: .5rem;
`;

const MoreBtn = styled.button`
  margin: 0 0 0 auto;
  background-color: unset;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  font-size: 1.5em;
  line-height: 0;
  visibility: hidden;
`;

const Title = styled.div`
  ${props => (props.inList ? 'padding: 0 1rem;' : 'padding: 0 1.5rem;')}
  width: 100%;
  font-family: ${fontFamilies.system};
  margin: .5rem 0;
  font-size: 1.25rem;
  line-height: 1.5;
  font-weight: 700;
  > a {
    width: 100%;
    display: block;
    color: ${colors.titleBlack};
    text-decoration: none;
  }
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
  padding-bottom: 1.125rem;
  font-family: ${fontFamilies.system};
  ${props => props.inList && 'cursor: pointer;'}
  > div {
    > div {
      > h1, > h2, > h3, > h4, > h5, > h6, > p {
        ${props => (props.inList ? 'padding: 0 1rem;' : 'padding: 0 1.5rem;')}
      }
    }
  }
`;

const ViewThread = styled.p`
  padding: 0 1rem 1rem;
  font-size: .75em;
  line-height: 1.5;
  color: ${colors.accentRed};
  > a {
    color: ${colors.accentRed};
    text-decoration: none;
  }
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
      <IconWrapper>
        {isQuoted ? (<FontAwesomeIcon icon="check-square" />) : (<FontAwesomeIcon icon="reply" />)}
      </IconWrapper>
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
  isThread, title, anonymous, author, createTime, content, quotes, postID, threadID, replyCount,
  onQuoteToggle, isQuoted, quotable, mainTag, subTags, hasReplies, inList, history,
}) => {
  const titleRow = isThread ? (
    <Title inList={inList}>
      <Link to={`/thread/${threadID}`}>{title || titlePlaceholder}</Link>
    </Title>
  ) : null;
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
  const viewThread = (isThread) && (inList) && (replyCount > 0) && (
    <ViewThread>
      <Link to={`/thread/${threadID}`}>
        {`查看全部 ${replyCount} 个回复`}
      </Link>
    </ViewThread>
  );
  const topRow = isThread ? (
    <TopRowWrapper inList={inList}>
      <TagRow>
        <Tag text={mainTag} isMain isCompact />
        {(subTags || []).map(t => <Tag key={t} text={t} isCompact />)}
        <MoreBtn><More /></MoreBtn>
      </TagRow>
      <MetaRow>
        {authorText}
        <PublishTime>&nbsp;·&nbsp;{timeElapsed(createTime).formatted}</PublishTime>
      </MetaRow>
    </TopRowWrapper>
  ) : (
    <TopRowWrapper inList={inList}>
      <MetaRow>
        {authorText}
        <PublishTime>&nbsp;·&nbsp;{timeElapsed(createTime).formatted}</PublishTime>
        {quoteSelector}
        <MoreBtn><More /></MoreBtn>
      </MetaRow>
    </TopRowWrapper>
  );
  const gotoThread = () => {
    if (inList) {
      history.push(`/thread/${threadID}/`);
    }
  };
  return (
    <Wrapper isThread={isThread} inList={inList} hasReplies={hasReplies}>
      {topRow}
      {titleRow}
      <PostContent inList={inList} onClick={gotoThread}>
        <QuotedContent quotes={quotes} inList={inList} />
        <MDPreview text={content} isThread={isThread} inList={inList} />
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
  quotes: PropTypes.arrayOf(PropTypes.shape()),
  postID: PropTypes.string,
  threadID: PropTypes.string,
  onQuoteToggle: PropTypes.func,
  isQuoted: PropTypes.bool,
  quotable: PropTypes.bool,
  mainTag: PropTypes.string,
  subTags: PropTypes.arrayOf(PropTypes.string),
  inList: PropTypes.bool,
  hasReplies: PropTypes.bool,
  replyCount: PropTypes.number,
  history: PropTypes.shape({}).isRequired,
};
Post.defaultProps = {
  postID: null,
  threadID: null,
  onQuoteToggle: null,
  isQuoted: false,
  quotable: false,
  isThread: false,
  quotes: null,
  title: '',
  subTags: null,
  mainTag: null,
  inList: false,
  hasReplies: false,
  replyCount: 0,
};

export default withRouter(Post);
