import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import colors from 'utils/colors';

import ModalWrapper from './ModalWrapper';

const Wrapper = styled.div`
  width: 90vw;
  max-width: 36rem;
  padding: 1rem;
  background: white;
  text-align: left;
`;

const Title = styled.h4`
  margin: 0 0 1rem 0;
`;

const ActionRow = styled.div`
  width: 100%;
  margin: 1rem 0 0 0;
  display: flex;
  justify-content: right;
`;

const CloseBtn = styled.button`
  padding: 0;
  outline: none;
  border: none;
  background: transparent;
  color: ${colors.orange};
  cursor: pointer;
`;

const Notice = ({ title, message, close }) => (
  <ModalWrapper onClose={close}>
    <Wrapper>
      <Title>{title}</Title>
      <div>{message}</div>
      <ActionRow>
        <CloseBtn onClick={close}>关闭</CloseBtn>
      </ActionRow>
    </Wrapper>
  </ModalWrapper>
);

Notice.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  close: PropTypes.func.isRequired,
};
Notice.defaultProps = {
  title: '',
  message: '',
};

export default Notice;
