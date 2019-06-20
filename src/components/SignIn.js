import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import AbyssLogo from 'components/icons/AbyssLogo';

import colors from 'utils/colors';

const Wrapper = styled.div`
  width: 18rem;
  margin: 7rem auto;
  text-align: center;
  color: white;
`;

const Logo = styled.div`
  padding-top: 1rem;
`;

const CompleteInfoWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  background-color: rgba(0, 0, 0, 0.1);
`;

const EmailInput = styled.input`
  width: 100%;
  height: 3rem;
  padding: 0.5rem .75rem;
  margin: 1.5rem 0;
  border: none;
  border-radius: .5rem;
  outline: none;
`;

const NextBtn = styled.button`
  width: 100%;
  height: 3rem;
  background: ${colors.accentRed};
  color: white;
  border: none;
  outline: none;
  border-radius: .5rem;
`;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INIT',
      email: '',
      disabled: false,
    };
    this.input = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.input.value;
    this.setState({ email, disabled: true });
    this.props.auth({ variables: { email } }).then(({ data }) => {
      if (data.auth || false) {
        this.setState({ status: 'COMPLETE', disabled: false });
      } else {
        this.setState({ status: 'ERROR', disabled: false });
      }
    }).catch(() => {
      this.setState({ status: 'ERROR', disabled: false });
    });
  }

  render() {
    const { status, email, disabled } = this.state;
    const completed = (
      <CompleteInfoWrapper>
        <h4>我们给你发送了一个登录链接!</h4>
        <p>我们发送了一封电子邮件到</p>
        <p><small>{email}</small></p>
        <p>其中包含一个用于登录的魔法链接</p>
      </CompleteInfoWrapper>
    );
    return (
      <Wrapper>
        <h3>进入</h3>
        <Logo><AbyssLogo /></Logo>
        {(status !== 'COMPLETE') && (
        <form onSubmit={this.handleSubmit}>
          <p>
            <EmailInput
              type="email"
              placeholder="邮箱地址"
              ref={(input) => { this.input = input; }}
            />
          </p>
          <p><NextBtn type="submit" disabled={disabled}>下一步</NextBtn></p>
          {(status === 'ERROR') && (
            <p>发生了错误，请重试</p>
          )}
        </form>
        )}
        {(status === 'COMPLETE') && completed}
      </Wrapper>
    );
  }
}

SignIn.propTypes = {
  auth: PropTypes.func.isRequired,
};

const SIGN_IN = gql`
  mutation Auth($email: String!) {
    auth(email: $email)
  }
`;

export default () => (
  <Mutation mutation={SIGN_IN}>
    {auth => (
      <SignIn auth={auth} />
    )}
  </Mutation>
);
