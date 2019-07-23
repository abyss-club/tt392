import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import RequireSignIn from 'components/RequireSignIn';
import NotiContext from 'providers/Noti';
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
  margin: 0 auto .5rem;

  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  background-color: white;
  border: none;
`;

const Notifications = () => {
  const notiTypes = ['replied', 'quoted', 'system'];
  const [{ unreadNotiCount }] = useContext(NotiContext);
  const typeText = { replied: '回复我的', quoted: '引用我的', system: '通告' };
  const [currentPanel, setCurrentPanel] = useState('replied');

  const selectableType = notiTypes.map(type => (
    <Type
      key={type}
      selected={currentPanel === type}
      onClick={() => { setCurrentPanel(type); }}
    >
      {typeText[type]}
:
      {unreadNotiCount[type]}
    </Type>
  ));
  return (
    <Wrapper>
      <TypeBar>
        <Title>消息中心</Title>
        {selectableType}
      </TypeBar>
      <MainContent>
        <Panel type={currentPanel} />
      </MainContent>
    </Wrapper>
  );
};

export default () => (
  <>
    <RequireSignIn />
    <Notifications />
  </>
);
