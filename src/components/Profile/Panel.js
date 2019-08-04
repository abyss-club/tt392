import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { useQuery } from '@apollo/react-hooks';
import ScrollForMore from 'components/ScrollForMore';
import { EmptyContent } from 'components/Notification/Content';
import Content from './Content';

const Entries = ({
  entries, loading, onLoadMore, hasNext, type,
}) => (
  <ScrollForMore
    entries={entries}
    loading={loading}
    onLoadMore={onLoadMore}
    hasNext={hasNext}
  >
    {entries.length ? entries.map(entry => (
      <Content
        key={entry.id}
        type={type}
        entry={entry}
      />
    )) : <EmptyContent text="暂无此类信息" />}
  </ScrollForMore>
);
Entries.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  hasNext: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

const QueryWrapper = ({ type }) => {
  const currentQuery = type === 'threads' ? GET_THREADS : GET_POSTS;
  const { data, loading, fetchMore } = useQuery(currentQuery, { variables: { cursor: '' } });
  const sliceInfo = !loading ? data.profile[type].sliceInfo : {};
  const onLoadMore = () => fetchMore({
    query: currentQuery,
    variables: { cursor: sliceInfo.lastCursor },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      const newEntries = fetchMoreResult.profile[type][type];
      const newSliceInfo = fetchMoreResult.profile[type].sliceInfo;
      const updatedData = {
        ...prevResult,
        profile: {
          ...prevResult.profile,
          [type]: {
            ...prevResult.profile[type],
            [type]: [...prevResult.profile[type][type], ...newEntries],
            sliceInfo: newSliceInfo,
          },
        },
      };
      return newEntries.length ? updatedData : prevResult;
    },
  });
  return (
    <Entries
      type={type}
      loading={loading}
      entries={!loading ? data.profile[type][type] : []}
      hasNext={!loading ? data.profile[type].sliceInfo.hasNext : false}
      onLoadMore={onLoadMore}
    />
  );
};
QueryWrapper.propTypes = {
  type: PropTypes.string.isRequired,
};

const GET_THREADS = gql`
  query profile($cursor: String!) {
    profile {
      threads(query: { after: $cursor, limit: 1 }) {
        threads { id, content, createdAt, mainTag, subTags, title }
        sliceInfo { firstCursor, lastCursor, hasNext }
      }
    }
  }
`;

const GET_POSTS = gql`
  query profile($cursor: String!) {
    profile {
      posts(query: { after: $cursor, limit: 1 }) {
        posts { id, author, anonymous, content, createdAt, quotes { id, createdAt, anonymous, author, content } }
        sliceInfo { firstCursor, lastCursor, hasNext }
      }
    }
  }
`;

export default QueryWrapper;
