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

const Title = styled.h2`
  color: ${colors.regularGrey};
  width: 100%;
  font-size: 1.125em;
  font-weight: 600;
  margin: 1rem 0;
  text-align: center;
`;

const Type = styled.div`
  flex: 0 1 calc((100% - 2rem - 6em) / 3);

  text-align: center;
  font-size: .8em;
  padding: .625rem 0 .5rem;
  margin: 0 1em;
  ${props => (props.selected ? `border-bottom: 2px solid ${colors.accentGreen};` : 'border: none')}
  color: ${props => (props.selected ? colors.regularBlack : colors.regularGrey)};

  cursor: pointer;
  :hover {
    border-bottom: 2px solid ${colors.accentGreen};
  }
`;

const TypeBar = styled.article`
  max-width: ${maxWidth}rem;
  margin-bottom: .5rem;

  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  background-color: white;
  border: none;
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
      <Wrapper>
        <TypeBar>
          <Title>消息中心</Title>
          {selectableType}
        </TypeBar>
        <MainContent>
          <Panel type={this.state.currentPanel} />
        </MainContent>
      </Wrapper>
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
