import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useInView } from 'react-intersection-observer';

import MainContent, { breakpoint } from 'styles/MainContent';
import Loading from 'styles/Loading';
import FloatButton from 'styles/FloatButton';
import Post from 'components/Post';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'utils/routerHooks';
import ChatBubble from 'components/icons/ChatBubble';
import Scrollbar from 'components/Scrollbar';

const ThreadViewWrapper = styled.div`
  margin: .5rem -0.5rem 0;
  background-color: white;
  min-height: calc(100vh - 7rem);
  border-radius: 1rem 1rem 0 0;
  @media (min-width: ${breakpoint}em) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const THREAD_VIEW = gql`
  query Thread($id: String!, $cursor: String!) {
    thread(id: $id) {
      id, anonymous, title, author, content, createdAt, mainTag, subTags, catalog { postId, createdAt }
      replies(query: { after: $cursor, limit: 5}) {
        posts {
          id, anonymous, author, content, createdAt, quotes { id, author, content, createdAt }
        }
        sliceInfo { firstCursor, lastCursor, hasNext }
      }
    }
  }
`;

const PostWrapper = ({
  entries, loading, onLoadMore, hasNext, threadId, handleQuoteToggle, quotedPosts,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
  });

  console.log('render postwrapper');

  useEffect(() => {
    if (inView) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);
  if (!entries && loading) return <Loading />;
  return (
    <>
      {entries.map(post => (
        <Post
          key={post.id}
          isThread={false}
          postId={post.id}
          onQuoteToggle={handleQuoteToggle}
          isQuoted={quotedPosts.has(post.id)}
          quotable={quotedPosts.size < 3}
          threadId={threadId}
          {...post}
        />
      ))}
      {hasNext && (
        <Loading ref={ref} />
      )}
    </>
  );
};
PostWrapper.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  hasNext: PropTypes.bool.isRequired,
  threadId: PropTypes.string.isRequired,
  handleQuoteToggle: PropTypes.func.isRequired,
  quotedPosts: PropTypes.shape({
    has: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
  }).isRequired,
};

const ThreadView = ({ match }) => {
  const { history } = useRouter();
  const { id } = match.params;
  const [quotedPosts, setQP] = useState(new Set());
  const handleQuoteToggle = ({ postId }) => {
    setQP((prevQP) => {
      const newQuotedPosts = new Set(prevQP);
      if (newQuotedPosts.has(postId)) {
        newQuotedPosts.delete(postId);
      } else {
        newQuotedPosts.add(postId);
      }
      return newQuotedPosts;
    });
  };
  const addReply = () => {
    const quotedIdQueryString = quotedPosts.size > 0 ? `&p=${[...quotedPosts].join('&p=')}` : '';
    history.push(`/draft/post/?reply=${match.params.id}${quotedIdQueryString}`);
  };

  console.log('render threadview');

  const {
    data, loading, error, fetchMore,
  } = useQuery(THREAD_VIEW, { variables: { id, cursor: '' } });

  console.log({ loading, data, error });

  const thread = !loading ? data.thread : {};
  const sliceInfo = !loading ? data.thread.replies.sliceInfo : {};
  const onLoadMore = () => fetchMore({
    query: THREAD_VIEW,
    variables: { id, cursor: sliceInfo.lastCursor },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      const newPosts = fetchMoreResult.thread.replies.posts;
      const newSliceInfo = fetchMoreResult.thread.replies.sliceInfo;
      const updatedData = {
        ...prevResult,
        thread: {
          ...prevResult.thread,
          replies: {
            __typename: prevResult.thread.replies.__typename,
            sliceInfo: newSliceInfo,
            posts: [...prevResult.thread.replies.posts, ...newPosts],
          },
        },
      };
      return newPosts.length ? updatedData : prevResult;
    },
  });

  return !loading && (
    <MainContent>
      <ThreadViewWrapper>
        <Post isThread {...thread} threadId={id} />
        <PostWrapper
          loading={loading}
          entries={data.thread.replies.posts || []}
          hasNext={sliceInfo.hasNext || false}
          quotedPosts={quotedPosts}
          threadId={thread.id}
          handleQuoteToggle={handleQuoteToggle}
          onLoadMore={onLoadMore}
        />
      </ThreadViewWrapper>
      <FloatButton title="Compose new reply" onClick={addReply} aboveScrollbar>
        <ChatBubble />
      </FloatButton>
      {false && (<Scrollbar catalog={thread.catalog} />)}
    </MainContent>
  );
};
ThreadView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default ThreadView;
