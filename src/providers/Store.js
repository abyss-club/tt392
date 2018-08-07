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
        subscribed: [],
      },
      setMainTags: this.setMainTags,
    };
  }

  setMainTags = (mainTags) => {
    const { tags } = this.state;
    tags.mainTags = mainTags;
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
