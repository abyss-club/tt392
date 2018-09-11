import styled from 'styled-components';

const maxWidth = 45; // 45rem 720px
const margin = 0.5; // 0.5rem 8px
const breakpoint = maxWidth + (margin * 2);

const MainContent = styled.div`
  margin: 0 ${margin}rem;
  /* trigger is (maxWidth + margin * 2); */
  @media (min-width: ${breakpoint}em) {
    max-width: ${maxWidth}rem;
    margin: 0 auto;
  }
`;

export default MainContent;
export { breakpoint };
