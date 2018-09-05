import React from 'react';
import PropTypes from 'prop-types';

import ThreadList from 'components/ThreadList';
import PreviewInfo from 'components/PreviewInfo';
import MainContent from 'styles/MainContent';

const TagView = ({ match }) => (
  <MainContent>
    <PreviewInfo />
    <ThreadList type="tag" slug={match.params.slug} />
  </MainContent>
);

TagView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
};

export default TagView;
