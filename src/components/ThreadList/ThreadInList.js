import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { withRouter } from 'react-router-dom';

import Post from 'components/Post';

const ThreadWrapper = styled.div`
  background-color: white;
  border-radius: 16px;
  margin: 1rem;
  padding: 0;
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

const ThreadInList = ({ thread }) => {
  const replies = (thread.replies || []).posts || [];
  return (
    <ThreadWrapper>
      {/* <TagsRow>
        <Tag text={thread.mainTag} isMain />
        {(thread.subTags || []).map(t => <Tag key={t} text={t} />)}
      </TagsRow> */}
      <Post isThread {...thread} hasReplies={replies.length > 0} threadID={thread.id} />
      {/* Border Hack */}
      {/* <div /> */}
      {replies.map(post => <Post key={post.id} {...post} />)}
    </ThreadWrapper>
  );
};

ThreadInList.propTypes = {
  thread: PropTypes.shape({}).isRequired,
  // history: PropTypes.shape({}).isRequired,
};

export default ThreadInList;
