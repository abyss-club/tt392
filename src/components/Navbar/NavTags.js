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

const ExpandBtnWrapper = styled.button`
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

const SubscribedTags = ({ tags }) => (
  tags.map(tag => (
    <Tag text={tag} key={tag} />
  ))
);

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
  }

  expandNav() {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  render() {
    return (
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
          // if not signed in, use recommend tags.
          const selectedTags = data.profile.tags || data.tags.recommended;
          this.props.setMainTags(data.tags.mainTags);
          console.log('store', this.props.setMainTags);
          return (
            <NavTagsWrapper>
              <TagRow>
                <SubscribedTags tags={selectedTags} />
                <ExpandBtnWrapper onClick={this.expandNav}>
                  {this.state.expanded ? (<FontAwesomeIcon icon="chevron-down" />) : (
                    <FontAwesomeIcon icon="chevron-up" />)}
                </ExpandBtnWrapper>
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
        }}
      </Query>
    );
  }
}
NavTags.propTypes = {
  setMainTags: PropTypes.func.isRequired,
};

export default () => (
  <Store.Consumer>
    {({ setMainTags }) => (
      <NavTags setMainTags={setMainTags} />
    )}
  </Store.Consumer>
);
