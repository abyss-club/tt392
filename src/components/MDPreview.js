import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import colors from 'utils/colors';

const PreviewWrapper = styled.div`
  * {
    font-size: .875rem;
    color: ${props => (props.isThread ? colors.textGrey : colors.regularBlack)};
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
`;

const ImageHack = styled.span`
  display: inline-block;
  margin-left: ${props => (props.inList ? '-1rem' : '-1.5rem')};
  width: ${props => (props.inList ? 'calc(100% + 2rem)' : 'calc(100% + 3rem)')};

  > img {
    display: block;
    margin: auto;
    max-width: 100%;
  }
`;

/* eslint-disable jsx-a11y/alt-text */
const MDPreview = ({ text, isThread, inList }) => {
  const customImg = props => (
    <ImageHack inList={inList}>
      <img {...props} />
    </ImageHack>
  );
  return (
    <PreviewWrapper isThread={isThread}>
      <ReactMarkdown source={text} renderers={{ image: customImg }} />
    </PreviewWrapper>
  );
};
/* eslint-enable jsx-a11y/alt-text */
MDPreview.propTypes = {
  text: PropTypes.string.isRequired,
  isThread: PropTypes.bool,
  inList: PropTypes.bool,
};
MDPreview.defaultProps = {
  isThread: false,
  inList: false,
};

export default MDPreview;
