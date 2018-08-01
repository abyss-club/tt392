import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import colors from 'utils/colors';

const Text = styled.p`
  color: ${colors.orange};
`;

const SignInBtn = ({ profile }) => {
  if ((profile.email || '') !== '') {
    return (
      <p><small>{profile.email}</small></p>
    );
  }
  return (
    <Link to="/sign_in/">
      <Text>登录/注册</Text>
    </Link>
  );
};
SignInBtn.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default SignInBtn;
