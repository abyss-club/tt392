import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import colors from 'utils/colors';
import Post from 'components/Post';

const ThreadWrapper = styled.article`
  background-color: white;
  margin: .5rem 0;
  padding-top: 0.5rem;
  border-radius: .5rem;
  :last-of-type {
    margin: 1rem 0 0;
  }
`;

const MoreWrapper = styled.div`
  background-color: ${colors.secondaryBg};
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.75rem 0;
  text-align: center;
  border-radius: 0 0 .5rem .5rem;
  > a {
    color: ${colors.accentGreen};
    text-decoration: none;
  }
`;

const More = ({ threadId }) => (
  <MoreWrapper>
    <Link to={`/t/${threadId}`}>查看整串</Link>
  </MoreWrapper>
);
More.propTypes = {
  threadId: PropTypes.string.isRequired,
};

const ThreadInList = ({ thread }) => {
  const replies = (thread.replies || []).posts || [];
  return (
    <ThreadWrapper>
      <Post
        isThread
        inList
        hasReplies={replies.length > 0}
        threadId={thread.id}
        {...thread}
      />
      <div>
        {replies.map(post => <Post inList key={post.id} threadId={thread.id} {...post} />)}
      </div>
      {(replies.length > 0) && (<More threadId={thread.id} />)}
    </ThreadWrapper>
  );
};

ThreadInList.propTypes = {
  thread: PropTypes.shape({
    replies: PropTypes.shape({
      posts: PropTypes.arrayOf(PropTypes.shape()),
      sliceInfo: PropTypes.shape(),
    }),
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ThreadInList;
