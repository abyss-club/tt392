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
    this.state = {
      expanded: false,
    };
    this.expandNav = this.expandNav.bind(this);
    this.props.setMainTags(props.data.tags.mainTags);
    this.props.setSubscribed(props.data.profile.tags);
  }

  expandNav() {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  render() {
    const { data } = this.props;
    return (
      <NavTagsWrapper>
        <TagRow>
          <Store.Consumer>
            {({ tags }) => (
              <SubscribedTags
                tags={tags.subscribed}
                recommended={data.tags.recommended}
                isExpanded={this.state.expanded}
                expandNav={this.expandNav}
                setSubbedDirectly={this.props.setSubscribed}
              />
            )}
          </Store.Consumer>
        </TagRow>
        {this.state.expanded && (
        <SelectableTagWrapper>
          <TagRow>
            {data.tags.mainTags.map(tag => (
              <Tag isMain text={tag} key={tag} />
            ))}
          </TagRow>
          <TagRow>
            <SubTags tree={data.tags.tree} />
          </TagRow>
        </SelectableTagWrapper>
              )}
      </NavTagsWrapper>
    );
  }
}
NavTags.propTypes = {
  setMainTags: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
};

export default () => (
  <Store.Consumer>
    {({ setMainTags, setSubscribed, setSubbedDirectly }) => (
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
          return <NavTags setMainTags={setMainTags} setSubscribed={setSubscribed} setSubbedDirectly={setSubbedDirectly} data={data} />;
        }}
      </Query>
    )}
  </Store.Consumer>
);
