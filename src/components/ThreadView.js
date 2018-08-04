import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Post from 'components/Post';

const THREAD_VIEW = gql`
  query Thread($id: String!) {
    thread(id: $id) {
      id, anonymous, title, author, content, createTime, mainTag, subTags,
      replies(query: { after: "", limit: 100}) {
        posts {
          id, anonymous, author, content, createTime
        }
        sliceInfo {
          firstCursor
          lastCursor
        }
      }
    }
  }
`;

const ThreadView = ({ match }) => (
  <Query query={THREAD_VIEW} variables={{ id: match.params.id }}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error...</p>;

      const { thread } = data;
      const replies = (thread.replies || []).posts || [];
      return (
        <div>
          <Post isThread {...thread} />
          {replies.map(post => <Post key={post.id} {...post} />)}
        </div>
      );
    }}
  </Query>
);

ThreadView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default ThreadView;
