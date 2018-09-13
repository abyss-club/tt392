import React from 'react';
import PropTypes from 'prop-types';

const { Provider, Consumer } = React.createContext();

class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    /* eslint-disable */
    this.state = {
      initialized: false,
      profile: {
        isSignedIn: false,
        name: '',
        email: '',
      },
      tags: {
        mainTags: new Set(),
        subscribed: {
          main: new Set(),
          sub: new Set(),
        },
      },
      quotedPosts: new Set(),
      setStore: this.setStore,
    };
    /* eslint-enable */
  }

  // superpower function, just for early in devlopment
  setStore = (change) => {
    this.setState(change);
  }

  render() {
    return (
      <Provider value={this.state} >
        {this.props.children}
      </Provider>
    );
  }
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default {
  Provider: StoreProvider,
  Consumer,
};
