import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import FloatButton from 'styles/FloatButton';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'utils/routerHooks';
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

const ThreadViewQuery = ({
  threadId, postId, quotedPosts, handleQuoteToggle,
}) => {
  const { history, location } = useRouter();
  const {
    data, loading, fetchMore, refetch,
  } = useQuery(THREAD_VIEW, { variables: { id: threadId, after: postId || '' }, fetchPolicy: 'cache-and-network', notifyOnNetworkStatusChange: true });

  const onLoadMore = ({
    type, skipping = false, toCursor = null,
  }) => fetchMore({
    query: THREAD_VIEW,
    variables: type === 'after'
      ? { id: threadId, after: toCursor || data.thread.replies.posts.slice(-1)[0].id || '' }
      : { id: threadId, before: toCursor || data.thread.replies.posts[0].id || '' },
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
  });

  const setCursor = (cursor) => {
    onLoadMore({ type: 'after', skipping: true, toCursor: cursor });
  };

  if ((location.state || {}).refetchThread) {
    refetch();
    history.replace({ state: { refetchThread: false } });
  }

  return (
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

const ThreadView = ({ match }) => {
  const { history, location } = useRouter();
  // const [postId, setPostId] = useState('');
  const { params } = match;

  // console.log(location.state, match.params.postId);
  //
  // useEffect(() => {
  //   console.log(location.state, match.params.postId);
  //   if ((!location.state || !location.state.silent) && match.params.postId) {
  //     setPostId(match.params.postId);
  //   }
  // }, [location.state, match.params.postId]);

  const [quotedPosts, setQP] = useState(new Set());
  const handleQuoteToggle = ({ pid }) => {
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
      <ThreadViewQuery
        threadId={params.threadId}
        postId={params.postId || ''}
        quotedPosts={quotedPosts}
        handleQuoteToggle={handleQuoteToggle}
      />
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

export default ThreadView;
