import styled from 'styled-components';

const MainContent = styled.div`
  margin: 0;
  border-radius: 16px;
  padding: 1em 0;
  /* (960 + 16 * 2) / 16 = 62; */
  @media (min-width: 62em) {
    max-width: 720px;
    margin: 0 auto;
  }
`;

export default MainContent;
