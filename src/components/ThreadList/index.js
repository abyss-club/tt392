import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

import Query from 'components/Query';
import Pen from 'components/icons/Pen';
import Store from 'providers/Store';
import FloatButton from 'styles/FloatButton';
// import colors from 'utils/colors';

import ThreadInList from './ThreadInList';

const THREADSLICE_QUERY = gql`
  query getThreadSlice($tags: [String!]) {
    threadSlice(tags: $tags, query: { after: "", limit: 10 }) {
      threads {
        id, anonymous, title, author, content, createTime, mainTag, subTags, replyCount,
        replies(query: { before: "", limit: 5}) {
          posts {
            id, anonymous, author, content, createTime, quotes { id, author, content, createTime }
          }
        }
      }
    }
}`;

const ThreadList = ({
  history, type, tags, slug, initialized,
}) => {
  if (!initialized) {
    return null;
  }

  const filterByTags = type === 'home' ? [...tags.subscribed.main, ...tags.subscribed.sub] : [slug];
  return (
    <Query
      query={THREADSLICE_QUERY}
      variables={{ tags: filterByTags }}
    >
      {({ data }) => {
        const addThread = () => { history.push('/draft/thread/'); };
        return (
          <React-Fragment>
            {data.threadSlice.threads.map(thread => (
              <ThreadInList key={thread.id} thread={thread} />
            ))}
            <FloatButton onClick={addThread}>
              <Pen />
            </FloatButton>
          </React-Fragment>
        );
      }}
    </Query>
  );
};

ThreadList.propTypes = {
  history: PropTypes.shape().isRequired,
  type: PropTypes.string,
  initialized: PropTypes.bool.isRequired,
  tags: PropTypes.shape().isRequired,
  slug: PropTypes.string,
};
ThreadList.defaultProps = {
  type: 'home',
  slug: '',
};

const ThreadListWithRouter = withRouter(ThreadList);

export default props => (
  <Store.Consumer>
    {({ initialized, tags }) => (
      <ThreadListWithRouter {...props} tags={tags} initialized={initialized} />
    )}
  </Store.Consumer>
);
