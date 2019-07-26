import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';

import { useQuery } from '@apollo/react-hooks';
import colors from 'utils/colors';
import Content from './Content';
import ScrollForMore from 'components/ScrollForMore';

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

const EmptyPlaceholder = ({ type }) => (
  <EmptyPanel>
    <EmptyHint>
      You currently don&#39;t have any notification of type:
      {' '}
      {`“${type}”`}
      .
    </EmptyHint>
  </EmptyPanel>
);
EmptyPlaceholder.propTypes = {
  type: PropTypes.string.isRequired,
};

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
    )) : <EmptyPlaceholder type={type} />}
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
  const {
    data, loading, error, fetchMore,
} = useQuery(currentQuery, { variables: { cursor: '' } });
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
