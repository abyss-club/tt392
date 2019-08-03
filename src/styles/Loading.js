import React, {
  useContext, forwardRef, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'utils/colors';

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

const LoadMore = forwardRef((props, ref) => (
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

const LoadingContext = React.createContext([]);

const HookedLoadingBar = ({ children }) => {
  const [show, setShow] = useState(0);
  return (
    <LoadingContext.Provider value={{ show, setShow }}>
      {children}
    </LoadingContext.Provider>
  );
};
HookedLoadingBar.propTypes = {
  children: PropTypes.node.isRequired,
};

const useLoadingBar = () => {
  const { show, setShow } = useContext(LoadingContext);
  const startLoading = useCallback(() => setShow(prev => prev + 1), [setShow]);
  const stopLoading = useCallback(() => setShow(prev => prev - 1), [setShow]);
  return [show, { startLoading, stopLoading }];
};

const LoadingBar = () => {
  const { show } = useContext(LoadingContext);
  console.log({ show });

  if (show < 1) return null;
  return <LoadingWrapper />;
};

export {
  LoadingWrapper, LoadingBar, LoadMore, HookedLoadingBar, LoadingContext, useLoadingBar,
};
