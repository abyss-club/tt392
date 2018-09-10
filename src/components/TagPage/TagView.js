import React from 'react';
import PropTypes from 'prop-types';

import ThreadList from 'components/ThreadList';
import MainContent from 'styles/MainContent';

const TagView = ({ match }) => (
  <MainContent>
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
