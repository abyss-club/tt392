import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

import Query from 'components/Query';
import Pen from 'components/icons/Pen';
import Store from 'providers/Store';
import FloatButton from 'styles/FloatButton';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';

import ThreadInList from './ThreadInList';

const THREADSLICE_QUERY = gql`
  query getThreadSlice($tags: [String!]) {
    threadSlice(tags: $tags, query: { after: "", limit: 10 }) {
      threads {
        id, anonymous, title, author, content, createdAt, mainTag, subTags, replyCount,
        replies(query: { before: "", limit: 5}) {
          posts {
            id, anonymous, author, content, createdAt, quotes { id, author, content, createdAt }
          }
        }
      }
    }
}`;

const TagPanel = styled.div`
  width: 100%;
  position: relative;

  background-color: white;
  margin: 0.5rem 0 0rem;
  padding: 1.75rem 1rem 0;
  border-radius: .5rem .5rem 0 0;

  display: inline-flex;
  flex-flow: row wrap;
  align-items: center;

  :after {
    content: "";
    display: block;
    width: calc(100% - 2rem);
    border-bottom: 1px solid ${colors.borderGrey};
    margin: 0 1rem;
    padding-top: 1.75rem;
  }
  + article {
    border-radius: 0 0 .5rem .5rem;
    margin: 0 0 1rem;
  }
`;

const TagName = styled.h2`
  font-size: 1.5em;
  font-weight: 600;
`;

const SubscribeBtn = styled.button`
  margin-left: auto;

  ${props => (props.isSubscribed ? `
  background-color: unset;
  color: ${colors.regularGrey};]
  border: 1px solid ${colors.regularGrey};
  ` : `
  background-color: ${colors.accentGreen};
  color: white;
  border: none;
  `)}
  font-size: 0.6875em;
  border-radius: 1rem;
  height: 2rem;
  padding: .25em 1.5em;
  font-family: ${fontFamilies.system};
  cursor: pointer;
  > svg {
    > path {
      stroke: ${props => (props.ismain ? 'white' : colors.tagRed)};
    }
  }
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
            {slug && (
              <TagPanel>
                <TagName>
                  #
                  {slug}
                </TagName>
                {[...tags.subscribed.main, ...tags.subscribed.sub].includes(slug)
                  ? <SubscribeBtn isSubscribed>取消订阅</SubscribeBtn>
                  : <SubscribeBtn>订阅</SubscribeBtn>}
              </TagPanel>
            )}
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
