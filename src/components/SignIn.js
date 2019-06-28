import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';

import Caution from 'components/icons/Caution';
import { maxWidth } from 'styles/MainContent';
import colors from 'utils/colors';

const Wrapper = styled.div`
  max-width: ${maxWidth}em;
  background-color: white;
  width: 24rem;
  margin: 1rem auto;
  padding: 1.5rem 1rem;
  border-radius: .5rem;
`;

const CompleteInfoWrapper = styled.div`
`;

const LoginTitle = styled.h2`
  text-align: center;
`;

const EmailInput = styled.input`
  width: 100%;
  height: 3rem;
  padding: 0.5rem 1rem;
  margin: 1.5rem 0 .75rem;
  border: none;
  border-radius: 1.5rem;
  background-color: ${colors.mainBg};

  ::placeholder {
    color: ${colors.regularGrey};
  }
`;

const ErrWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 .25rem 0;
  margin-bottom: .75rem;
`;

const ErrInfo = styled.p`
  margin-left: .25rem;
  font-size: .6875em;
`;

const NextBtn = styled.button`
  width: 100%;
  height: 3rem;
  background-color: ${colors.accentGreen};
  color: white;
  border: none;
  outline: none;
  border-radius: 1.5rem;

  :disabled {
    background-color: ${colors.buttonBgDisabled};
  }
`;

const CompleteTitle = styled.div`
  width: 100%;

  background-color: white;
  margin: 0.5rem 0 0rem;
  padding: 0 0;

  :after {
    content: "";
    display: block;
    width: 100%;
    border-bottom: 1px solid ${colors.borderGrey};
    margin: 0;
    padding-top: 1rem;
  }
`;

const CompleteText = styled.p`
  color: ${colors.regularGrey};
  margin-top: 1rem;
  font-size: .75em;

  > p {
    color: ${colors.titleBlack};
    font-size: calc(14em / 12);
    font-weight: 600;
  }
`;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INIT',
      email: '',
      disabled: true,
      info: '',
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;
    if (!isEmail(email)) {
      this.setState({ status: 'ERROR', disabled: true, info: '不是合法的邮件地址。' });
    } else {
      this.setState({ disabled: true });
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
  }

  handleChange = (e) => {
    this.setState({ status: 'INIT', info: '' });
    if (e.target.value) {
      this.setState({ email: e.target.value, disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  }

  render() {
    const { status, email, disabled } = this.state;
    const completed = (
      <CompleteInfoWrapper>
        <CompleteTitle><h2>检查你的邮箱</h2></CompleteTitle>
        <CompleteText>
          一封包含了登录链接的电子邮件已被发送到：
          <p>{email}</p>
        </CompleteText>
      </CompleteInfoWrapper>
    );
    return (
      <Wrapper>
        {(status !== 'COMPLETE') && (
        <>
          <LoginTitle>登录</LoginTitle>
          <form onSubmit={this.handleSubmit}>
            <EmailInput
              type="email"
              onChange={this.handleChange}
              placeholder="邮箱地址"
              ref={(input) => { this.input = input; }}
            />
            {(status === 'ERROR') && (
              <ErrWrapper>
                <Caution />
                <ErrInfo>{this.state.info || '发生了错误，请重试。'}</ErrInfo>
              </ErrWrapper>
            )}
            <p><NextBtn type="submit" disabled={disabled}>下一步</NextBtn></p>
          </form>
        </>
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
