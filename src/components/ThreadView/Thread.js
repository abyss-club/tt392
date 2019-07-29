import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MainContent, { breakpoint } from 'styles/MainContent';
import Post from 'components/Post';

import colors from 'utils/colors';
import Scrollbar from 'components/Scrollbar';
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

const OffsetPosContext = React.createContext();
const OffsetPosProvider = ({ children }) => {
  const [posMap, setPosMap] = useState(new Map());
  return (
    <OffsetPosContext.Provider value={[posMap, setPosMap]}>
      {children}
    </OffsetPosContext.Provider>
  );
};
OffsetPosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const OffsetPosWrapper = ({ postId, children }) => {
  const scrollRef = useRef(null);
  const [, setPosMap] = useContext(OffsetPosContext);
  useEffect(() => {
    setPosMap((prevMap) => {
      prevMap.set(postId, scrollRef.current.offsetTop);
      return prevMap;
    });
  }, [postId, setPosMap]);

  return (
    <ScrolledPostWrapper ref={scrollRef}>
      {children}
    </ScrolledPostWrapper>
  );
};
OffsetPosWrapper.propTypes = {
  postId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const PostWrapper = ({
  entries, loading, onLoadMore, threadId, handleQuoteToggle, quotedPosts, catalog,
}) => (
  <OffsetPosProvider>
    <ScrollForMorePosts
      entries={entries}
      loading={loading}
      onLoadMore={onLoadMore}
      catalog={catalog}
    >
      {entries.map(post => (
        <OffsetPosWrapper key={post.id} postId={post.id}>
          <Post
            isThread={false}
            postId={post.id}
            handleQuoteToggle={handleQuoteToggle}
            isQuoted={quotedPosts.has(post.id)}
            quotable={quotedPosts.size < 3}
            threadId={threadId}
            {...post}
          />
        </OffsetPosWrapper>
      ))}
    </ScrollForMorePosts>
  </OffsetPosProvider>
);
PostWrapper.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
  handleQuoteToggle: PropTypes.func.isRequired,
  quotedPosts: PropTypes.shape({
    has: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
  }).isRequired,
  catalog: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const PositionContext = React.createContext();
const PositionProvider = ({ children }) => {
  const [postId, setPostId] = useState(0);
  return (
    <PositionContext.Provider value={[postId, setPostId]}>
      {children}
    </PositionContext.Provider>
  );
};
PositionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const Thread = ({
  data, loading, onLoadMore, setCursor, threadId, handleQuoteToggle, quotedPosts,
}) => {
  const { thread } = data;
  return (
    <MainContent>
      <PositionProvider thread={thread} threadId={threadId} setCursor={setCursor}>
        <ThreadViewWrapper>
          {!loading && <Post isThread {...thread} threadId={threadId} />}
          <PostWrapper
            loading={loading}
            entries={thread ? thread.replies.posts : []}
            quotedPosts={quotedPosts}
            threadId={threadId}
            handleQuoteToggle={handleQuoteToggle}
            onLoadMore={onLoadMore}
            catalog={thread ? thread.catalog : []}
          />
        </ThreadViewWrapper>
        <Scrollbar
          catalog={thread ? thread.catalog : []}
          setCursor={setCursor}
          threadId={threadId}
        />
      </PositionProvider>
    </MainContent>
  );
};
Thread.propTypes = {
  threadId: PropTypes.string.isRequired,
  quotedPosts: PropTypes.shape({}).isRequired,
  handleQuoteToggle: PropTypes.func.isRequired,
  data: PropTypes.shape({
    thread: PropTypes.shape.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  setCursor: PropTypes.func.isRequired,
};

export default Thread;
export { PositionContext, OffsetPosContext };
