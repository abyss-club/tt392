import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ThreadInList from './ThreadInList';

const ThreadListWrapper = styled.div`
  padding: .5em;
`;

const THREADSLICE_QUERY = gql`
  query {
    threadSlice(query: { after: "", limit: 10 }) {
      threads {
        id, anonymous, title, author, content, createTime, mainTag, subTags
      }
    }
}`;

const ThreadList = () => (
  <ThreadListWrapper>
    <Query query={THREADSLICE_QUERY}>
      {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
       return (
         <pre>
           {error.graphQLErrors.map(({ message }) => (
             <span key={message}>{message}</span>
           ))}
         </pre>
        );
      }

        return (
          <React-Fragment>
            {data.threadSlice.threads.map(thread => (
              <ThreadInList key={thread.id} thread={thread} />
            ))}
          </React-Fragment>
        );
      }}
    </Query>
  </ThreadListWrapper>
);

export default ThreadList;
