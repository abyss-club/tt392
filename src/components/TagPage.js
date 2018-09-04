import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import Store from 'providers/Store';
import Query from 'components/Query';
import Tag from 'components/Tag';

const Wrapper = styled.div`
  margin-top: .5rem;
  > p {
    margin: 0;
  }
`;

const SelectableTagWrapper = styled.div`
  margin: -0.125rem;
  margin-top: .5rem;
  display: flex;
  flex-flow: row wrap;
`;

const TagInList = styled(Tag)`
  margin: .125rem;
`;

const SaveBtnWrapper = styled.button`
  color: white;
  background-color: ${colors.orange};
  font-size: 1em;
  font-family: ${fontFamilies.system};
  border: 0;
  border-radius: 5px;
  height: 2em;
  padding: .25em .5em;
  margin: 0 .125em;
  line-height: 1.5;
`;

const SaveBtn = ({ onClick }) => (
  <SaveBtnWrapper onClick={onClick} >
    <FontAwesomeIcon icon="check" />
  </SaveBtnWrapper>
);
SaveBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
};


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
  }

  save = () => {
    const { profile, setStore, syncTags } = this.props;
    const { main, sub } = this.state.subscribed;
    setStore(prevState => ({
      tags: {
        ...prevState.tags,
        subscribed: { main, sub },
      },
    }));
    setTimeout(() => {
      if (profile.isSignedIn) {
        syncTags({ variables: { tags: [...main, ...sub] } });
      }
    }, 0);
  }

  render() {
    const {
      mainTags, subTags, subscribed,
    } = this.state;
    // const main = [...mainTags].filter(tag => !subscribed.main.has(tag));
    // const sub = [...subTags].filter(tag => !subscribed.sub.has(tag));
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
      <Wrapper>
        <SaveBtn onClick={this.save} />
        <SelectableTagWrapper>
          {[...mainTags].map(tag => (subscribed.main.has(tag) ?
            SelectableTag({ tag, isMain: true, selected: true }) :
            SelectableTag({ tag, isMain: true }))) }
          {[...subTags].map(tag => (subscribed.sub.has(tag) ?
            SelectableTag({ tag, selected: true }) :
            SelectableTag({ tag }))) }
        </SelectableTagWrapper>
      </Wrapper>
    );
  }
}
TagSelector.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  profile: PropTypes.shape().isRequired,
  tags: PropTypes.shape().isRequired,
  setStore: PropTypes.func.isRequired,
  syncTags: PropTypes.func.isRequired,
};

const UPDATE_SUBBED_TAGS = gql`
  mutation updateSubbedTags($tags: [String]!) {
    syncTags(tags: $tags) {
      name
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
          <Mutation mutation={UPDATE_SUBBED_TAGS}>
            {syncTags => (
              <TagSelector
                tree={data.tags.tree}
                profile={profile}
                tags={tags}
                setStore={setStore}
                syncTags={syncTags}
              />
            )}
          </Mutation>
        )}
      </Query>
    )}
  </Store.Consumer>
);
