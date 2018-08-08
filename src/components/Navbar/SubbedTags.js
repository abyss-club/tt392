import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import colors from 'utils/colors';
import Tag from 'components/Tag';
import fontFamilies from 'utils/fontFamilies';

const UPDATE_SUBBED_TAGS = gql`
  mutation updateSubbedTags($tags: Array!) {
    syncTags(tags: $tags) {
      name
    }
  }
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

class SubbedTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMain: new Set(),
      selectedSub: new Set(),
    };
  }

  onCollapsed = () => {
    setTimeout(() => {
      const mergedTags = [...this.state.selectedMain, ...this.state.selectedSub];
      this.props.setSubbedDirectly({
        main: this.state.selectedMain,
        sub: this.state.selectedSub,
      });
      this.props.updateSubbedTags(mergedTags);
    }, 0);
  }

  render() {
    if (this.props.tags) {
      return (
        <React-Fragment>
          {[...this.props.tags.main].map(tag => (
            <Tag isMain text={tag} key={tag} />
          ))}
          {[...this.props.tags.sub].map(tag => (
            <Tag text={tag} key={tag} />
          ))}
          <ExpandBtnWrapper onClick={this.props.expandNav}>
            {this.props.isExpanded ? (<FontAwesomeIcon icon="chevron-up" />) : (<FontAwesomeIcon icon="chevron-down" />)}
          </ExpandBtnWrapper>
        </React-Fragment>
      );
    }
    return (
      <React-Fragment>
        {this.props.recommended.map(tag => (
          <Tag isMain text={tag} key={tag} />
        ))}
        <ExpandBtnWrapper onClick={this.expandNav}>
          {this.state.expanded ? (<FontAwesomeIcon icon="chevron-up" />) : (<FontAwesomeIcon icon="chevron-down" />)}
        </ExpandBtnWrapper>
      </React-Fragment>
    );
  }
}

export default SubbedTags;
