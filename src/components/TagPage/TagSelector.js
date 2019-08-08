import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import TagsContext from 'providers/Tags';
import LoginContext from 'providers/Login';
import MainContent from 'styles/MainContent';
import { useRouter } from 'utils/routerHooks';
import Tag from 'components/Tag';
import RequireSignIn from 'components/RequireSignIn';

const Wrapper = styled.div`
  margin: .5rem .875rem 0;
  > p {
    margin: 0;
  }
`;

const SelectableTagWrapper = styled.div`
  margin-top: .5rem;
  display: flex;
  flex-flow: row wrap;
`;

const TagInList = styled(Tag)`
  margin: .125rem;
`;

const TagTypeWrapper = styled.div`
  margin-bottom: .5rem;
`;

const UpdateProfile = () => {
  const { history } = useRouter();
  const {
    data, loading,
  } = useQuery(PROFILE_TAGS);

  const [, dispatch] = useContext(TagsContext);
  if (!data || !data.profile) {
    history.push('/sign_in');
  }
  const { profile } = data;

  useEffect(() => {
    if (!loading) {
      dispatch({
        type: 'UPDATE_SUBSCRIBED_TAGS',
        profile,
      });
    }
  }, [dispatch, loading, profile]);
  return (
    <TagSelector loading={loading} />
  );
};

const TagSelector = ({ loading }) => {
  const [{ profile }] = useContext(LoginContext);
  const [currentTag, setCurrentTag] = useState('');
  // const [loadingTags, setLoadingTags] = useState(new Set());
  const [type, setType] = useState(null);
  const subTagsState = useQuery(GET_SUBTAGS);
  const [{ tags }] = useContext(TagsContext);
  const [addSubbedTag] = useMutation(ADD_TAG, {
    variables: { tag: currentTag },
    // refetchQueries: PROFILE_TAGS,
    update: (cache, data) => {
      cache.writeQuery({
        query: PROFILE_TAGS,
        data: { profile: { __typename: 'User', tags: data.data.addSubbedTag.tags } },
      });
    },
  });
  const [delSubbedTag] = useMutation(DEL_TAG, {
    variables: { tag: currentTag },
    // refetchQueries: PROFILE_TAGS,
    update: (cache, data) => {
      cache.writeQuery({
        query: PROFILE_TAGS,
        data: { profile: { __typename: 'User', tags: data.data.delSubbedTag.tags } },
      });
    },
  });

  const subTags = (subTagsState.data.tags
    && subTagsState.data.tags.length > 0)
    ? subTagsState.data.tags.filter(tag => !tag.isMain).map(tag => tag.name) : [];

  const handleClick = ({ tag, isAdd }) => {
    setCurrentTag(tag);
    setType(isAdd ? 'add' : 'del');
  };

  useEffect(() => {
    if (currentTag !== '') {
      if (type === 'add') {
        addSubbedTag();
        setType(null);
      }
      if (type === 'del') {
        delSubbedTag();
        setType(null);
      }
      setCurrentTag('');
    }
  }, [addSubbedTag, currentTag, delSubbedTag, type]);

  const SelectableTag = ({ tag, isMain = false, isSubbed }) => (
    <TagInList
      key={tag}
      text={tag}
      isMain={isMain}
      isSubbed={isSubbed}
      disabled={!profile.isSignedIn && !loading}
      onClick={(e) => { handleClick({ tag, isAdd: !isSubbed, isMain }, e); }}
    />
  );
  SelectableTag.propTypes = {
    tag: PropTypes.string.isRequired,
    isMain: PropTypes.bool.isRequired,
    isSubbed: PropTypes.bool.isRequired,
  };

  return (
    <MainContent>
      <Wrapper>
        <TagTypeWrapper>
          <h2>MainTags</h2>
          <SelectableTagWrapper>
            {[...tags.mainTags].map(tag => (tags.subscribed.main.has(tag)
              ? SelectableTag({ tag, isMain: true, isSubbed: true })
              : SelectableTag({ tag, isMain: true }))) }
          </SelectableTagWrapper>
        </TagTypeWrapper>
        <TagTypeWrapper>
          <h2>SubTags</h2>
          <SelectableTagWrapper>
            {subTags.map(tag => (tags.subscribed.sub.has(tag)
              ? SelectableTag({ tag, isSubbed: true })
              : SelectableTag({ tag })))}
          </SelectableTagWrapper>
          <p>{subTagsState.loading && 'Loading...'}</p>
        </TagTypeWrapper>
      </Wrapper>
    </MainContent>
  );
};
TagSelector.propTypes = {
  loading: PropTypes.bool.isRequired,
};
TagSelector.whyDidYouRender = true;

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

const GET_SUBTAGS = gql`
  query getSubTags {
    tags(limit: 20) {
      name, isMain, belongsTo
    }
  }
`;

const PROFILE_TAGS = gql`
  query {
    profile {
      tags
    }
  }
`;

export default () => (
  <>
    <RequireSignIn />
    <UpdateProfile />
  </>
);
