import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* eslint-disable no-alert */
const confirm = text => window.confirm(text);
/* eslint-enable */

const AdminActions = ({ postId, threadId }) => {
  const [blockThread] = useMutation(BLOCK_THREAD, { variables: { threadId } });
  // TODO: 锁串
  // const [lockThread] = useMutation(LOCK_THREAD, { variables: { threadId } });
  const [blockPost] = useMutation(BLOCK_POST, { variables: { postId } });

  /* TODO: 锁串
  const handleLockThread = () => {
    if (confirm('确定要锁定此讨论串吗？')) {
      lockThread();
      window.location.reload(true);
    }
  };
  */

  const handleBlock = () => {
    if (!!postId && postId !== '') {
      if (confirm('确定要屏蔽此回复吗？')) {
        blockPost();
        window.location.reload(true);
      }
    } else if (confirm('确定要屏蔽此讨论串吗？')) {
      blockThread();
      window.location.reload(true);
    }
  };

  /* TODO: 锁串
      {!postId && !locked && (
      <button type="button" onClick={handleLockThread}>
        <FontAwesomeIcon icon="lock" />
        锁
      </button>
      )}
  */

  return (
    <p>
      <button type="button" onClick={handleBlock}>
        <FontAwesomeIcon icon="ban" />
        封
      </button>
    </p>
  );
};
AdminActions.propTypes = {
  postId: PropTypes.string,
  threadId: PropTypes.string.isRequired,
  // locked: PropTypes.bool,
};
AdminActions.defaultProps = {
  postId: '',
  // locked: false,
};

const BLOCK_THREAD = gql`
  mutation blockThread($threadId: String!) {
    blockThread(threadId: $threadId) {
      blocked
    }
  }
`;

/*
const LOCK_THREAD = gql`
  mutation lockThread($threadId: String!) {
    lockThread(threadId: $threadId) {
      locked
    }
  }
`;
*/

const BLOCK_POST = gql`
mutation blockPost($postId: String!) {
  blockPost(postId: $postId) {
    blocked
  }
}
`;

export default AdminActions;
