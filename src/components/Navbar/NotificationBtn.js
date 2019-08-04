import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import NotiContext from 'providers/Noti';
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
  top: -1em;

  background-color: ${colors.accentGreen};
  height: 1em;
  color: white;

  font-size: .5em;
  border-radius: .5em;
  padding: .75em .5em;
  text-decoration: none;
  z-index: 15;
  line-height: 0;
`;

const StyledLink = styled(Link)`
  position: relative;
  text-decoration: none;
`;

const NotificationBtn = () => {
  const { loading, data } = useQuery(GET_UNREADNOTICOUNT);
  const [, dispatch] = useContext(NotiContext);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      const { system, replied, quoted } = data.unreadNotiCount;
      setBadgeCount(system + replied + quoted);
      dispatch({
        type: 'SET_NOTI_COUNT',
        system,
        replied,
        quoted,
      });
    }
  }, [data, dispatch, loading]);

  return (
    <StyledLink title="Notification" to="/notification/">
      <IconWrapper />
      <Badge count={badgeCount}>{badgeCount}</Badge>
    </StyledLink>
  );
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

export default NotificationBtn;
