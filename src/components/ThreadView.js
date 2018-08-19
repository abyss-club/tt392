import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import qs from 'qs';

import Post from 'components/Post';
import MainContent from 'styles/MainContent';
import colors from 'utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'providers/Store';

// TODO: duplicated to ThreadList/index.js
const FloatBtn = styled.button`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${colors.skyblue};
  color: white;
  border: none;
  outline: none;
  font-size: 1.5rem;
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
          id, anonymous, author, content, createTime, refers { id, author, content, createTime }
        }
        sliceInfo {
          firstCursor
          lastCursor
        }
      }
    }
  }
`;

class ThreadView extends React.Component {
  constructor(props) {
    super(props);
    this.props.setStore({
      quotedPosts: new Set(),
    });
  }

  render() {
    return (
      <Query query={THREAD_VIEW} variables={{ id: this.props.match.params.id }}>
        {({
          loading, error, data, refetch,
        }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error...</p>;

          if ((this.props.location.state || {}).reload) {
            refetch();
          }
          const { thread } = data;
          const replies = (thread.replies || []).posts || [];
          const addReply = (quotedPosts) => {
            const quotedQs = qs.stringify({ p: [...quotedPosts] }, { indices: false });
            this.props.history.push(`/draft/post/?reply=${this.props.match.params.id}&${quotedQs}`);
          };
          return (
            <Store.Consumer>
              {({ quotedPosts }) => (
                <MainContent>
                  <Post isThread {...thread} />
                  {replies.map(post => <Post key={post.id} {...post} quotable postid={post.id} />)}
                  <FloatBtn onClick={() => addReply(quotedPosts)}>
                    <FontAwesomeIcon icon="reply" />
                  </FloatBtn>
                </MainContent>
              )}
            </Store.Consumer>
          );
        }}
      </Query>
    );
  }
}

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
  setStore: PropTypes.func.isRequired,
};

export default props => (
  <Store.Consumer>
    {({ setStore }) => (
      <ThreadView {...props} setStore={setStore} />
    )}
  </Store.Consumer>
);
