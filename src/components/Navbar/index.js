import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Link, Switch, withRouter } from 'react-router-dom';

import Store from 'providers/Store';
import MainContent from 'styles/MainContent';
import AbyssLogo from 'components/icons/AbyssLogo';
import Tick from 'components/icons/Tick';
import Cross from 'components/icons/Cross';
import Send from 'components/icons/Send';
import colors from 'utils/colors';

import NavTags from './NavTags';
import SignInBtn from './SignInBtn';

const Wrapper = styled.div`
  width: 100%;
`;

const NavWrapper = styled.nav`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0;
`;

const NavFirstRow = styled.div`
  height: 3.5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  color: white;
  width: 100%;
  padding: 0 1rem;
`;

const NavFirstRowCompose = styled(NavFirstRow)`
  justify-content: flex-start;
  padding: 0 .5rem;
`;

const NavText = styled.span`
  font-size: 1.125em;
`;

const NavTitle = styled(AbyssLogo)`
  font-size: 1em;
`;

const IconWrapper = styled.button`
  background-color: ${colors.buttonBgBlack};
  font-size: 1em;
  border: 0;
  outline: 0;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  line-height: 0;
  cursor: pointer;
  > svg {
    > path {
      stroke: white;
    }
  }
`;

const ComposeBtnWrapper = styled.button`
  display: inline-flex;
  align-items: center;

  appearance: none;
  border: 0;
  background: none;
  outline: none;
  cursor: pointer;
`;

const TickBtnWrapper = styled(IconWrapper)`
`;

const TickBtn = ({ onClick }) => (
  <TickBtnWrapper onClick={onClick}>
    <Tick />
  </TickBtnWrapper>
);
TickBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const CloseBtn = styled(ComposeBtnWrapper)`
  padding: 0 .5rem 0 .5rem;
  font-size: 1.5em;
`;

const SendBtn = styled(ComposeBtnWrapper)`
  font-size: 1.5em;
  margin-left: auto;
  padding: 0;
  > svg {
    > path {
      fill: ${colors.accentRed};
    }
  }
  :disabled {
    > svg {
      > path {
        fill: ${colors.buttonBgBlack};
      }
    }
  }
`;

const Navbar = ({
  profile, publish, history, publishRdy,
}) => {
  const firstRowRegular = (
    <NavFirstRow>
      <Link to="/">
        <NavTitle />
      </Link>
      <Switch>
        <Route path="/tags" exact render={() => <TickBtn onClick={() => { history.push('/'); }} />} />
        <Route path="/" render={() => <SignInBtn profile={profile || {}} />} />
      </Switch>
    </NavFirstRow>
  );

  const firstRowComposing = ({ match }) => (
    <NavFirstRowCompose>
      <CloseBtn onClick={() => history.goBack()}><Cross /></CloseBtn>
      <NavText>{match.params.mode === 'thread' ? '发表新帖' : '回复引用'}</NavText>
      <SendBtn
        disabled={!publishRdy}
        onClick={publish}
      >
        <Send />
      </SendBtn>
    </NavFirstRowCompose>
  );
  firstRowComposing.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        mode: PropTypes.string,
      }),
    }).isRequired,
  };

  return (
    <Wrapper>
      <MainContent>
        <NavWrapper>
          <Switch>
            <Route path="/draft/:mode" exact render={({ match }) => firstRowComposing({ match })} />
            <Route path="/" render={() => firstRowRegular} />
            {/* <Route path="/tags" render={() => firstRowRegular} />
            <Route path="/thread" render={() => firstRowRegular} />
            <Route path="/profile" render={() => firstRowRegular} /> */}
          </Switch>
          <Route path="/" exact component={NavTags} />
          <Route path="/thread/:id" exact component={NavTags} />
        </NavWrapper>
      </MainContent>
    </Wrapper>
  );
};
Navbar.propTypes = {
  profile: PropTypes.shape().isRequired,
  history: PropTypes.shape({}).isRequired,
  publish: PropTypes.func.isRequired,
  publishRdy: PropTypes.bool.isRequired,
};

const NavbarWithRouter = withRouter(Navbar);

export default () => (
  <Store.Consumer>
    {({
      profile, tags, publish, publishRdy,
    }) => (
      <NavbarWithRouter
        profile={profile}
        tags={tags}
        publish={publish}
        publishRdy={publishRdy}
      />
    )}
  </Store.Consumer>
);
