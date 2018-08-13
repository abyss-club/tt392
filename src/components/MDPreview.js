import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const PreviewWrapper = styled.div`
  h1 {
    font-size: 1.25rem;
  }
  h2 {
    font-size: 1.125rem;
  }
  h3, h4, h5 {
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
