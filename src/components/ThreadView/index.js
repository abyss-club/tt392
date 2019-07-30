import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

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
      replies(query: { before: $before, after: $after, limit: 5}) {
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

const ThreadViewQuery = ({
  threadId, postId, quotedPosts, handleQuoteToggle,
}) => {
  const { history, location } = useRouter();
  // const [errCode, setErrCode] = useState('');
  // const handleOnErr = useCallback((e) => {
  //   console.log(e);
  //   setErrCode(e.graphQLErrors[0].extensions.code);
  // }, []);
  const {
    data, loading, fetchMore, refetch, error,
  } = useQuery(THREAD_VIEW, {
    variables: { id: threadId, after: postId || '' },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    // onError: handleOnErr,
  });
  // useEffect(() => {
  //   if (!loading) {
  //     if (errCode === INTERNAL_ERROR || errCode === NOT_FOUND) {
  //       history.push('/error/NOT_FOUND');
  //     }
  //   }
  // }, [errCode, history, loading]);
  if (error) {
    history.push('/error/NOT_FOUND');
  }

  const onLoadMore = useCallback(({
    type, skipping = false, toCursor = null,
  }) => fetchMore({
    query: THREAD_VIEW,
    variables: type === 'after'
      ? { id: threadId, after: toCursor || (data.thread && data.thread.replies.posts.length > 0 && data.thread.replies.posts.slice(-1)[0].id) || '' }
      : { id: threadId, before: toCursor || (data.thread && data.thread.replies.posts.length > 0 && data.thread.replies.posts[0].id) || '' },
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
      console.log({ newPosts, newSliceInfo, updatedData });
      return newPosts.length ? updatedData : prevResult;
    },
  }), [fetchMore, data, threadId]);

  const setCursor = useCallback((cursor) => {
    onLoadMore({ type: 'after', skipping: true, toCursor: cursor });
  }, [onLoadMore]);

  if ((location.state || {}).refetchThread) {
    refetch();
    history.replace({ state: { refetchThread: false } });
  }

  return !error && (
    <Thread
      data={data}
      loading={loading}
      refetch={refetch}
      setCursor={setCursor}
      threadId={threadId}
      quotedPosts={quotedPosts}
      handleQuoteToggle={handleQuoteToggle}
      onLoadMore={onLoadMore}
    />
  );
};
ThreadViewQuery.propTypes = {
  threadId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  quotedPosts: PropTypes.shape({}).isRequired,
  handleQuoteToggle: PropTypes.func.isRequired,
};
ThreadViewQuery.whyDidYouRender = true;

const PostQuery = ({
  postId, threadId, quotedPosts, handleQuoteToggle,
}) => {
  const { history } = useRouter();
  const [errCode, setErrCode] = useState('');
  const [offsetPostId, setOffsetPostId] = useState('');
  const [, { startLoading, stopLoading }] = useLoadingBar();
  console.log('render PostQuery');
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
      quotedPosts={quotedPosts}
      handleQuoteToggle={handleQuoteToggle}
    />
  ), [errCode, handleQuoteToggle, offsetPostId, quotedPosts, threadId]);
};
PostQuery.propTypes = {
  threadId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  quotedPosts: PropTypes.shape({}).isRequired,
  handleQuoteToggle: PropTypes.func.isRequired,
};
PostQuery.whyDidYouRender = true;

const ThreadView = ({ match }) => {
  const { history } = useRouter();
  const { params } = match;

  const [quotedPosts, setQP] = useState(new Set());
  const handleQuoteToggle = ({ postId: pid }) => {
    setQP((prevQP) => {
      const newQuotedPosts = new Set(prevQP);
      if (newQuotedPosts.has(pid)) {
        newQuotedPosts.delete(pid);
      } else {
        newQuotedPosts.add(pid);
      }
      return newQuotedPosts;
    });
  };
  const addReply = () => {
    const quotedIdQueryString = quotedPosts.size > 0 ? `&p=${[...quotedPosts].join('&p=')}` : '';
    history.push(`/draft/post/?reply=${params.threadId}${quotedIdQueryString}`);
  };

  console.log('render threadview');

  return (
    <>
      {params.postId ? (
        <PostQuery
          postId={params.postId}
          threadId={params.threadId}
          handleQuoteToggle={handleQuoteToggle}
          quotedPosts={quotedPosts}
        />
      ) : (
        <ThreadViewQuery
          threadId={params.threadId}
          postId=""
          quotedPosts={quotedPosts}
          handleQuoteToggle={handleQuoteToggle}
        />
      )}
      <FloatButton title="Compose new reply" onClick={addReply} aboveScrollbar>
        <ChatBubble />
      </FloatButton>
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

export default ThreadView;
