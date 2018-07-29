import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IndexWrapper = styled.div`
  margin: 1rem 0;
  border: 1px solid black;
  padding: 1rem;
  font-family: sans-serif;
  > a {
   margin-right: 1rem;
  }
  > p {
    margin: 0 0 1rem 0;
  }
`;

const PreviewInfo = () => (
  <IndexWrapper>
    <p><FontAwesomeIcon icon="check-square" /> 本站尚处于开发初期, </p>
    <p>Powered by Projects of <a href="https://gitlab.com/abyss.club/abyss">abyss</a></p>
    <p>Abyss 使用 GraphQL API ( <a href="https://graphql.org/">了解 GraphQL</a> )</p>
    <Link to="/graphiql/"> GraphiQL </Link>
    <Link to="/voyager/"> GraphQL Voyager </Link>
    <a href="https://gitlab.com/abyss.club/abyss/blob/master/api.gql">Schema</a>
  </IndexWrapper>
);

export default PreviewInfo;
