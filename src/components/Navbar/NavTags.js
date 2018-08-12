import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import Store from 'providers/Store';
import Tag from 'components/Tag';

import TagSelector from './TagSelector';

const NavTagsWrapper = styled.div`
  width: 100%;
  font-size: .75rem;
  display: flex;
  flex-flow: row wrap;
  margin: .5rem -.125rem;
`;

const TagRow = styled.div`
  width: 100%;
  margin: 0 -.125rem;
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

const ExpandBtn = ({ expanded, onClick }) => (
  <ExpandBtnWrapper onClick={onClick} >
    <FontAwesomeIcon icon={`chevron-${expanded ? 'up' : 'down'}`} />
  </ExpandBtnWrapper>
);
ExpandBtn.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

class NavTags extends React.Component {
  state = {
    expanded: false,
    main: new Set(),
    sub: new Set(),
  }

  expand = () => {
    const { main, sub } = this.props.tags.subscribed;
    this.setState({ expanded: true, main, sub });
  }

  collapse = () => {
    const { profile, setStore, syncTags } = this.props;
    const { main, sub } = this.state;
    setStore(prevState => ({
      tags: {
        ...prevState.tags,
        subscribed: { main, sub },
      },
    }));
    this.setState({ expanded: false });
    setTimeout(() => {
      if (profile.isSignedIn) {
        syncTags({ variables: { tags: [...main, ...sub] } });
      }
    }, 0);
  }

  subcribeTag = (tag, isMain = false) => {
    if (this.state.expanded) {
      if (isMain) {
        this.setState(prevState => ({ main: prevState.main.add(tag) }));
      } else {
        this.setState(prevState => ({ sub: prevState.sub.add(tag) }));
      }
    }
  }

  unsubscribeTag = (tag, isMain = false) => {
    if (this.state.expanded) {
      if (isMain) {
        this.setState((prevState) => {
          prevState.main.delete(tag);
          return { main: prevState.main };
        });
      } else {
        this.setState((prevState) => {
          prevState.sub.delete(tag);
          return { sub: prevState.sub };
        });
      }
    }
  }

  render() {
    const { expanded } = this.state;
    const { mainTags } = this.props.tags;
    const { main, sub } = expanded ? this.state : this.props.tags.subscribed;
    const SubbedTag = (tag, isMain = false) => (
      <Tag
        key={tag}
        text={tag}
        isMain={isMain}
        onClick={() => { this.unsubscribeTag(tag, isMain); }}
      />
    );
    return (
      <NavTagsWrapper>
        <TagRow>
          {([...main]).map(tag => SubbedTag(tag, true))}
          {([...sub]).map(tag => SubbedTag(tag))}
          <ExpandBtn
            expanded={expanded}
            onClick={expanded ? this.collapse : this.expand}
          />
        </TagRow>
        {expanded && (
          <TagSelector
            mainTags={mainTags}
            subscribed={{ main, sub }}
            subscribeTag={this.subcribeTag}
          />
        )}
      </NavTagsWrapper>
    );
  }
}
NavTags.propTypes = {
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

export default () => (
  <Store.Consumer>
    {({ profile, tags, setStore }) => (
      <Mutation mutation={UPDATE_SUBBED_TAGS}>
        {syncTags => (
          <NavTags profile={profile} tags={tags} setStore={setStore} syncTags={syncTags} />
        )}
      </Mutation>
     )}
  </Store.Consumer>
);
