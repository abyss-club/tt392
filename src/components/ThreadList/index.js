import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

import colors from 'utils/colors';
import Query from 'components/Query';
import Store from 'providers/Store';

import Pen from 'components/icons/Pen';

import ThreadInList from './ThreadInList';

const THREADSLICE_QUERY = gql`
  query getThreadSlice($tags: [String!]) {
    threadSlice(tags: $tags, query: { after: "", limit: 10 }) {
      threads {
        id, anonymous, title, author, content, createTime, mainTag, subTags, countOfReplies,
        replies(query: { before: "", limit: 5}) {
          posts {
            id, anonymous, author, content, createTime, refers { id, author, content, createTime }
          }
        }
      }
    }
}`;

const FloatBtn = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${colors.buttonBg};
  color: white;
  border: none;
  outline: none;
  font-size: 1em;
  line-height: 0;
  cursor: pointer;
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12),0 3px 5px -1px rgba(0,0,0,0.2);
`;

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
            <FloatBtn onClick={addThread}>
              <Pen />
            </FloatBtn>
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
