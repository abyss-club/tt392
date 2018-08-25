import React from 'react';
import styled, { keyframes } from 'styled-components';

import colors from 'utils/colors';

const Frames = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LineWidth = 4;
const WrapperWidth = 32;
const Padding = 3;
const CenterWidth = WrapperWidth - ((Padding + LineWidth) * 2);

const Loading = styled.div`
  display: block;
  background: white;
  width: ${WrapperWidth}px;
  height: ${WrapperWidth}px;
  position: fixed;
  top: 8rem;
  left: calc(50% - ${WrapperWidth / 2}px);
  border-radius: 50%;
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12),0 3px 5px -1px rgba(0,0,0,0.2);
  :after {
    content: " ";
    display: block;
    width: ${CenterWidth}px;
    height: ${CenterWidth}px;
    margin: ${Padding}px;
    border-radius: 50%;
    border: ${LineWidth}px solid ${colors.orange};
    border-color: ${colors.orange} transparent ${colors.orange} transparent;
    animation: ${Frames} 1s linear infinite;
  }
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
    loading.start = this.start;
    loading.stop = this.stop;
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
