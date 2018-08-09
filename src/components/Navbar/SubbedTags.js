import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import colors from 'utils/colors';
import Tag from 'components/Tag';
import fontFamilies from 'utils/fontFamilies';
import Store from 'providers/Store';

const UPDATE_SUBBED_TAGS = gql`
  mutation updateSubbedTags($tags: [String]!) {
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

const SubTags = ({ tree, addTag }) => {
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
      <Tag text={subTag} key={subTag} onClick={e => addTag({ type: 'sub', tag: subTag }, e)} />
    )));
};

class SubbedTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      selectedMain: new Set(props.tags ? props.tags.subscribed.main : []),
      selectedSub: new Set(props.tags ? props.tags.subscribed.sub : []),
    };
  }

  onCollapsed = (syncTags) => {
    setTimeout(() => {
      this.props.setSubbedDirectly({
        main: this.state.selectedMain,
        sub: this.state.selectedSub,
      });
      syncTags({ variables: { tags: [...this.state.selectedMain, ...this.state.selectedSub] } });
    }, 0);
  }

  expandNav = (syncTags) => {
    if (this.state.expanded) {
      this.onCollapsed(syncTags);
    }
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  removeTag = ({ type, tag }) => {
    if (this.state.expanded) {
      if (type === 'main') {
        this.setState((prevState) => {
          const newSet = prevState.selectedMain;
          newSet.delete(tag);
          return {
            selectedMain: newSet,
          };
        });
      } else {
        this.setState((prevState) => {
          const newSet = prevState.selectedSub;
          newSet.delete(tag);
          return {
            selectedSub: newSet,
          };
        });
      }
    }
  }

  addTag = ({ type, tag }) => {
    if (this.state.expanded) {
      if (type === 'main') {
        this.setState((prevState) => {
          const newSet = prevState.selectedMain;
          newSet.add(tag);
          return {
            selectedMain: newSet,
          };
        });
      } else {
        this.setState((prevState) => {
          const newSet = prevState.selectedSub;
          newSet.add(tag);
          return {
            selectedSub: newSet,
          };
        });
      }
    }
  }

  render() {
    const { data } = this.props;
    return (
      <NavTagsWrapper>
        <TagRow>
          {(data.profile.tags) ? (
            <React-Fragment>
              {[...this.state.selectedMain].map(tag => (
                <Tag isMain text={tag} key={tag} onClick={e => this.removeTag({ type: 'main', tag }, e)} />
              ))}
              {[...this.state.selectedSub].map(tag => (
                <Tag text={tag} key={tag} onClick={e => this.removeTag({ type: 'sub', tag }, e)} />
              ))}
              <Mutation mutation={UPDATE_SUBBED_TAGS}>
                {syncTags => (
                  <ExpandBtnWrapper onClick={e => this.expandNav(syncTags, e)} >
                    {this.state.expanded ? (<FontAwesomeIcon icon="chevron-up" />) : (<FontAwesomeIcon icon="chevron-down" />)}
                  </ExpandBtnWrapper>
                )}
              </Mutation>
            </React-Fragment>
            ) : (
              <React-Fragment>
                {data.tags.recommended.map(tag => (
                  <Tag isMain text={tag} key={tag} />
                ))}
                <ExpandBtnWrapper onClick={this.expandNav}>
                  {this.state.expanded ? (<FontAwesomeIcon icon="chevron-up" />) : (<FontAwesomeIcon icon="chevron-down" />)}
                </ExpandBtnWrapper>
              </React-Fragment>
            )}
        </TagRow>
        {this.state.expanded && (
        <SelectableTagWrapper>
          <TagRow>
            {data.tags.mainTags.map(tag => (
              <Tag isMain text={tag} key={tag} onClick={e => this.addTag({ type: 'main', tag }, e)} />
            ))}
          </TagRow>
          <TagRow>
            <SubTags tree={data.tags.tree} addTag={this.addTag} />
          </TagRow>
        </SelectableTagWrapper>
              )}
      </NavTagsWrapper>
    );

  }
}

export default SubbedTags;
