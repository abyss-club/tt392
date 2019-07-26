import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useInView } from 'react-intersection-observer';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { useRouter } from 'utils/routerHooks';
import Pen from 'components/icons/Pen';
import LoginContext from 'providers/Login';
import TagsContext from 'providers/Tags';
import RefetchContext from 'providers/Refetch';
import FloatButton from 'styles/FloatButton';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import { LoadMore } from 'styles/Loading';

import ThreadInList from './ThreadInList';

const THREADSLICE_QUERY = gql`
  query getThreadSlice($tags: [String!], $cursor: String!) {
    threadSlice(tags: $tags,  query: { after: $cursor, limit: 2 }) {
      threads {
        id, anonymous, title, author, content, createdAt, mainTag, subTags, replyCount,
        replies(query: { before: "", limit: 5}) {
          posts {
            id, anonymous, author, content, createdAt, quotes { id, author, content, createdAt }
          }
        }
      }
      sliceInfo { firstCursor, lastCursor, hasNext }
    }
  }
`;

const ADD_TAG = gql`
  mutation addSubbedTag($tag: String!) {
    addSubbedTag(tag: $tag) {
      tags
    }
  }
`;

const DEL_TAG = gql`
  mutation delSubbedTag($tag: String!) {
    delSubbedTag(tag: $tag) {
      tags
    }
  }
`;

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

const Threads = ({
  entries, loading, onLoadMore, hasNext,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (inView && !loading) {
      onLoadMore();
    }
  }, [inView, onLoadMore, loading]);
  if (!entries || loading) return <LoadMore />;
  return (
    <>
      {entries.map(thread => (
        <ThreadInList key={thread.id} thread={thread} />
      ))}
      {hasNext && (
        <LoadMore ref={ref} />
      )}
    </>
  );
};
Threads.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

const Subscribe = ({ slug }) => {
  const [{ profile }] = useContext(LoginContext);
  const [{ tags }, dispatch] = useContext(TagsContext);
  const [addSubbedTag, addState] = useMutation(ADD_TAG, { variables: { tag: slug } });
  const [delSubbedTag, delState] = useMutation(DEL_TAG, { variables: { tag: slug } });

  if (!profile.isSignedIn) return null;

  const handleClick = ({ isAdd }) => {
    const isMain = tags.mainTags.has(slug);
    if (isAdd) {
      addSubbedTag();
      if (!addState.error) {
        dispatch({
          type: 'ADD_TAG',
          isMain,
          slug,
        });
      }
    } else {
      delSubbedTag();
      if (!delState.error) {
        dispatch({
          type: 'DEL_TAG',
          isMain,
          slug,
        });
      }
    }
  };

  return [...tags.subscribed.main, ...tags.subscribed.sub].includes(slug)
    ? <SubscribeBtn isSubscribed onClick={() => handleClick({ isAdd: false })}>取消订阅</SubscribeBtn>
    : <SubscribeBtn onClick={() => handleClick({ isAdd: true })}>订阅</SubscribeBtn>;
};
Subscribe.propTypes = {
  slug: PropTypes.string.isRequired,
};

const ThreadList = ({
  type, slug,
}) => {
  const [{ tags }] = useContext(TagsContext);
  const [{ threadList: shouldThreadListRefetch }, dispatch] = useContext(RefetchContext);
  const { history } = useRouter();

  const filterByTags = type === 'home' ? [...tags.subscribed.main, ...tags.subscribed.sub] : [slug];

  const {
    loading, data, fetchMore, refetch,
  } = useQuery(
    THREADSLICE_QUERY, { variables: { tags: filterByTags, cursor: '' } },
  );

  console.log('render threadinlist');

  useEffect(() => {
    if (shouldThreadListRefetch && !loading) {
      refetch();
      dispatch({ type: 'REFETCH_THREADLIST', status: false });
    }
  }, [dispatch, loading, refetch, shouldThreadListRefetch]);

  const addThread = () => { history.push('/draft/thread/'); };
  const threads = !loading ? data.threadSlice.threads : [];
  const sliceInfo = !loading ? data.threadSlice.sliceInfo : {};
  return (
    <>
      {!loading && slug && (
        <TagPanel>
          <TagName>
            #
            {slug}
          </TagName>
          <Subscribe slug={slug} />
        </TagPanel>
      )}
      <Threads
        loading={loading}
        entries={threads || []}
        hasNext={sliceInfo.hasNext || false}
        onLoadMore={() => fetchMore({
          query: THREADSLICE_QUERY,
          variables: { cursor: sliceInfo.lastCursor, tags: filterByTags },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const previousEntry = previousResult.threadSlice.threads;
            const newThreads = fetchMoreResult.threadSlice.threads;
            const newSliceInfo = fetchMoreResult.threadSlice.sliceInfo;
            return newThreads.length ? {
              threadSlice: {
                __typename: previousResult.threadSlice.__typename,
                threads: [...previousEntry, ...newThreads],
                sliceInfo: newSliceInfo,
              },
            } : previousResult;
          },
        })}
      />
      <FloatButton title="Compose new thread" onClick={addThread}>
        <Pen />
      </FloatButton>
    </>
  );
};

ThreadList.propTypes = {
  type: PropTypes.string,
  slug: PropTypes.string,
};
ThreadList.defaultProps = {
  type: 'home',
  slug: '',
};

export default ThreadList;
