import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const PreviewWrapper = styled.div`
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
