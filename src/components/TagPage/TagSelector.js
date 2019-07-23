import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import TagsContext from 'providers/Tags';
import LoginContext from 'providers/Login';
import MainContent from 'styles/MainContent';
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

const TagSelector = () => {
  const [{ profile }] = useContext(LoginContext);
  const [{ tags }, dispatch] = useContext(TagsContext);
  const [currentTag, setCurrentTag] = useState('');
  const [addSubbedTag, addState] = useMutation(ADD_TAG, { variables: { tag: currentTag } });
  const [delSubbedTag, delState] = useMutation(DEL_TAG, { variables: { tag: currentTag } });

  console.log(tags.subscribed);

  const handleClick = ({ tag, isAdd, isMain }, e) => {
    e.preventDefault();
    setCurrentTag(tag);
    console.log({ tag, isAdd, isMain });
    if (isAdd) {
      addSubbedTag();
      if (!addState.error) {
        dispatch({
          type: 'ADD_TAG',
          isMain,
          tag,
        });
      }
    } else {
      delSubbedTag();
      if (!delState.error) {
        dispatch({
          type: 'DEL_TAG',
          isMain,
          tag,
        });
      }
    }
  };

  const SelectableTag = ({ tag, isMain = false, isSubbed }) => (
    <TagInList
      key={tag}
      text={tag}
      isMain={isMain}
      isSubbed={isSubbed}
      disabled={!profile.isSignedIn}
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
        <SelectableTagWrapper>
          {[...tags.mainTags].map(tag => (tags.subscribed.main.has(tag)
            ? SelectableTag({ tag, isMain: true, isSubbed: true })
            : SelectableTag({ tag, isMain: true }))) }
          {[...tags.subTags].map(tag => (tags.subscribed.sub.has(tag)
            ? SelectableTag({ tag, isSubbed: true })
            : SelectableTag({ tag }))) }
        </SelectableTagWrapper>
      </Wrapper>
    </MainContent>
  );
};


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

export default () => (
  <>
    <RequireSignIn />
    <TagSelector />
  </>
);
