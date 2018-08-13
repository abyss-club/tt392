import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const StyledImg = styled.img`
  max-width: 100%;
`;

const MDPreview = ({ text }) => (
  <ReactMarkdown source={text} renderers={{ image: Image, imageReference: Image }} />
);
MDPreview.propTypes = {
  text: PropTypes.string.isRequired,
};

function Image(props) {
  return <StyledImg alt={props.alt} src={props.src} />;
}
Image.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string.isRequired,
};
Image.defaultProps = {
  alt: 'Description',
};

export default MDPreview;
