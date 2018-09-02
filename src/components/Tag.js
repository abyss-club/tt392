import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const Tag = ({
  text, isMain, onClick, className, selected,
}) => (
  <TagWrapper isMain={isMain} onClick={onClick} className={className}>
    {selected ? <FontAwesomeIcon icon="check-square" /> : null}
    {text}
  </TagWrapper>
);

Tag.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  isMain: PropTypes.bool,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};
Tag.defaultProps = {
  selected: false,
  isMain: false,
  onClick: () => {},
  className: '',
};

export default Tag;
