import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRouter } from 'utils/routerHooks';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import MDPreview from 'components/MDPreview';
import QuotedContent from 'components/QuotedContent';
import Tag from 'components/Tag';
import { breakpoint } from 'styles/MainContent';
import LoginContext from 'providers/Login';
import { HookedCosmeticRouter, useCosmeticRouter } from 'utils/cosmeticHistory';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';

import QuoteSelector from './QuoteSelector';
import AdminActions from './AdminActions';

const Wrapper = styled.div`
  background-color: ${props => (props.isThread ? 'unset' : 'white')};
  padding: 1rem 1rem 0;
  :not(:last-of-type):after {
    content: "";
    display: block;
    ${props => (props.inList ? 'width: 100%;' : 'width: calc(100% - 1rem);')}
    ${props => (((props.inList && !props.hasReplies) && !(!props.isThread && props.inList)) ? '' : `border-bottom: 1px solid ${colors.borderGrey};`)}
    ${props => (props.inList ? 'margin: 0;' : 'margin: 0 .5rem;')}
  }
  :last-of-type {
    ${props => (props.inList ? 'padding-bottom: 0;' : 'padding-bottom: 1rem;')}
    border-bottom: none;
  }
  @media (min-width: ${breakpoint}em) {
    padding: unset 1rem;
  }
`;

const TopRowWrapper = styled.div`
  width: 100%;
`;

const TagRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: .5rem;

  overflow: scroll hidden;
  scrollbar-width: none;
  /* stylelint-disable no-descending-specificity */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  /* stylelint-enable */
`;

const MetaRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: .5rem;
`;

const Title = styled.div`
  width: 100%;
  font-family: ${fontFamilies.system};
  font-size: 1.25rem;
  line-height: 1.5;
  font-weight: 700;
  margin-bottom: 1rem;
  > a {
    width: 100%;
    display: block;
    color: ${colors.titleBlack};
    text-decoration: none;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const PublishTime = styled.button`
  font-family: ${fontFamilies.system};
  color: ${colors.regularGrey};
  font-size: .75em;
  border: none;
  appearance: none;
`;

const PostContent = styled.div`
  width: 100%;
  padding-bottom: 1.125rem;
  font-family: ${fontFamilies.system};
  ${props => props.inList && 'cursor: pointer;'}
`;

const ViewThread = styled.p`
  padding: 0 0 1rem;
  font-size: .75em;
  line-height: 1.5;
  color: ${colors.accentGreen};
  > a {
    color: ${colors.accentGreen};
    text-decoration: none;
  }
`;

const AuthorWrapper = styled.span`
  color: ${colors.regularBlack};
  font-family: ${props => (props.anonymous ? '"Roboto Mono", monospace' : fontFamilies.system)};
  line-height: ${props => (props.anonymous ? '1.3' : 'unset')};
  font-size: .875em;
  font-weight: 600;
`;

const titlePlaceholder = '无题';

const AuthorPosition = ({
  anonymous, author, postId, threadId, PositionContext,
}) => {
  const { history } = useCosmeticRouter();
  const [ref, inView] = useInView({
    threshold: 0.5,
    rootMargin: '0% 0% -60% 0%',
  });

  const [, setPostId] = useContext(PositionContext);
  useEffect(() => {
    if (inView) {
      if (postId === '') {
        history.replace(`/t/${threadId}`);
      }
      if (postId) {
        history.replace(`/t/${threadId}/${postId}`);
        setPostId(postId);
      }
    }
  }, [history, inView, postId, setPostId, threadId]);

  return (
    <AuthorWrapper anonymous={anonymous} ref={ref}>
      {anonymous && '匿名'}
      {author}
    </AuthorWrapper>
  );
};
AuthorPosition.propTypes = {
  postId: PropTypes.string.isRequired,
  threadId: PropTypes.string.isRequired,
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
  PositionContext: PropTypes.shape({}),
};
AuthorPosition.defaultProps = {
  PositionContext: {},
};

const Post = ({
  isThread, title, anonymous, author, createdAt, content, quotes, postId, threadId, replyCount,
  mainTag, subTags, hasReplies, inList, PositionContext, locked,
}) => {
  const [{ profile }] = useContext(LoginContext);
  const [showAdmin, setShowAdmin] = useState(false);

  const titleRow = isThread ? (
    <Title inList={inList}>
      <Link to={`/t/${threadId}`}>{title || titlePlaceholder}</Link>
    </Title>
  ) : null;
  const quoteSelector = (!isThread && !inList) && <QuoteSelector postId={postId} />;

  const viewThread = (isThread) && (inList) && (replyCount > 0) && (
    <ViewThread>
      <Link to={`/t/${threadId}`}>
        {`查看全部 ${replyCount} 个回复`}
      </Link>
    </ViewThread>
  );

  const timeOnClick = () => {
    if (profile.role === 'admin' || profile.role === 'mod') {
      setShowAdmin(prev => !prev);
    }
  };
  const publishTime = (
    <>
      <PublishTime type="button" onClick={timeOnClick}>
        {` · ${timeElapsed(createdAt).formatted}`}
      </PublishTime>
      {showAdmin && <AdminActions postId={postId} threadId={threadId} locked={locked} />}
    </>
  );

  const authorRow = inList ? (
    <AuthorWrapper anonymous={anonymous}>
      {anonymous && '匿名'}
      {author}
    </AuthorWrapper>
  ) : (
    <HookedCosmeticRouter>
      <AuthorPosition PositionContext={PositionContext} postId={isThread ? '' : postId} threadId={threadId} anonymous={anonymous} author={author} />
    </HookedCosmeticRouter>
  );

  const topRow = isThread ? (
    <TopRowWrapper inList={inList}>
      <TagRow>
        <Tag text={mainTag} isMain isCompact />
        {(subTags || []).map(t => <Tag key={t} text={t} isCompact />)}
      </TagRow>
      {titleRow}
      <MetaRow>
        {authorRow}
        {publishTime}
      </MetaRow>
    </TopRowWrapper>
  ) : (
    <TopRowWrapper inList={inList}>
      <MetaRow>
        {authorRow}
        {publishTime}
        {quoteSelector}
      </MetaRow>
    </TopRowWrapper>
  );

  const { history } = useRouter();
  const gotoThread = () => {
    if (inList) {
      history.push(`/t/${threadId}/${isThread ? '' : postId}`);
    }
  };

  const post = (
    <>
      {topRow}
      <PostContent inList={inList} onClick={gotoThread}>
        <QuotedContent quotes={quotes} inList={inList} />
        <MDPreview text={content} isThread={isThread} inList={inList} />
      </PostContent>
    </>
  );

  return (
    <Wrapper isThread={isThread} inList={inList} hasReplies={hasReplies}>
      {post}
      {viewThread}
    </Wrapper>
  );
};

Post.propTypes = {
  isThread: PropTypes.bool,
  title: PropTypes.string,
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  quotes: PropTypes.arrayOf(PropTypes.shape()),
  postId: PropTypes.string,
  threadId: PropTypes.string,
  mainTag: PropTypes.string,
  subTags: PropTypes.arrayOf(PropTypes.string),
  inList: PropTypes.bool,
  hasReplies: PropTypes.bool,
  replyCount: PropTypes.number,
  PositionContext: PropTypes.shape({}),
  locked: PropTypes.bool,
};
Post.defaultProps = {
  postId: null,
  threadId: null,
  isThread: false,
  quotes: null,
  title: '',
  subTags: null,
  mainTag: null,
  inList: false,
  hasReplies: false,
  replyCount: 0,
  PositionContext: {},
  locked: false,
};

export default Post;
