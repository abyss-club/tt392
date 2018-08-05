import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';

const TagWrapper = styled.button`
  color: white;
  background-color: ${props => (props.type === 'main' ? colors.orange : colors.aluminium)} ;
  font-size: 1em;
  font-family: ${fontFamilies.system};
  border: 0;
  border-radius: 5px;
  height: 2em;
  padding: .25em .5em;
  margin: 0 .125em;
  line-height: 1.5;
`;

const CommonTags = ({ type, text }) => (
  <TagWrapper type={type}>{text}</TagWrapper>
);

CommonTags.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default CommonTags;
