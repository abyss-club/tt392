import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';

import MainContent, { breakpoint } from 'styles/MainContent';
import FloatButton from 'styles/FloatButton';
import Post from 'components/Post';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'utils/routerHooks';
import colors from 'utils/colors';
import ChatBubble from 'components/icons/ChatBubble';
import Scrollbar from 'components/Scrollbar';
import CatalogContext from 'providers/Catalog';
import { ScrollForMorePosts } from 'components/ScrollForMore';

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

const ScrolledPostWrapper = styled.div`
  background-color: ${props => (props.isThread ? 'unset' : 'white')};
  :not(:last-of-type):after {
    content: "";
    display: block;
    width: calc(100% - 3rem);
    border-bottom: 1px solid ${colors.borderGrey};
    margin: 0 1.5rem;
  }
  :last-of-type {
    ${props => (props.inList ? 'padding-bottom: 0;' : 'padding-bottom: 1rem;')}
    border-bottom: none;
  }
  @media (min-width: ${breakpoint}em) {
    padding-left: 0;
    padding-right: 0;
  }
  :not(:last-of-type) {
    > div {
      padding-bottom: 0;
    }
  }
`;

const ScrollWrapper = ({ postId, children }) => {
  const scrollRef = useRef(null);
  const [{ threadView }, dispatch] = useContext(CatalogContext);
  useEffect(() => {
    const tempMap = threadView;
    threadView.set(postId, scrollRef.current.offsetTop);
    dispatch({ type: 'SET_THREADVIEW_CATALOG', catalog: tempMap });
  }, [dispatch, postId, threadView]);

  return (
    <ScrolledPostWrapper ref={scrollRef}>
      {children}
    </ScrolledPostWrapper>
  );
};
ScrollWrapper.propTypes = {
  postId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const PostWrapper = ({
  entries, loading, onLoadMore, hasNext, threadId, handleQuoteToggle, quotedPosts, catalog,
}) => (
  <ScrollForMorePosts
    entries={entries}
    loading={loading}
    onLoadMore={onLoadMore}
    hasNext={hasNext}
    catalog={catalog}
  >
    {entries.map(post => (
      <ScrollWrapper key={post.id} postId={post.id}>
        <Post
          isThread={false}
          postId={post.id}
          handleQuoteToggle={handleQuoteToggle}
          isQuoted={quotedPosts.has(post.id)}
          quotable={quotedPosts.size < 3}
          threadId={threadId}
          {...post}
        />
      </ScrollWrapper>
    ))}
  </ScrollForMorePosts>
);
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
  catalog: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const ThreadView = ({ match }) => {
  const [, dispatchCatalog] = useContext(CatalogContext);
  const [cursor, setCursor] = useState('');
  useEffect(() => { dispatchCatalog({ type: 'RESET_CATALOG' }); }, [dispatchCatalog]);

  const { history, location } = useRouter();
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
    data, loading, fetchMore, refetch,
  } = useQuery(THREAD_VIEW, { variables: { id, after: cursor } });

  const thread = !loading ? data.thread : {};
  const sliceInfo = !loading ? data.thread.replies.sliceInfo : {};
  const onLoadMore = ({ type }) => fetchMore({
    query: THREAD_VIEW,
    variables: type === 'after' ? { id, after: sliceInfo.lastCursor } : { id, before: sliceInfo.firstCursor },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      const newPosts = fetchMoreResult.thread.replies.posts;
      const newSliceInfo = fetchMoreResult.thread.replies.sliceInfo;
      const updatedData = {
        ...prevResult,
        thread: {
          ...prevResult.thread,
          replies: {
            ...prevResult.thread.replies,
            sliceInfo: {
              ...newSliceInfo,
              hasBefore: type === 'after' ? false : newSliceInfo.hasNext,
              hasNext: type === 'after' ? newSliceInfo.hasNext : false,
            },
            posts: type === 'after' ? [...prevResult.thread.replies.posts, ...newPosts] : [...newPosts, ...prevResult.thread.replies.posts],
          },
        },
      };
      console.log({ newPosts, newSliceInfo, updatedData });
      return newPosts.length ? updatedData : prevResult;
    },
  });

  if ((location.state || {}).refetchThread) {
    refetch();
    history.replace({ state: { refetchThread: false } });
  }

  return !loading && (
    <MainContent>
      <ThreadViewWrapper>
        <Post isThread {...thread} threadId={id} />
        <PostWrapper
          loading={loading}
          entries={thread.replies.posts || []}
          hasNext={sliceInfo.hasNext || false}
          hasBefore={sliceInfo.hasBefore || false}
          quotedPosts={quotedPosts}
          threadId={thread.id}
          handleQuoteToggle={handleQuoteToggle}
          onLoadMore={onLoadMore}
          catalog={thread.catalog}
        />
      </ThreadViewWrapper>
      <FloatButton title="Compose new reply" onClick={addReply} aboveScrollbar>
        <ChatBubble />
      </FloatButton>
      {!loading && (<Scrollbar catalog={thread.catalog} setCursor={setCursor} />)}
    </MainContent>
  );
};
ThreadView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default ThreadView;
