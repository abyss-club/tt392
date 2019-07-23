import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
    <Title>本站尚处于开发初期</Title>
    <p>
      Powered by Projects of
      {' '}
      <a href="https://gitlab.com/abyss.club/abyss">abyss</a>
    </p>
    <p>
      Abyss 使用 GraphQL API (
      <a href="https://graphql.org/">了解 GraphQL</a>
    )
    </p>
    <p>
      <Link to="/graphiql/"> GraphiQL </Link>
      /
      <Link to="/voyager/"> GraphQL Voyager </Link>
      /
      <a href="https://gitlab.com/abyss.club/abyss/blob/master/api.gql"> Schema</a>
    </p>
  </Wrapper>
);

export default PreviewInfo;
