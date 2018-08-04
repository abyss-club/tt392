import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import colors from 'utils/colors';

const PROFILE_QUERY = gql`
  query FetchProfile {
    profile {
      email
      name
    }
  }
`;

const UPDATE_NAME = gql`
  mutation UpdateName($name: String!) {
    setName(name: $name) {
      name
    }
  }
`;

const NameInput = styled.input`
  width: 100%;
  display: block;
  font-size: 1em;
  text-align: start;
  border-radius: 5px;
  color: black;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  height: 2.25em;
  padding: 0em .5em;
  appearance: none;
  max-width: 21.25em;

  :focus {
    text-align: start;
    color: black;
  }
`;

const SubmitBtn = styled.input`
  background-color: ${colors.orange};
  color: #fff;
  font-weight: 600;
  padding-top: .5rem;
  padding-bottom: .5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-width: 1px;
  border-color: #dae1e7;
  border-radius: .25rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
  height: 2.5em;
  margin-top: 1em;
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
          <p>欢迎{data.profile.name && `，${data.profile.name}`}</p>
          {data.profile.name || (
            <React-Fragment>
              <p>Your name is not set.</p>
              <Mutation mutation={UPDATE_NAME} refetchQueries={['FetchProfile']}>
                {(setName, { innerData }) => (
                  <NameForm setName={setName} data={innerData} />
                )}
              </Mutation>
            </React-Fragment>
          )}
        </div>
      );
    }}
  </Query>
);

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', status: 'INIT', disabled: false };
    this.input = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.input.value;
    this.setState({ name, disabled: true });
    this.props.setName({ variables: { name } }).then(({ data }) => {
      if (data.name || false) {
        this.setState({ status: 'COMPLETE', disabled: false });
      } else {
        this.setState({ status: 'ERROR', disabled: false });
      }
    }).catch(() => {
      this.setState({ status: 'ERROR', disabled: false });
    });
  }

  render = () => (
    <form onSubmit={this.handleSubmit}>
      <NameInput type="text" name="name" placeholder="Set your name here ..." innerRef={(input) => { this.input = input; }} />
      <SubmitBtn type="submit" value="Submit" />
    </form>
  );
}

export default Profile;
