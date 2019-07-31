import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import isEmail from 'validator/lib/isEmail';

import Caution from 'components/icons/Caution';
import LoginContext from 'providers/Login';
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
  cursor: pointer;

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
`;

const CompleteEmail = styled.p`
  color: ${colors.titleBlack};
  font-size: .875em;
  font-weight: 600;
`;

const SignIn = () => {
  const [status, setStatus] = useState('INIT');
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [info, setInfo] = useState('');

  const [auth, { error, loading, data }] = useMutation(SIGN_IN, { variables: { email } });

  useEffect(() => {
    // console.log({ loading, data });
    // console.log('in effect');
    if (!loading && !error && data && data.auth) {
      setStatus('COMPLETE');
      setDisabled(false);
    } else if (error) {
      setInfo(error.message);
      setStatus('ERROR');
      setDisabled(false);
    }
  }, [loading, error, data]);
  // TODO: adding data to dep list would cause infinite rerender in apollo hooks beta

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setStatus('ERROR');
      setDisabled(true);
      setInfo('不是合法的邮件地址。');
    } else {
      setDisabled(true);
      auth();
    }
  };

  const handleChange = useCallback((e) => {
    setStatus('INIT');
    if (e.target.value) {
      setEmail(e.target.value);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, []);

  // if (profile.isSignedIn) history.replace('/profile');

  const completed = (
    <div>
      <CompleteTitle><h2>检查你的邮箱</h2></CompleteTitle>
      <CompleteText>
        一封包含了登录链接的电子邮件已被发送到：
      </CompleteText>
      <CompleteEmail>{email}</CompleteEmail>
    </div>
  );
  return (
    <Wrapper>
      {(status !== 'COMPLETE') && (
        <>
          <LoginTitle>登录</LoginTitle>
          <form onSubmit={handleSubmit}>
            <EmailInput
              type="email"
              onChange={handleChange}
              placeholder="邮箱地址"
              disabled={loading}
            />
            {(status === 'ERROR') && (
              <ErrWrapper>
                <Caution />
                <ErrInfo>{info || '发生了错误，请重试。'}</ErrInfo>
              </ErrWrapper>
            )}
            <p><NextBtn type="submit" title="下一步" disabled={!email || disabled}>下一步</NextBtn></p>
          </form>
        </>
      )}
      {(status === 'COMPLETE') && completed}
    </Wrapper>
  );
};

const SIGN_IN = gql`
  mutation Auth($email: String!) {
    auth(email: $email)
  }
`;

export default SignIn;
