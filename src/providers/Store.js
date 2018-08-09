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
        subTags: [],
        subscribed: {
          main: new Set(),
          sub: new Set(),
        },
      },
      setTagsByTree: this.setTagsByTree,
      setSubscribed: this.setSubscribed,
      setSubbedDirectly: this.setSubbedDirectly,
    };
  }

  setTagsByTree = (tree) => {
    const { tags } = this.state;
    const subTags = new Set();
    const mainTags = new Set();
    tree.forEach((mainTag) => {
      mainTags.add(mainTag.mainTag);
      if (mainTag.subTags) {
        mainTag.subTags.forEach((tag) => {
          subTags.add(tag);
        });
      }
    });
    tags.mainTags = mainTags;
    tags.subTags = subTags;
    this.setState({ tags });
  }

  setSubbedDirectly = (subscribed) => {
    const { tags } = this.state;
    tags.subscribed = subscribed;
    this.setState({ tags });
  }

  setSubscribed = (subscribedTags) => {
    const { tags } = this.state;
    if (subscribedTags) {
      const main = new Set();
      const newSubscribedTags = new Set([...subscribedTags]);
      console.log(newSubscribedTags);
      tags.mainTags.forEach((mainTag) => {
        // console.log({ mainTag });
        newSubscribedTags.forEach((subsTag, idx) => {
          // console.log({ mainTag, subsTag });
          if (mainTag === subsTag) {
            main.add(mainTag);
            newSubscribedTags.delete(mainTag);
          }
        });
      });
      console.log({ main, newSubscribedTags });
      tags.subscribed.main = main;
      tags.subscribed.sub = newSubscribedTags;
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
