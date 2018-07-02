import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const PROFILE_QUERY = gql`
  query {
    account {
      email
    }
  }
`;

const Profile = () => (
  <Query query={PROFILE_QUERY}>
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
          <p>Your account email is {data.account.email}</p>
          <p>Your account name is {data.account.name || 'null'}</p>
        </div>
      );
    }}
  </Query>
);

export default Profile;
