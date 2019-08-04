import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 40;
  background-color: rgba(0, 0, 0, .65);
`;

const Content = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  overflow: auto;
  text-align: center;
  padding: 4px;
  cursor: pointer;

  :after {
    vertical-align: middle;
    display: inline-block;
    height: 100%;
    margin-left: -.05em;
    content: '';
  }
`;

const Dialog = styled.div`
  position: relative;
  outline: 0;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  max-width: auto;
  cursor: default;
  border-radius: .25rem;
`;


class ModalWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.listenKeyboard = this.listenKeyboard.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onDialogClick = this.onDialogClick.bind(this);
  }

  componentDidMount() {
    const { onClose } = this.props;
    if (onClose) {
      window.addEventListener('keydown', this.listenKeyboard.bind(this), true);
    }
  }

  componentWillUnmount() {
    const { onClose } = this.props;
    if (onClose) {
      window.removeEventListener('keydown', this.listenKeyboard.bind(this), true);
    }
  }

  onOverlayClick() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  onDialogClick = (event) => {
    const { onClose } = this.props;
    if (onClose) {
      event.stopPropagation();
    }
  }

  listenKeyboard(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      const { onClose } = this.props;
      onClose();
    }
  }

  render = () => {
    const { children } = this.props;
    return (
      <div>
        <Overlay />
        <Content onClick={this.onOverlayClick}>
          <Dialog onClick={this.onDialogClick}>
            {children}
          </Dialog>
        </Content>
      </div>
    );
  }
}

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
};
ModalWrapper.defaultProps = {
  onClose: null,
};

export default ModalWrapper;
