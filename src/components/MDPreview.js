import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const PreviewWrapper = styled.div`
  * {
    font-size: .875rem;
    color: ${props => (props.isThread ? colors.textGrey : colors.regularBlack)};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    margin: 0;
  }

  p {
    margin: 0;
  }

  h2, h3, h4, h5, h6 {
    font-size: .875rem;
  }

  h1 {
    font-size: 1rem;
  }

  img {
    max-width: 100%;
  }
`;

const MDPreview = ({ text }) => (
  <PreviewWrapper>
    <ReactMarkdown source={text} />
  </PreviewWrapper>
);
MDPreview.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MDPreview;
