import React from 'react';
import PropTypes from 'prop-types';

const { Provider, Consumer } = React.createContext();

class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    /* eslint-disable react/no-unused-state */
    this.state = {
      initialized: false,
      profile: {
        isSignedIn: false,
        name: '',
        email: '',
      },
      unreadNotiCount: {
        system: null,
        replied: null,
        quoted: null,
      },
      tags: {
        mainTags: new Set(),
        subscribed: {
          main: new Set(),
          sub: new Set(),
        },
      },
      quotedPosts: new Set(),
      publish: () => {},
      publishRdy: false,
      setStore: this.setStore,
      scroll: {
        y: 0,
        diff: 0,
      },
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
