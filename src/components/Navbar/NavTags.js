import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import Store from 'providers/Store';
import Tag from 'components/Tag';
import Plus from 'components/icons/Plus';

const NavTagsWrapper = styled.div`
  width: 100%;
  font-size: .75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin: -0.25rem;
  padding: 0 1rem;
`;

const AddBtnWrapper = styled.button`
  color: white;
  background-color: ${colors.iconGrey};
  font-size: 1em;
  font-family: ${fontFamilies.system};
  border: 0;
  outline: 0;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  padding: 0;
  margin: 0.25em;
  line-height: 0;
  cursor: pointer;
`;

const AddBtn = ({ onClick }) => (
  <AddBtnWrapper onClick={onClick}>
    <Plus />
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
      <AddBtn onClick={() => { history.push('/tags/'); }} />
      <React.Fragment>
        {([...main]).map(tag => SubbedTag(tag, true))}
        {([...sub]).map(tag => SubbedTag(tag))}
      </React.Fragment>
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
