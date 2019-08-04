import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import ThreadList from 'components/ThreadList';
import MainContent from 'styles/MainContent';

const Wrapper = styled(MainContent)`
  display: flex;
  flex-flow: column;
`;

const TagView = ({ match }) => (
  <Wrapper>
    <ThreadList type="tag" slug={match.params.slug} />
  </Wrapper>
);

TagView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
};

export default TagView;
