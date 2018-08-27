import React from 'react';
import styled, { keyframes } from 'styled-components';

import colors from 'utils/colors';

const barLength = 70;

const frames = keyframes`
  from {
    transform: translateX(-${barLength}vw);
  }
  to {
    transform: translateX(100vw);
  }
`;

const Loading = styled.div`
  position: fixed;
  top: 0;
  
  width: ${barLength}vw;
  height: 4px;
  background: ${colors.orange};
  animation: ${frames} 1.5s ease infinite;
`;

const loading = {
  start: () => {},
  stop: () => {},
};


class LoadingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 0,
    };
  }
  start = () => {
    this.setState(prevState => ({ show: prevState.show + 1 }));
  }
  stop = () => {
    this.setState(prevState => ({ show: prevState.show - 1 }));
  }

  render() {
    const { show } = this.state;
    if (show <= 0) return null;

    return <Loading />;
  }
}

export default loading;
export { Loading, LoadingContainer };
