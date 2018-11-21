import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Store from 'providers/Store';
import MainContent, { maxWidth } from 'styles/MainContent';
import colors from 'utils/colors';
import Panel from './Panel';

const Wrapper = styled.div`
  margin: 0;
`;

const Type = styled.div`
  flex: 0 1 calc((100% - 2rem - 6em) / 3);

  text-align: center;
  font-size: .8em;
  padding-bottom: .5rem;
  margin: 0 1em;
  ${props => (props.selected ? `border-bottom: 2px solid ${colors.accentRed};` : 'border: none')}
  color: ${props => (props.selected ? colors.regularBlack : colors.regularGrey)};

  cursor: pointer;
  :hover {
    border-bottom: 2px solid ${colors.accentRed};
  }
`;

const TypeBar = styled.article`
  width: ${maxWidth}rem;

  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  background-color: white;
  border: none;
  padding: 1rem 0 0;
  border-radius: 1rem 1rem 0 0;
  :after {
    content: "";
    display: block;
    width: calc(100% - 2rem);
    border-bottom: 1px solid ${colors.borderGrey};
    margin: 0 1rem;
  }
`;

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: ['replied', 'quoted', 'system'],
      typeText: { replied: '回复我的', quoted: '引用我的', system: '通告' },
      currentPanel: 'replied',
    };
  }

  render() {
    const {
      currentPanel, types, typeText,
    } = this.state;
    const selectableType = types.map(type => (
      <Type
        key={type}
        selected={currentPanel === type}
        onClick={() => { this.setState({ currentPanel: type }); }}
      >
        {typeText[type]}: {this.props.badgeCount[type]}
      </Type>
    ));
    return (
      <MainContent>
        <Wrapper>
          <TypeBar>
            {selectableType}
          </TypeBar>
          <Panel type={this.state.currentPanel} />
        </Wrapper>
      </MainContent>
    );
  }
}
Notifications.propTypes = {
  badgeCount: PropTypes.shape().isRequired,
};

export default () => (
  <Store.Consumer>
    {({ unreadNotiCount, setStore }) => (
      <Notifications
        setStore={setStore}
        badgeCount={unreadNotiCount}
      />
    )}
  </Store.Consumer>
);
