import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Link } from 'react-router-dom';

const TagWrapper = styled.button`
  ${props => (props.ismain ? `
  background-color: ${colors.tagBlue};
  color: white;
  ` : `
  background-color: ${colors.textGrey};
  color: white;
  `)}
  border: none;
  outline: none;
  font-size: 1em;
  border-radius: 16px;
  height: 2rem;
  padding: .25em 1.5em;
  margin: .25rem;
  font-family: ${fontFamilies.system};
  cursor: pointer;
`;

const CompactTag = styled(Link)`
  margin-right: .25em;

  font-size: .75em;
  color: ${props => (props.ismain ? colors.accentRed : colors.textGrey)};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const Tag = ({
  text, isMain, onClick, className, selected, isCompact,
}) => (
  isCompact ? (
    <CompactTag ismain={isMain ? 1 : 0} to={`/tag/${text}`}>#{text}</CompactTag>
  ) : (
    <TagWrapper ismain={isMain ? 1 : 0} onClick={onClick} className={className}>
      {selected ? <FontAwesomeIcon icon="check-square" /> : null}
      {text}
    </TagWrapper>
  )
);

Tag.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  isMain: PropTypes.bool,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  isCompact: PropTypes.bool,
};
Tag.defaultProps = {
  selected: false,
  isMain: false,
  onClick: () => {},
  className: '',
  isCompact: false,
};

export default Tag;
