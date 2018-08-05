import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Tag from 'components/Tag';
import Post from 'components/Post';
import colors from 'utils/colors';

const ThreadWrapper = styled.div`
  padding: .5rem 0;
  cursor: pointer;
`;

const TagsRow = styled.div`
  font-size: .75rem;
  margin: 0;
`;

const ViewThread = styled.p`
  color: ${colors.orange};
`;

const ThreadInList = ({ thread, history }) => {
  const replies = (thread.replies || []).posts || [];
  return (
    <ThreadWrapper onClick={() => { history.push(`/thread/${thread.id}/`); }}>
      <TagsRow>
        <Tag text={thread.mainTag} isMain />
        {(thread.subTags || []).map(t => <Tag key={t} text={t} />)}
      </TagsRow>
      <Post isThread {...thread} />
      <ViewThread>查看整串</ViewThread>
      {replies.map(post => <Post key={post.id} {...post} />)}
    </ThreadWrapper>
  );
};

ThreadInList.propTypes = {
  thread: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default withRouter(ThreadInList);
