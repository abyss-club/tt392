import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Post from 'components/Post';
import MainContent from 'styles/MainContent';
import colors from 'utils/colors';

// TODO: duplicated to ThreadList/index.js
const WritePost = styled.button`
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
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12),0 3px 5px -1px rgba(0,0,0,0.2);
`;

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

const ThreadView = ({ match, history, location }) => (
  <Query query={THREAD_VIEW} variables={{ id: match.params.id }}>
    {({
      loading, error, data, refetch,
    }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error...</p>;

      if ((location.state || {}).reload) {
        refetch();
      }
      const { thread } = data;
      const replies = (thread.replies || []).posts || [];
      const addReply = () => {
        history.push(`/draft/post/?reply=${match.params.id}`);
      };
      return (
        <MainContent>
          <Post isThread {...thread} />
          {replies.map(post => <Post key={post.id} {...post} />)}
          <WritePost onClick={addReply}>+</WritePost>
        </MainContent>
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
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape().isRequired,
};

export default ThreadView;
