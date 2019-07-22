import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import colors from 'utils/colors';
import Post from 'components/Post';

const ThreadWrapper = styled.article`
  background-color: white;
  margin: 1rem 0;
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

const More = ({ threadID }) => (
  <MoreWrapper>
    <Link to={`/thread/${threadID}`}>查看整串</Link>
  </MoreWrapper>
);
More.propTypes = {
  threadID: PropTypes.string.isRequired,
};

const ThreadInList = ({ thread }) => {
  const replies = (thread.replies || []).posts || [];
  return (
    <ThreadWrapper>
      <Post isThread inList {...thread} hasReplies={replies.length > 0} threadID={thread.id} />
      <div>
        {replies.map(post => <Post inList key={post.id} threadID={thread.id} {...post} />)}
      </div>
      {(replies.length > 0) && (<More threadID={thread.id} />)}
    </ThreadWrapper>
  );
};

ThreadInList.propTypes = {
  thread: PropTypes.shape({}).isRequired,
};

export default ThreadInList;
