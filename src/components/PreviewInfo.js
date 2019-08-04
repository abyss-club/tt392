import React from 'react';
import styled from 'styled-components';
import colors from 'utils/colors';

const Wrapper = styled.article`
  background-color: white;
  margin: .5rem 0;
  padding: 1rem;
  border-radius: .5rem;
  a {
    text-decoration: none;
    color: ${colors.accentBlue};
  }

  > p {
    color: ${colors.textGrey};
    font-size: .875em;
  }
`;

const Title = styled.div`
  color: ${colors.titleBlack};
  font-weight: 700;
  font-size: 1.25rem;
  padding-bottom: .4em;
`;

const PreviewInfo = () => (
  <Wrapper>
    <Title>Abyss in beta</Title>
    <p>
      {'Powered by Projects of '}
      <a href="https://gitlab.com/abyss.club/abyss">abyss</a>
    </p>
    <p>
      {'欢迎提交 PR 和 issue'}
    </p>
    <p>
      {'Abyss 使用 '}
      <a href="https://graphql.org/">GraphQL API</a>
      {', schema 描述'}
      <a href="https://gitlab.com/abyss.club/uexky/tree/master/src/schema">见此</a>
    </p>
  </Wrapper>
);

export default PreviewInfo;
