import React from 'react';
import PropTypes from 'prop-types';

import ModalWrapper from './ModalWrapper';

const SignIn = ({ close }) => (
  <ModalWrapper onClose={close}>
    <button onClick={close}> Sign in! </button>
  </ModalWrapper>
);

SignIn.propTypes = {
  close: PropTypes.func.isRequired,
};

export default SignIn;
