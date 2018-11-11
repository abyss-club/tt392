import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';

import Store from 'providers/Store';
import Query from 'components/Query';
// import colors from 'utils/colors';

import Content from './Content';

const PanelWrapper = styled.div`
`;

const Panel = ({ type, notifications }) => {
  const notis = notifications.map(noti => (
    <Content
      key={noti.id}
      type={type}
      notification={noti}
    />
  ));
  return (
    <PanelWrapper>
      {notis}
    </PanelWrapper>
  );
};
Panel.propTypes = {
  type: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const QueryWrapper = ({ type }) => (
  <Store.Consumer>
    {({ setStore }) => (
      <Query query={getNotification(type)}>
        {({ data }) => (
          <Panel
            type={type}
            notifications={data.notification[type]}
            setStore={setStore}
          />
        )}
      </Query>
    )}
  </Store.Consumer>
);
QueryWrapper.propTypes = {
  type: PropTypes.string.isRequired,
};

function getNotification(type) {
  const fields = {
    system: 'id, type, eventTime, hasRead, title, content',
    replied: 'id, eventTime, hasRead, thread { id, anonymous, author, content, createTime, mainTag, subTags, title, replies(query: { before: "", limit: 3 }) { posts { id, anonymous, content, author, createTime } }, replyCount }, repliers',
    quoted: 'id, eventTime, hasRead, thread { id, anonymous, author, content, createTime, mainTag, subTags, title }, post { id, anonymous, author, content, createTime }, quoter, quotedPost { id, anonymous, author, content, createTime }',
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
