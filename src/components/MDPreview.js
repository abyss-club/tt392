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
  }

  h1 {
    font-size: 1rem;
  }

  img {
    max-width: 100%;
  }
`;

const MDPreview = ({ text, isThread }) => (
  <PreviewWrapper isThread={isThread}>
    <ReactMarkdown source={text} />
  </PreviewWrapper>
);
MDPreview.propTypes = {
  text: PropTypes.string.isRequired,
  isThread: PropTypes.bool,
};
MDPreview.defaultProps = {
  isThread: false,
};

export default MDPreview;
