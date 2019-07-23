import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadWrapper = styled.article`
  display: flex;
  align-items: center;

  background-color: white;
  margin: 1rem 0;
  padding: .5rem;
  border-radius: .5rem;
`;

const LoadingText = styled.p`
  margin-left: .5em;
`;

const LoadMore = forwardRef((_, ref) => (
  <LoadWrapper ref={ref}>
    <FontAwesomeIcon icon="spinner" spin />
    <LoadingText>Loading...</LoadingText>
  </LoadWrapper>
));

export default LoadMore;
