import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Store from 'providers/Store';
import MainContent from 'styles/MainContent';
import Query from 'components/Query';
import Tag from 'components/Tag';

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

const flatSubTags = (tree) => {
  const subTags = new Set();
  tree.forEach((node) => {
    (node.subTags || []).forEach(tag => subTags.add(tag));
  });
  return subTags;
};

class TagSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainTags: props.tags.mainTags,
      subTags: flatSubTags(props.tree),
      subscribed: props.tags.subscribed,
    };
  }

  setTagStatus = ({ tag, isMain = false, isAdd }) => {
    if (isMain) {
      this.setState((prevState) => {
        if (isAdd) prevState.subscribed.main.add(tag);
        else prevState.subscribed.main.delete(tag);
        return { subscribed: prevState.subscribed };
      });
    } else {
      this.setState((prevState) => {
        if (isAdd) prevState.subscribed.sub.add(tag);
        else prevState.subscribed.sub.delete(tag);
        return { subscribed: prevState.subscribed };
      });
    }
    this.save({ isAdd, tag });
  }

  save = ({ isAdd, tag }) => {
    const {
      profile, setStore, addSubbedTags, delSubbedTags,
    } = this.props;
    const { main, sub } = this.state.subscribed;
    setStore(prevState => ({
      tags: {
        ...prevState.tags,
        subscribed: { main, sub },
      },
    }));
    setTimeout(() => {
      if (profile.isSignedIn) {
        if (isAdd) addSubbedTags({ variables: { tags: [tag] } });
        else delSubbedTags({ variables: { tags: [tag] } });
      }
    }, 0);
  }

  render() {
    const {
      mainTags, subTags, subscribed,
    } = this.state;
    const SelectableTag = ({ tag, isMain = false, selected = false }) => (
      <TagInList
        key={tag}
        text={tag}
        isMain={isMain}
        selected={selected}
        onClick={() => { this.setTagStatus({ tag, isMain, isAdd: !selected }); }}
      />
    );
    return (
      <MainContent>
        <Wrapper>
          <SelectableTagWrapper>
            {[...mainTags].map(tag => (subscribed.main.has(tag) ?
            SelectableTag({ tag, isMain: true, selected: true }) :
            SelectableTag({ tag, isMain: true }))) }
            {[...subTags].map(tag => (subscribed.sub.has(tag) ?
            SelectableTag({ tag, selected: true }) :
            SelectableTag({ tag }))) }
          </SelectableTagWrapper>
        </Wrapper>
      </MainContent>
    );
  }
}
TagSelector.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape().isRequired,
  tags: PropTypes.shape().isRequired,
  setStore: PropTypes.func.isRequired,
  delSubbedTags: PropTypes.func.isRequired,
  addSubbedTags: PropTypes.func.isRequired,
};

const ADD_TAGS = gql`
  mutation addSubbedTags($tags: [String!]!) {
    addSubbedTags(tags: $tags) {
      tags
    }
  }
`;

const DEL_TAGS = gql`
  mutation delSubbedTags($tags: [String!]!) {
    delSubbedTags(tags: $tags) {
      tags
    }
  }
`;

const TAG_TREE = gql`
  query {
    tags {
      tree {mainTag, subTags}
    }
  }
`;

export default () => (
  <Store.Consumer>
    {({ profile, tags, setStore }) => (
      <Query query={TAG_TREE}>
        {({ data }) => (
          <Mutation mutation={ADD_TAGS}>
            {addSubbedTags => (
              <Mutation mutation={DEL_TAGS}>
                {delSubbedTags => (
                  <TagSelector
                    tree={data.tags.tree}
                    profile={profile}
                    tags={tags}
                    setStore={setStore}
                    addSubbedTags={addSubbedTags}
                    delSubbedTags={delSubbedTags}
                  />
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </Store.Consumer>
);
