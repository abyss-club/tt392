import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';


const MDPreview = ({ text }) => (
  <ReactMarkdown source={text} />
);
MDPreview.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MDPreview;
