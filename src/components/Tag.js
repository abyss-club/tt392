import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tick from 'components/icons/Tick';

import { Link } from 'react-router-dom';

const TagWrapper = styled.button`
  ${props => (props.ismain ? `
  background-color: ${colors.tagGrey};
  color: white;
  ` : `
  background-color: unset;
  color: ${colors.tagGrey};
  `)}
  border: 1px solid ${colors.tagGrey};
  outline: none;
  font-size: .75em;
  border-radius: 1rem;
  height: 2rem;
  padding: .25em 1.5em;
  margin: .25rem;
  font-family: ${fontFamilies.system};
  cursor: pointer;
  > svg {
    > path {
      stroke: ${props => (props.ismain ? 'white' : colors.tagRed)};
    }
  }
`;

const SelectedTagWrapper = styled(TagWrapper)`
  ${props => (props.ismain ? `
  background-color: ${colors.tagRed};
  color: white;
  ` : `
  background-color: unset;
  color: ${colors.tagRed};
  `)}
  border: 1px solid ${colors.tagRed};
`;

const CompactTag = styled(Link)`
  margin-right: .25em;

  font-size: .75em;
  color: ${props => (props.ismain ? colors.tagRed : colors.tagGrey)};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const Tag = ({
  text, isMain, onClick, className, isSubbed, isCompact, isLoading,
}) => {
  const isSubbedTag = isSubbed ? (
    <SelectedTagWrapper
      title={text}
      ismain={isMain ? 1 : 0}
      onClick={onClick}
      className={className}
    >
      {isLoading && <FontAwesomeIcon icon="spinner" spin />}
      {(!isLoading && isSubbed) ? <Tick /> : null}
      {text}
    </SelectedTagWrapper>
  ) : (
    <TagWrapper title={text} ismain={isMain ? 1 : 0} onClick={onClick} className={className}>
      {isLoading && <FontAwesomeIcon icon="spinner" spin />}
      {text}
    </TagWrapper>
  );
  return (
    isCompact ? (
      <CompactTag ismain={isMain ? 1 : 0} to={`/tag/${text}`}>
        #
        {text}
      </CompactTag>
    ) : isSubbedTag
  );
};

Tag.propTypes = {
  isSubbed: PropTypes.bool,
  onClick: PropTypes.func,
  isMain: PropTypes.bool,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  isCompact: PropTypes.bool,
  isLoading: PropTypes.bool,
};
Tag.defaultProps = {
  isSubbed: false,
  isMain: false,
  isLoading: false,
  onClick: () => {},
  className: '',
  isCompact: false,
};

export default Tag;
