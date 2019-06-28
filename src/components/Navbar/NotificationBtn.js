import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import Store from 'providers/Store';
import Query from 'components/Query';
import Discussion from 'components/icons/Discussion';
import colors from 'utils/colors';

const IconWrapper = styled(Discussion)`
  position: relative;
  background-color: unset;
  border: none;
  font-size: 1.5em;
  margin: 0;
  cursor: pointer;
  outline: none;
  line-height: 0;
`;

const Badge = styled.div`
  display: ${props => (props.count === 0 ? 'none' : 'unset')};
  position: absolute;
  left: 1.25em;
  top: -1.5em;

  background-color: ${colors.accentGreen};
  height: 1em;
  color: white;

  font-size: .5em;
  border-radius: .5em;
  padding: .75em .5em;
  text-decoration: none;
  z-index: 10;
  line-height: 0;
`;

const StyledLink = styled(Link)`
  position: relative;
  text-decoration: none;
`;

class NotificationBtn extends React.Component {
  constructor(props) {
    super(props);
    const { setStore, unreadNotiCount } = this.props;
    const { system, replied, quoted } = unreadNotiCount;
    const badgeCount = (system || 0) + (replied || 0) + (quoted || 0);
    setStore({
      unreadNotiCount: {
        system: system || 0,
        replied: replied || 0,
        quoted: quoted || 0,
      },
    });
    this.state = { badgeCount };
  }
  render() {
    const { badgeCount } = this.state;
    return (
      <StyledLink to="/notification/">
        <IconWrapper />
        <Badge count={badgeCount}>{badgeCount}</Badge>
      </StyledLink>
    );
  }
}
NotificationBtn.propTypes = {
  setStore: PropTypes.func.isRequired,
  unreadNotiCount: PropTypes.shape({
    system: PropTypes.number.isRequired,
    replied: PropTypes.number.isRequired,
    quoted: PropTypes.number.isRequired,
  }).isRequired,
};

const GET_UNREADNOTICOUNT = gql`
  query {
    unreadNotiCount {
      system
      replied
      quoted
    }
  }
`;

export default () => (
  <Store.Consumer>
    {({ setStore }) => (
      <Query query={GET_UNREADNOTICOUNT}>
        {({ data }) => (
          <NotificationBtn
            unreadNotiCount={data.unreadNotiCount}
            setStore={setStore}
          />
        )}
      </Query>
    )}
  </Store.Consumer>
);
