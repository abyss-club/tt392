import styled from 'styled-components';

import colors from 'utils/colors';
import { breakpoint, maxWidth } from 'styles/MainContent';

const FloatButton = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: ${(props => (props.aboveScrollbar ? '4.5rem' : '1.5rem'))};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${colors.buttonBg};
  color: white;
  border: none;
  outline: none;
  font-size: 1em;
  line-height: 0;
  cursor: pointer;
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12),0 3px 5px -1px rgba(0,0,0,0.2);
  @media (min-width: ${breakpoint}em) {
    right: unset;
    margin-left: calc(${maxWidth}rem - 3rem - 1rem);
  }
`;

export default FloatButton;
