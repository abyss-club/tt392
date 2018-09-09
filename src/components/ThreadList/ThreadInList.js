import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { withRouter } from 'react-router-dom';

import Post from 'components/Post';

const ThreadWrapper = styled.div`
  background-color: white;
  border-radius: 1rem;
  margin: 0.5rem 0;
  padding-top: 0.5rem;
`;

// const TagsRow = styled.div`
//   font-size: .75rem;
//   margin: 0;
// `;

// const ViewThread = styled.p`
//   margin: 1.775rem 2rem 0;
//   font-size: .75em;
//   color: ${colors.accentBlue};
// `;

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
      {/* <TagsRow>
        <Tag text={thread.mainTag} isMain />
        {(thread.subTags || []).map(t => <Tag key={t} text={t} />)}
      </TagsRow> */}
      <Post isThread inList {...thread} hasReplies={replies.length > 0} threadID={thread.id} />
      {/* Border Hack */}
      {/* <div /> */}
      <div>
        {replies.map(post => <Post key={post.id} {...post} />)}
      </div>
      {(replies.length > 0) && (<Footer threadID={thread.id} />)}
    </ThreadWrapper>
  );
};

ThreadInList.propTypes = {
  thread: PropTypes.shape({}).isRequired,
  // history: PropTypes.shape({}).isRequired,
};

export default ThreadInList;
