import React from 'react';
import PropTypes from 'prop-types';

const { Provider, Consumer } = React.createContext();
// const store = {
//   tags: {
//     mainTags: [],
//     subscribed: [],
//   },
//   mutation: {
//     addMainTags: (mainTags) => { this.tags.mainTags = mainTags; },
//   },
// };

class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {
        mainTags: [],
        subscribed: {
          main: new Set(),
          sub: new Set(),
        },
      },
      setMainTags: this.setMainTags,
      setSubscribed: this.setSubscribed,
      setSubbedDirectly: this.setSubbedDirectly,
    };
  }

  setMainTags = (mainTags) => {
    const { tags } = this.state;
    tags.mainTags = mainTags;
    this.setState({ tags });
  }

  setSubbedDirectly = (subscribed) => {
    const { tags } = this.state;
    tags.subscribed = subscribed;
    this.setState({ tags });
  }

  setSubscribed = (subscribedTags) => {
    const { tags } = this.state;
    const main = new Set();
    const sub = new Set();
    if (subscribedTags) {
      const newSubscribedTags = [...subscribedTags];
      tags.mainTags.forEach((mainTag) => {
        newSubscribedTags.forEach((subsTag, idx) => {
          if (mainTag === subsTag) {
            main.add(newSubscribedTags.splice(idx, 1)[0]);
          } else {
            sub.add(newSubscribedTags.splice(idx, 1)[0]);
          }
        });
      });
      tags.subscribed.main = main;
      tags.subscribed.sub = sub;
    } else {
      tags.subscribed = null;
    }

    this.setState({ tags });
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
