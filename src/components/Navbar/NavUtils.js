import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'utils/colors';

import Modal from 'components/Modal';

const NavUtilWrapper = styled.nav`
  margin-left: auto;

  display: flex;
  flex-flow: row nowrap;
`;

const IconWrapper = styled.button`
  color: white;
  background-color: ${colors.orange};
  font-size: 1em;
  appearance: none;
  border: 0;
  border-radius: 5px;
  width: 2em;
  height: 2em;
  margin: 0 .125em;
  line-height: 2.0;
`;

const Icon = ({ name, onClick }) => (
  <IconWrapper onClick={onClick}>
    <FontAwesomeIcon icon={name} />
  </IconWrapper>
);
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
Icon.defaultProps = {
  onClick: () => {},
};

const NavUtils = () => (
  <NavUtilWrapper>
    <Icon name="plus-square" />
    <Modal.Consumer>
      {({ openModal }) => (
        <Icon name="user" onClick={() => { openModal('SIGN_IN'); }} />
      )}
    </Modal.Consumer>
    <Icon name="bars" />
  </NavUtilWrapper>
);

export default NavUtils;
