import React from 'react';
import PropTypes from 'prop-types';

import SignIn from './SignIn';

const { Provider, Consumer } = React.createContext({});

const modalElements = {
  SIGN_IN: SignIn,
};

const ModalContainer = ({ name, close }) => {
  const Elem = modalElements[name];
  if (!Elem) {
    return null;
  }
  return <Elem close={close} />;
};
ModalContainer.propTypes = {
  name: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

class FeedbackProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open = (name) => {
    this.setState({ name });
  }

  close = () => {
    this.open('');
  }

  render() {
    const { name } = this.state;
    const { children } = this.props;
    const data = {
      name,
      openFeedback: this.open,
      close: this.close,
    };
    return (
      <Provider value={data}>
        <ModalContainer name={name} close={this.close} />
        { children }
      </Provider>
    );
  }
}
FeedbackProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default {
  Provider: FeedbackProvider,
  Consumer,
};
