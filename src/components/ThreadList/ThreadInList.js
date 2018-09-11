import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Post from 'components/Post';

const ThreadWrapper = styled.div`
  background-color: white;
  border-radius: 1rem;
  margin: 0.5rem 0;
  padding-top: 0.5rem;
`;

const FooterWrapper = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.75rem 0;
  text-align: center;
  > a {
    color: inherit;
    text-decoration: none;
  }
`;

const Footer = ({ threadID }) => (
  <FooterWrapper>
    <Link to={`/thread/${threadID}`}>查看整串</Link>
  </FooterWrapper>
);
Footer.propTypes = {
  threadID: PropTypes.number.isRequired,
};

const ThreadInList = ({ thread }) => {
  const replies = (thread.replies || []).posts || [];
  return (
    <ThreadWrapper>
      <Post isThread inList {...thread} hasReplies={replies.length > 0} threadID={thread.id} />
      <div>
        {replies.map(post => <Post inList key={post.id} threadID={thread.id} {...post} />)}
      </div>
      {(replies.length > 0) && (<Footer threadID={thread.id} />)}
    </ThreadWrapper>
  );
};

ThreadInList.propTypes = {
  thread: PropTypes.shape({}).isRequired,
};

export default ThreadInList;
