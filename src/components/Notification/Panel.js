import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import ScrollForMore from 'components/ScrollForMore';
import { useQuery } from '@apollo/react-hooks';
import Content, { EmptyContent } from './Content';

const Notis = ({
  entries, loading, onLoadMore, hasNext, type,
}) => (
  <ScrollForMore
    entries={entries}
    loading={loading}
    onLoadMore={onLoadMore}
    hasNext={hasNext}
  >
    {entries.length ? entries.map(noti => (
      <Content
        key={noti.id}
        type={type}
        notification={noti}
      />
    )) : <EmptyContent text="暂无此类消息" />}
  </ScrollForMore>
);
Notis.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  hasNext: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

const QueryWrapper = ({ type }) => {
  const { data, loading, fetchMore } = useQuery(getNotification(type), { variables: { cursor: '' } });
  const sliceInfo = !loading ? data.notification.sliceInfo : {};
  const onLoadMore = () => fetchMore({
    query: getNotification(type),
    variables: { cursor: sliceInfo.lastCursor },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      const newNotis = fetchMoreResult.notification[type];
      const newSliceInfo = fetchMoreResult.notification.sliceInfo;
      const updatedData = {
        ...prevResult,
        notification: {
          ...prevResult.notification,
          [type]: [...prevResult.notification[type], ...newNotis],
          sliceInfo: newSliceInfo,
        },
      };
      return newNotis.length ? updatedData : prevResult;
    },
  });
  return (
    <Notis
      type={type}
      loading={loading}
      entries={!loading ? data.notification[type] : []}
      hasNext={!loading ? data.notification.sliceInfo.hasNext : false}
      onLoadMore={onLoadMore}
    />
  );
};
QueryWrapper.propTypes = {
  type: PropTypes.string.isRequired,
};

/**
 *
 *
 * @param {string} type One of 'system', 'replied' or 'quoted'
 * @returns {string} graphql template
 */
function getNotification(type) {
  const fields = {
    system: 'id, type, eventTime, hasRead, title, content',
    replied: 'id, eventTime, hasRead, thread { id, anonymous, author, content, createdAt, mainTag, subTags, title, replies(query: { before: "", limit: 5 }) { posts { id, anonymous, content, author, createdAt } }, replyCount }, repliers',
    quoted: 'id, eventTime, hasRead, thread { id, anonymous, author, content, createdAt, mainTag, subTags, title }, post { id, anonymous, author, content, createdAt }, quotedPost { id, anonymous, author, content, createdAt }',
  };
  /* eslint-disable graphql/template-strings */
  return gql`
    query Notification($cursor: String!) {
      notification(type: "${type}", query: { after: $cursor, limit: 5 }) {
        ${type} {
          ${fields[type]}
        }
        sliceInfo {
          firstCursor, lastCursor, hasNext
        }
      }
    }
  `;
  /* eslint-enable graphql/template-strings */
}

export default QueryWrapper;
