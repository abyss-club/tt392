import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';

const TagWrapper = styled.button`
  ${props => (props.isMain ? `
  background-color: ${colors.orange};
  color: white;
  ` : `
  background-color: ${colors.zirconLight};
  color: ${colors.orange};
  `)}
  border: 2px solid ${colors.orange};
  font-size: 1em;
  border-radius: .25rem;
  height: 2em;
  padding: .25em .5em;
  margin: 0 .125em;
  font-family: ${fontFamilies.system};
`;

const Tag = ({ text, isMain, onClick }) => (
  <TagWrapper isMain={isMain} onClick={onClick}>{text}</TagWrapper>
);

Tag.propTypes = {
  onClick: PropTypes.func,
  isMain: PropTypes.bool,
  text: PropTypes.string.isRequired,
};
Tag.defaultProps = {
  isMain: false,
  onClick: () => {},
};

export default Tag;
