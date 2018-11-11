import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import User from 'components/icons/User';
// import colors from 'utils/colors';

const IconWrapper = styled(User)`
  background-color: unset;
  border: none;
  font-size: 1.5em;
  margin: 0 0 0 2.5rem;
  cursor: pointer;
  outline: none;
  line-height: 0;
`;

const SignInText = styled.p`
  color: white;
  font-weight: bold;
`;

const SignInBtn = ({ profile }) => {
  if ((profile.email || '') !== '') {
    return (
      <Link to="/profile/">
        <IconWrapper />
      </Link>
    );
  }
  return (
    <Link to="/sign_in/">
      <SignInText>注册/登录</SignInText>
    </Link>
  );
};
SignInBtn.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default SignInBtn;
