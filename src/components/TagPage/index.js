import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';

// import colors from 'utils/colors';
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
  margin-top: .5rem;
  display: flex;
  flex-flow: row wrap;
`;

const TagInList = styled(Tag)`
  margin: .125rem;
`;

const BackBtnWrapper = styled.button`
  color: black;
  background-color: white;
  font-size: 1em;
  font-family: ${fontFamilies.system};
  border: 1px solid #43484C;
  border-radius: 5px;
  height: 2em;
  padding: .25em .5em;
  margin: 0 .125em;
  line-height: 1.5;
`;

const BackBtn = ({ onClick }) => (
  <BackBtnWrapper onClick={onClick} >
    <FontAwesomeIcon icon="chevron-left" />返回
  </BackBtnWrapper>
);
BackBtn.propTypes = {
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
    const { history } = this.props;
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
        <BackBtn onClick={() => { history.goBack(); }} />
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
  delSubbedTags: PropTypes.func.isRequired,
  addSubbedTags: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
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

const TagSelectorWithRouter = withRouter(TagSelector);

export default () => (
  <Store.Consumer>
    {({ profile, tags, setStore }) => (
      <Query query={TAG_TREE}>
        {({ data }) => (
          <Mutation mutation={ADD_TAGS}>
            {addSubbedTags => (
              <Mutation mutation={DEL_TAGS}>
                {delSubbedTags => (
                  <TagSelectorWithRouter
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
