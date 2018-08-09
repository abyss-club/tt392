import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'utils/colors';
import Tag from 'components/Tag';
import fontFamilies from 'utils/fontFamilies';
import Store from 'providers/Store';
import SubscribedTags from './SubbedTags';

const TAGS_QUERY = gql`
  query {
    profile {
      tags
    }
    tags {
      mainTags,
      recommended,
      tree {mainTag, subTags}
    }
}`;

const UPDATE_SUBBED_TAGS = gql`
  mutation updateSubbedTags($tags: Array!) {
    syncTags(tags: $tags) {
      name
    }
  }
`;

const NavTagsWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-flow: row wrap;
`;

const SelectableTagWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-flow: row wrap;
`;

const TagRow = styled.div`
  width: 100%;
`;

// const ExpandBtnWrapper = styled.button`
//   color: white;
//   background-color: ${colors.orange};
//   font-size: 1em;
//   font-family: ${fontFamilies.system};
//   border: 0;
//   border-radius: 5px;
//   height: 2em;
//   padding: .25em .5em;
//   margin: 0 .125em;
//   line-height: 1.5;
// `;

const SubTags = ({ tree }) => {
  const flattened = new Set();
  tree.forEach((mainTag) => {
    if (mainTag.subTags) {
      mainTag.subTags.forEach((tag) => {
        flattened.add(tag);
      });
    }
  });
  return (
    [...flattened].map(subTag => (
      <Tag text={subTag} key={subTag} />
    )));
};

class NavTags extends React.Component {
  constructor(props) {
    super(props);
    this.props.setTagsByTree(props.data.tags.tree);
    this.props.setSubscribed(props.data.profile.tags);
  }

  render() {
    const { data } = this.props;
    return (
      <NavTagsWrapper>
        <TagRow>
          <Store.Consumer>
            {({ tags, setSubscribed, setSubbedDirectly }) => (
              <SubscribedTags
                data={data}
                tags={tags}
                setSubscribed={this.props.setSubscribed}
                setSubbedDirectly={this.props.setSubscribed}
              />
            )}
          </Store.Consumer>
        </TagRow>
      </NavTagsWrapper>
    );
  }
}
NavTags.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default () => (
  <Store.Consumer>
    {({
      tags, setTagsByTree, setSubscribed, setSubbedDirectly
    }) => (
      <Query query={TAGS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) {
            return (
              <pre>
                {error.graphQLErrors.map(({ message }) => (
                  <span key={message}>{message}</span>
                ))}
              </pre>
            );
          }
          return <NavTags
           setTagsByTree={setTagsByTree} setSubscribed={setSubscribed} data={data} />;
        }}
      </Query>
    )}
  </Store.Consumer>
);
