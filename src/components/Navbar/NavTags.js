import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import colors from 'utils/colors';

const TAGS_QUERY = gql`
  query {
    tags {
      mainTags
    }
}`;

const NavTagsWrapper = styled.nav`
  width: 100%;

  display: flex;
  flex-flow: row nowrap;
`;

const TagWrapper = styled.button`
  color: white;
  background-color: ${colors.orange};
  font-size: 1em;
  font-family: sans-serif;
  appearance: none;
  border: 0;
  border-radius: 5px;
  padding: .25em .5em;
  margin: 0 .125em;
`;

const NavTags = () => (
  <NavTagsWrapper>
    <Query query={TAGS_QUERY}>
      {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
       return (
         <pre>
           {error.graphQLErrors.map(({ message }) => (
             <span key={message}>{message}</span>
           ))}
         </pre>
        );
      }

        return (
          <div>
            {data.tags.mainTags.map(tag => (
              <TagWrapper key={tag}>{tag}</TagWrapper>
            ))}
          </div>
        );
      }}
    </Query>
  </NavTagsWrapper>
);

export default NavTags;
