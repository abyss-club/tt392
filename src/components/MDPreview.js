import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import colors from 'utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DraftContext from 'providers/Draft';

const PreviewWrapper = styled.div`
  * {
    font-size: .875rem;
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

  h1, h2, h3, h4, h5, h6, p, span, li, a {
    color: ${colors.textRegular};
  }

  h1 {
    font-size: 1rem;
  }

  li {
    line-height: 1.5;
  }

  img {
    position: relative;
    max-width: 100%;
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

const ImgPlaceHolder = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 1rem;

  line-height: 0;
  padding: .5rem;
  border-radius: .5em;
  background-color: ${colors.lightRed};

  > span {
    font-size: .875em;
    color: ${colors.textGrey};

    > a {
      color: ${colors.textGrey};
      font-size: .875em;
    }
  }

  > svg {
    margin-right: .5em;
    > path {
      fill: ${colors.regularGrey};
    }
  }
`;

/* eslint-disable jsx-a11y/alt-text */
const MDPreview = ({
  isThread = false, inList = false, inDraft = false, text = '',
}) => {
  const [{ content }] = useContext(DraftContext);

  const CustomImg = (props) => {
    const { alt = '', src = '' } = props;
    const [error, setError] = useState(false);
    const handleOnError = () => {
      setError(true);
    };
    return (
      <ImageHack inList={inList}>
        {error && (
          <ImgPlaceHolder>
            <FontAwesomeIcon icon="image" color={colors.regularGrey} />
            <span>
              {'Image '}
              <a href={src}>{alt}</a>
              {' failed to load.'}
            </span>
          </ImgPlaceHolder>
        )}
        <img
          style={{ display: error ? 'none' : 'block' }}
          onError={handleOnError}
          {...props}
        />
      </ImageHack>
    );
  };
  CustomImg.propTypes = {
    alt: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  };

  return (
    <PreviewWrapper isThread={isThread} inList={inList}>
      <ReactMarkdown source={inDraft ? content : text} renderers={{ image: CustomImg }} />
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
