import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import colors from 'utils/colors';

import DraftContext from 'providers/Draft';

const PreviewWrapper = styled.div`
  * {
    font-size: .875rem;
    color: ${colors.textRegular};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    font-size: .875rem;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 1em 0;
    line-height: 1.5;
    :first-child {
      margin-top: 0;
    }
    :last-child {
      margin-bottom: 0;
    }
    hyphens: auto;
  }

  h1 {
    font-size: 1rem;
  }

  img {
    max-width: 100%;
  }

  ${props => (props.inList ? 'padding: 0 1rem;' : 'padding: 0 1.5rem;')}
`;

const ImageHack = styled.span`
  display: inline-block;
  padding: .5em 0;
  margin-left: ${props => (props.inList ? '-1rem' : '-1.5rem')};
  width: ${props => (props.inList ? 'calc(100% + 2rem)' : 'calc(100% + 3rem)')};

  > img {
    display: block;
    margin: auto;
    max-width: 100%;
  }
`;

/* eslint-disable jsx-a11y/alt-text */
const MDPreview = ({
  isThread = false, inList = false, inDraft = false, text = '',
}) => {
  const [{ content }] = useContext(DraftContext);

  const customImg = props => (
    <ImageHack inList={inList}>
      <img {...props} />
    </ImageHack>
  );
  return (
    <PreviewWrapper isThread={isThread} inList={inList}>
      <ReactMarkdown source={inDraft ? content : text} renderers={{ image: customImg }} />
    </PreviewWrapper>
  );
};
/* eslint-enable jsx-a11y/alt-text */
/* eslint-disable react/require-default-props */
MDPreview.propTypes = {
  isThread: PropTypes.bool,
  inList: PropTypes.bool,
  inDraft: PropTypes.bool,
  text: PropTypes.string,
};
/* eslint-disable react/require-default-props */

export default MDPreview;
