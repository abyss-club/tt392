import React from 'react';

import Notice from './Notice';

const modalElements = {
  NOTICE: Notice,
};

const modal = {
  open: () => {},
  close: () => {},
};

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', params: {} };
    modal.open = this.open;
    modal.close = this.close;
  }

  open = (name, params) => {
    this.setState({ name, params });
  }

  close = () => {
    this.open('');
  }

  render() {
    const { name, params } = this.state;
    const Elem = modalElements[name];
    if (!Elem) {
      return null;
    }
    return (
      <Elem close={this.close} {...params} />
    );
  }
}
export default modal;
export { ModalContainer };
