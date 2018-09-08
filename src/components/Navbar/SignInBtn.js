import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Discussion from 'components/icons/Discussion';
import User from 'components/icons/User';
import colors from 'utils/colors';

const IconWrapper = styled(User)`
  background-color: unset;
  border: none;
  font-size: 1.5em;
  margin: 0 1.5rem;
  cursor: pointer;
  outline: none;
  line-height: 0;
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
      <IconWrapper />
    </Link>
  );
};
SignInBtn.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default SignInBtn;
