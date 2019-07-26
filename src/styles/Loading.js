import React, { useContext, forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'utils/colors';
import LoadingContext from 'providers/Loading';

const LoadMoreWrapper = styled.div`
  display: flex;
  align-items: center;

  background-color: white;
  margin: 1rem 0;
  padding: .5rem;
  border-radius: .5rem;

  :last-of-type {
    margin: 1rem 0 0;
  }
`;

const LoadMoreText = styled.p`
  margin-left: .5em;
`;

const LoadMore = forwardRef((_, ref) => (
  <LoadMoreWrapper ref={ref}>
    <FontAwesomeIcon icon="spinner" spin />
    <LoadMoreText>Loading...</LoadMoreText>
  </LoadMoreWrapper>
));

const barLength = 70;

const frames = keyframes`
  from {
    transform: translateX(-${barLength}vw);
  }
  to {
    transform: translateX(100vw);
  }
`;

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 15;

  width: ${barLength}vw;
  height: 4px;
  background: ${colors.accentGreen};
  animation: ${frames} 1.5s ease infinite;
`;

const LoadingBar = () => {
  const [{ show }] = useContext(LoadingContext);

  if (show < 1) return null;
  return <LoadingWrapper />;
};

export { LoadingWrapper, LoadingBar, LoadMore };
