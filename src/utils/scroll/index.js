import React from 'react';
import Store from 'providers/Store';
import PropTypes from 'prop-types';

let ticking = false;
let lastScrollY = 0;
let diff = 0;

class ScrollContainer extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    diff = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        this.props.setStore({
          scroll: {
            y: lastScrollY,
            diff,
          },
        });
        ticking = false;
      });

      ticking = true;
    }
  }

  render() {
    return (
      <div />
    );
  }
}
ScrollContainer.propTypes = {
  setStore: PropTypes.func.isRequired,
};

export default () => (
  <Store.Consumer>
    {({ setStore, scroll }) => (
      <ScrollContainer
        setStore={setStore}
        scroll={scroll}
      />
    )}
  </Store.Consumer>
);
