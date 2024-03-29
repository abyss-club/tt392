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

const UpperArea = styled.div`
  /* hack */
  margin: 0 auto .5rem;
  max-width: ${maxWidth}rem;

  display: flex;
  flex-flow: row wrap;
  background-color: white;
  border: none;
`;

const TitleText = styled.h2`
  width: 100%;
  height: 3.5rem;

  font-weight: 600;
  font-size: 1.125em;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Type = styled.div`
  flex: 0 1 calc((100% - 2rem - 6em) / 3);

  text-align: center;
  font-size: .8em;
  padding: .625rem 0 .5rem;
  ${props => (props.selected ? `border-bottom: 2px solid ${colors.accentGreen};` : 'border: none')}
  color: ${props => (props.selected ? colors.regularBlack : colors.regularGrey)};

  cursor: pointer;
  :hover {
    border-bottom: 2px solid ${colors.accentGreen};
  }
`;

const TypeBar = styled.article`
  width: 100%;

  display: flex;
  justify-content: space-evenly;

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
      {' '}
      {unreadNotiCount[type]}
    </Type>
  ));
  return (
    <Wrapper>
      <UpperArea>
        <TitleText>消息中心</TitleText>
        <TypeBar>
          {selectableType}
        </TypeBar>
      </UpperArea>
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
