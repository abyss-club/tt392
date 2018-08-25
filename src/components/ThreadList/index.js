import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

import colors from 'utils/colors';
import Query from 'components/Query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'providers/Store';

import ThreadInList from './ThreadInList';

const ThreadListWrapper = styled.div`
  margin: .5em 0;
`;

const THREADSLICE_QUERY = gql`
  query getThreadSlice($subscribedTags: [String!]) {
    threadSlice(tags: $subscribedTags, query: { after: "", limit: 10 }) {
      threads {
        id, anonymous, title, author, content, createTime, mainTag, subTags,
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
  right: 1rem;
  bottom: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${colors.orange};
  color: white;
  border: none;
  outline: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12),0 3px 5px -1px rgba(0,0,0,0.2);
`;

const ThreadList = ({ history }) => (
  <ThreadListWrapper>
    <Store.Consumer>
      {({ tags }) => (
        <Query
          query={THREADSLICE_QUERY}
          variables={{ subscribedTags: [...tags.subscribed.main, ...tags.subscribed.sub] }}
        >
      {({ data }) => {
            const addThread = () => { history.push('/draft/thread/'); };
            return (
              <React-Fragment>
                {data.threadSlice.threads.map(thread => (
                  <ThreadInList key={thread.id} thread={thread} />
                ))}
                <FloatBtn onClick={addThread}>
                  <FontAwesomeIcon icon="plus" />
                </FloatBtn>
              </React-Fragment>
            );
          }}
        </Query>
      )}
    </Store.Consumer>
  </ThreadListWrapper>
);

ThreadList.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default withRouter(ThreadList);
