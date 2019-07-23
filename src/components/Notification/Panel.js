import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';

import NotiContext from 'providers/Noti';
import { useQuery } from '@apollo/react-hooks';
import colors from 'utils/colors';
// import colors from 'utils/colors';

import Content from './Content';

const EmptyPanel = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
`;

const EmptyHint = styled.p`
  text-align: center;
  font-size: 1.25em;
  font-weight: 300;
  color: ${colors.textGrey};
`;

const Panel = ({ type, notifications }) => {
  const notis = notifications.length && notifications.slice().reverse().map(noti => (
    <Content
      key={noti.id}
      type={type}
      notification={noti}
    />
  ));
  return (
    <div>
      {notifications.length ? notis : (
        <EmptyPanel>
          <EmptyHint>
            You currently don&#39;t have any notification of type:
            {' '}
            {`“${type}”`}
            .
          </EmptyHint>
        </EmptyPanel>
      )}
    </div>
  );
};
Panel.propTypes = {
  type: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const QueryWrapper = ({ type }) => {
  const { data, loading, error } = useQuery(getNotification(type));
  return !loading && (
  <Panel
    type={type}
    notifications={data.notification[type]}
  />
  );
};
QueryWrapper.propTypes = {
  type: PropTypes.string.isRequired,
};

function getNotification(type) {
  const fields = {
    system: 'id, type, eventTime, hasRead, title, content',
    replied: 'id, eventTime, hasRead, thread { id, anonymous, author, content, createdAt, mainTag, subTags, title, replies(query: { before: "", limit: 3 }) { posts { id, anonymous, content, author, createdAt } }, replyCount }, repliers',
    quoted: 'id, eventTime, hasRead, thread { id, anonymous, author, content, createdAt, mainTag, subTags, title }, post { id, anonymous, author, content, createdAt }, quotedPost { id, anonymous, author, content, createdAt }',
  };
  return gql`
    query Notification {
      notification(type: "${type}", query: { after: "", limit: 10 }) {
        ${type} {
          ${fields[type]}
        }
      }
    }
  `;
}

export default QueryWrapper;
