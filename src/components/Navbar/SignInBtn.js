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

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const SignInBtn = ({ profile }) => {
  if ((profile.email || '') !== '') {
    return (
      <StyledLink to="/profile" title="Profile">
        <IconWrapper />
      </StyledLink>
    );
  }
  return (
    <StyledLink to="/sign_in">
      <SignInText>注册/登录</SignInText>
    </StyledLink>
  );
};
SignInBtn.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default SignInBtn;
