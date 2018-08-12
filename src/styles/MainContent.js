import styled from 'styled-components';

const MainContent = styled.div`
  margin: 0 1rem;
  /* (960 + 16 * 2) / 16 = 62; */
  @media (min-width: 62em) {
    max-width: 960px;
    margin: 0 auto;
  }
`;

export default MainContent;
