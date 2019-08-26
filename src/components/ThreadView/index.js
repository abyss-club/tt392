import React, {
  useState, useEffect, useCallback, useMemo, useContext,
} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import QuotedPostsContext from 'providers/QuotedPosts';
import OffsetPosContext from 'providers/OffsetPos';
import FloatButton from 'styles/FloatButton';
import { useLoadingBar } from 'styles/Loading';
import { useRouter } from 'utils/routerHooks';
import { INTERNAL_ERROR, NOT_FOUND } from 'utils/errorCodes';
import ChatBubble from 'components/icons/ChatBubble';
import Thread from './Thread';

const THREAD_VIEW = gql`
  query Thread($id: String!, $before: String, $after: String) {
    thread(id: $id) {
      id, anonymous, title, author, content, createdAt, mainTag, subTags, catalog { postId, createdAt }
      replies(query: { before: $before, after: $after, limit: 10 }) {
        posts {
          id, anonymous, author, content, createdAt, quotes { id, author, content, createdAt }
        }
        sliceInfo { firstCursor, lastCursor, hasNext }
      }
    }
  }
`;

const GET_POST_CATALOG = gql`
  query PostWithCatalog($threadId: String!, $postId: String!) {
    thread(id: $threadId) { id, anonymous, title, author, content, createdAt, mainTag, subTags, catalog { postId, createdAt } }
    post(id: $postId) {
      id, anonymous, author, content, createdAt, quotes { id, author, content, createdAt }
    }
  }
`;

const ThreadViewQuery = ({ threadId, postId }) => {
  const { history, location } = useRouter();
  const [posMap, setPosMap] = useContext(OffsetPosContext);

  useEffect(() => {
    setPosMap(new Map());
  }, [threadId, setPosMap]);

  const {
    data, loading, fetchMore, refetch, error,
  } = useQuery(THREAD_VIEW, {
    variables: { id: threadId, after: postId || '' },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  if (error) {
    history.push('/error/NOT_FOUND');
  }

  const onLoadMore = useCallback(({
    type, skipping = false, toCursor = null,
  }) => fetchMore({
    query: THREAD_VIEW,
    variables: type === 'after'
      ? { id: threadId, after: skipping ? toCursor : toCursor || (data.thread && data.thread.replies.posts.length > 0 && data.thread.replies.posts.slice(-1)[0].id) || '' }
      : { id: threadId, before: skipping ? toCursor : toCursor || (data.thread && data.thread.replies.posts.length > 0 && data.thread.replies.posts[0].id) || '' },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      const newPosts = fetchMoreResult.thread.replies.posts;
      const newSliceInfo = fetchMoreResult.thread.replies.sliceInfo;
      let posts;
      if (skipping) {
        posts = newPosts;
      } else {
        posts = type === 'after' ? [...prevResult.thread.replies.posts, ...newPosts] : [...newPosts, ...prevResult.thread.replies.posts];
      }
      const updatedData = {
        ...prevResult,
        thread: {
          ...prevResult.thread,
          replies: {
            ...prevResult.thread.replies,
            sliceInfo: newSliceInfo,
            posts,
          },
        },
      };
      return newPosts.length ? updatedData : prevResult;
    },
  }), [fetchMore, data, threadId]);

  const catalog = data.thread ? data.thread.catalog : null;
  const setCursor = useCallback((cursor, index) => {
    if (posMap.has(catalog[index].postId)) {
      window.scrollTo({
        behaviro: 'smooth',
        top: posMap.get(catalog[index].postId) - 48,
      });
    } else {
      onLoadMore({ type: 'after', skipping: true, toCursor: cursor });
      setPosMap(new Map());
      window.scrollTo({
        behavior: 'auto',
        top: 84,
      });
    }
  }, [posMap, catalog, setPosMap, onLoadMore]);

  if ((location.state || {}).refetchThread) {
    refetch();
    history.replace({ state: { refetchThread: false } });
  }

  return useMemo(() => !error && (
    <Thread
      data={data}
      loading={loading}
      refetch={refetch}
      setCursor={setCursor}
      threadId={threadId}
      onLoadMore={onLoadMore}
    />
  ), [data, error, loading, onLoadMore, refetch, setCursor, threadId]);
};
ThreadViewQuery.propTypes = {
  threadId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};
ThreadViewQuery.whyDidYouRender = true;

const PostQuery = ({ postId, threadId }) => {
  const { history } = useRouter();
  const [errCode, setErrCode] = useState('');
  const [offsetPostId, setOffsetPostId] = useState('');
  const [, { startLoading, stopLoading }] = useLoadingBar();
  const handleOnErr = useCallback((e) => {
    setErrCode(e.graphQLErrors[0].extensions.code);
  }, []);
  const { data, loading } = useQuery(GET_POST_CATALOG,
    { variables: { postId, threadId }, onError: handleOnErr });

  useEffect(() => {
    if (loading) {
      startLoading();
    }
    if (!loading) {
      if (errCode === INTERNAL_ERROR || errCode === NOT_FOUND) {
        history.push('/error/NOT_FOUND');
      }
      if (data && data.thread && data.post) {
        const idx = data.thread.catalog.findIndex(ele => ele.postId === postId);
        if (idx > 0) {
          setOffsetPostId(data.thread.catalog[idx - 1].postId);
        }
      }
      stopLoading();
    }
  }, [data, errCode, history, loading, postId, startLoading, stopLoading]);
  return useMemo(() => !errCode && (
    <ThreadViewQuery
      threadId={threadId}
      postId={offsetPostId}
    />
  ), [errCode, offsetPostId, threadId]);
};
PostQuery.propTypes = {
  threadId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};
PostQuery.whyDidYouRender = true;

const ThreadView = ({ match }) => {
  const { params } = match;

  return (
    <>
      {params.postId ? (
        <PostQuery
          postId={params.postId}
          threadId={params.threadId}
        />
      ) : (
        <ThreadViewQuery
          threadId={params.threadId}
          postId=""
        />
      )}
      <FloatBtnWrapper threadId={params.threadId} match={match} />
    </>
  );
};
ThreadView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      threadId: PropTypes.string.isRequired,
      postId: PropTypes.string,
    }),
  }).isRequired,
};
ThreadView.whyDidYouRender = true;

const FloatBtnWrapper = ({ threadId, match }) => {
  const [quotedPosts, setQuotedPosts] = useContext(QuotedPostsContext);
  const { history } = useRouter();

  useEffect(() => {
    setQuotedPosts(new Set());
  }, [match.params, setQuotedPosts]);

  const addReply = () => {
    const quotedIdQueryString = quotedPosts.size > 0 ? `&p=${[...quotedPosts].join('&p=')}` : '';
    history.push(`/draft/post/?reply=${threadId}${quotedIdQueryString}`);
  };
  return (
    <FloatButton title="Compose new reply" onClick={addReply} aboveScrollbar>
      <ChatBubble />
    </FloatButton>
  );
};
FloatBtnWrapper.propTypes = {
  threadId: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      threadId: PropTypes.string.isRequired,
      postId: PropTypes.string,
    }),
  }).isRequired,
};

export default ThreadView;
