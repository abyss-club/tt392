import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRouter } from 'utils/routerHooks';

import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import TagsContext from 'providers/Tags';
import { ContentWrapper } from 'styles/MainContent';
import Tag from 'components/Tag';
import Plus from 'components/icons/Plus';

const NavTagsWrapper = styled(ContentWrapper)`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin: 0 -0.25rem;
  padding: 1rem 1rem .5rem;
`;

const AddBtnWrapper = styled.button`
  color: white;
  background-color: ${colors.iconGrey};
  font-size: .75em;
  font-family: ${fontFamilies.system};
  border: 0;
  outline: 0;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  padding: 0;
  margin: 0.25em;
  margin-left: 0;
  line-height: 0;
  cursor: pointer;
`;

const DescriptionText = styled.p`
  color: ${colors.textOnBg};
  width: 100%;
  font-size: .6875em;
  font-family: ${fontFamilies.system};
  padding-bottom: .5rem;
`;

const AddBtn = ({ onClick, children }) => (
  <AddBtnWrapper title="Modify tags subscription" onClick={onClick}>
    {children}
  </AddBtnWrapper>
);
AddBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const NavTags = () => {
  const { history } = useRouter();
  const [{ tags }] = useContext(TagsContext);
  const { main, sub } = tags.subscribed;

  const SubbedTag = (tag, isMain = false) => (
    <Tag
      key={tag}
      text={tag}
      isMain={isMain}
      onClick={() => { history.push(`/tag/${tag}`); }}
    />
  );
  return (
    <NavTagsWrapper>
      <DescriptionText>已关注标签</DescriptionText>
      <AddBtn onClick={() => { history.push('/tags'); }}>
        <Plus />
      </AddBtn>
      <>
        {([...main]).map(tag => SubbedTag(tag, true))}
        {([...sub]).map(tag => SubbedTag(tag))}
      </>
    </NavTagsWrapper>
  );
};

export default NavTags;
