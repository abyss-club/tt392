import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';

import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import Store from 'providers/Store';
import Tag from 'components/Tag';

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

const AddBtnWrapper = styled.button`
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

const AddBtn = ({ onClick }) => (
  <AddBtnWrapper onClick={onClick}>
    <FontAwesomeIcon icon="plus" />
  </AddBtnWrapper>
);
AddBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const NavTags = ({ tags, history }) => {
  const { main, sub } = tags.subscribed;
  const SubbedTag = (tag, isMain = false) => (
    <Tag
      key={tag}
      text={tag}
      isMain={isMain}
      onClick={() => { history.push(`/tag/${tag}/`); }}
    />
  );
  return (
    <NavTagsWrapper>
      <TagRow>
        <AddBtn onClick={() => { history.push('/tags/'); }} />
        <React.Fragment>
          {([...main]).map(tag => SubbedTag(tag, true))}
          {([...sub]).map(tag => SubbedTag(tag))}
        </React.Fragment>
      </TagRow>
    </NavTagsWrapper>
  );
};
NavTags.propTypes = {
  // profile: PropTypes.shape().isRequired,
  tags: PropTypes.shape().isRequired,
  history: PropTypes.shape({}).isRequired,
};

const NavTagsWithRouter = withRouter(NavTags);

export default () => (
  <Store.Consumer>
    {({ profile, tags }) => (
      <NavTagsWithRouter profile={profile} tags={tags} />
     )}
  </Store.Consumer>
);
