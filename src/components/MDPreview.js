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
    position: relative;
    max-width: 100%;
    min-height: 3em;
  }

  img:before {
    content: " ";
    display: block;

    box-sizing: border-box;
    position: absolute;
    top: -.5em;
    left: 0;
    height: calc(100% + 1em);
    width: 100%;
    background-color: rgb(230, 230, 230);
    border: 2px dashed rgb(200, 200, 200);
    border-radius: .5em;
  }

  img:after {
    content: "Broken image: " attr(alt) "(url: " attr(src) ")";

    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    font-style: normal;
    color: rgb(100, 100, 100);

    box-sizing: border-box;
    position: absolute;
    top: -.5em;
    left: 0;
    width: 100%;
    height: calc(100% + 1em);
    padding: 0 1em;
    text-align: center;
    overflow-wrap: break-word;
    word-break: break-all;
    hyphens: none;
  }
`;

const ImageHack = styled.span`
  display: inline-block;
  padding: .5em 0;
  margin-left: -1rem;
  width: calc(100% + 2rem);

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
