import React from 'react';
import GQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import styled from 'styled-components';

import 'graphiql/graphiql.css';

const Wrapper = styled.div`
  height: 100%;
`;

function newGraphQLFetcher(token) {
  return function fetcher(graphQLParams) {
    return fetch('/api/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': token,
      },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  };
}

class GraphiQL extends React.Component {
  constructor(props) {
    super(props);
    this.state = { token: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ token: event.target.value });
  }

  render() {
    return (
      <Wrapper>
        <label>
          token: <input type="text" name="token" onChange={this.handleChange} />
        </label>
        <GQL fetcher={newGraphQLFetcher(this.state.token)} />
      </Wrapper>
    );
  }
}

export default GraphiQL;
