import React, {
  useState, useContext, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Link, Switch } from 'react-router-dom';
import { useRouter } from 'utils/routerHooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import AbyssLogo from 'components/icons/AbyssLogo';
import Tick from 'components/icons/Tick';
import Cross from 'components/icons/Cross';
import colors from 'utils/colors';

import LoginContext from 'providers/Login';
import DraftContext from 'providers/Draft';
import RefetchContext from 'providers/Refetch';
import SignInBtn from './SignInBtn';
import NotificationBtn from './NotificationBtn';

const NavWrapper = styled.nav`
  position: sticky;
  top: 0;

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background-color: ${props => (props.compose ? 'white' : colors.titleBlack)};
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
  padding: 0 .5rem;
  color: #36393F;
`;

const NavFirstRowError = styled(NavFirstRow)`
  padding: 0 .5rem;
  background-color: #FF4F37;
  color: white;
`;

const ErrInfo = styled.p`
  display: flex;
  flex-flow: row nowrap;
  justify-items: center;

  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const TitleAndModeWrapper = styled.div`
  flex: 1 0 auto;
  margin: 0 auto;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
`;

const SendModeWrapper = styled.div`
  color: ${colors.accentGreen};
`;

const SelectWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 auto;

  > select {
    display: block;
    position: relative;
    appearance: none;
    cursor: pointer;

    font-size: .6875em;
    font-family: sans-serif;

    color: ${colors.accentGreen};
    background-color: white;

    max-width: 100%;
    padding: 0 1em 0 .125em;
    border: none;
  }

  :after {
    z-index: 1;
    display: block;
    content: "";
    position: absolute;
    width: .25em;
    height: .25em;
    margin-top: -.3125em;
    right: .125em;
    top: 50%;
    border: 1px solid ${colors.accentGreen};
    border-radius: 0;
    border-right: 0;
    border-top: 0;
    pointer-events: none;
    transform: rotate(-45deg);
    transform-origin: center;
  }
`;

const NavText = styled.p`
  width: 100%;
  text-align: center;
  font-size: .875em;
  margin: 1.0625rem 0 0;
`;

const NavTitle = styled(AbyssLogo)`
  font-size: 1em;
`;

const NavRight = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;
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

const TickBtn = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <Tick />
  </IconWrapper>
);
TickBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
};


const CloseBtn = styled(ComposeBtnWrapper)`
  padding: 0 .5rem 0 .5rem;
  font-size: 1.5em;
  > svg {
    > path {
      stroke: ${props => (props.isError ? 'white' : colors.regularGrey)};
    }
  }
`;

const SendBtn = styled(ComposeBtnWrapper)`
  font-size: .75em;
  margin-left: auto;
  padding: .5rem 1rem;
  border-radius: 1rem;
  color: white;
  background-color: ${colors.buttonBg};

  :disabled {
    background-color: ${colors.buttonBgDisabled};
  }
`;

// const HashBtn = styled.button`
//   outline: 0;
//   border: 0;
//   background: none;
//   margin: 0 2.5rem 0 0;
//   cursor: pointer;
//
//   display: ${props => (props.y > startHide ? 'block' : 'none')};
// `;
//
/* <SignInBtn profile={profile || {}} /> */
const LoginWrapper = () => {
  const [{ profile }] = useContext(LoginContext);
  return (
    <>
      {profile.email && (<NotificationBtn />)}
      <SignInBtn profile={profile || {}} />
    </>
  );
};

const Title = () => {
  const { history, location } = useRouter();
  const [{ threadList }, dispatch] = useContext(RefetchContext);

  const titleOnClick = useCallback(() => {
    if (location.pathname !== ('/')) {
      history.push('/');
    } else {
      if (window.pageYOffset === 0) {
        if (!threadList) dispatch({ type: 'REFETCH_THREADLIST', status: true });
      }
      try {
        // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        // just a fallback for older browsers
        window.scrollTo(0, 0);
      }
    }
  }, [history, location.pathname]);

  return (
    <Link to="/" title="Home">
      <NavTitle onClick={titleOnClick} />
    </Link>
  );
};

const Navbar = () => {
  const { history } = useRouter();
  console.log('navbar rendered');

  const firstRowRegular = () => (
    <NavWrapper>
      <NavFirstRow>
        <Title />
        <Switch>
          <Route path="/tags" exact render={() => <TickBtn onClick={() => { history.push('/'); }} />} />
          <Route
            path="/"
            render={() => (
              <NavRight>
                <LoginWrapper />
              </NavRight>
            )}
          />
        </Switch>
      </NavFirstRow>
    </NavWrapper>
  );

  const FirstRowComposing = ({ match }) => {
    const { mode } = match.params;
    const [{
      anonymous, title, content, mainTag, subTags, quoteIds, threadId,
    }, dispatch] = useContext(DraftContext);
    const [publishRdy, setPublishRdy] = useState(false);
    const [optionVal, setOptionVal] = useState(anonymous ? 'anonymous' : 'normal');
    const [errInfo, setErrInfo] = useState('');
    const [showError, setShowError] = useState(false);
    const [pubThread, threadState] = useMutation(PUB_THREAD, {
      variables: {
        thread: {
          anonymous, title, content, mainTag, subTags: [...subTags],
        },
      },
    });
    const [pubPost, postState] = useMutation(PUB_POST, {
      variables: {
        post: {
          anonymous, content, quoteIds: [...quoteIds], threadId,
        },
      },
    });

    const handleChange = (e) => {
      setOptionVal(e.target.value);
    };

    useEffect(() => {
      dispatch({
        type: 'SET_ANONYMOUS',
        anonymous: optionVal === 'anonymous',
      });
    }, [dispatch, optionVal]);

    const handleSubmit = useCallback(() => {
      if (mode === 'thread') {
        pubThread();
      }
      if (mode === 'post') {
        pubPost();
      }
    }, [mode, pubPost, pubThread]);

    useEffect(() => {
      if (mode === 'thread') {
        const { data, error, loading } = threadState;
        if (loading) {
          setPublishRdy(false);
        } else {
          if (error) {
            setErrInfo(error.message);
            setShowError(true);
          }
          if (data) {
            setPublishRdy(false);
            dispatch({ type: 'RESET_DRAFT' });
            history.push(`/thread/${data.pubThread.id}`);
          }
        }
      }
    }, [dispatch, mode, threadState]);

    useEffect(() => {
      if (mode === 'post') {
        const { data, error, loading } = postState;
        if (loading) {
          setPublishRdy(false);
        } else {
          if (error) {
            setErrInfo(error.message);
            setShowError(true);
          }
          if (data) {
            setPublishRdy(false);
            dispatch({ type: 'RESET_DRAFT' });
            history.push(`/thread/${threadId}`);
          }
        }
      }
    }, [dispatch, mode, postState, threadId]);

    const checkPublishRdy = useCallback(() => {
      if (mode === 'thread') {
        if (content && mainTag) {
          setPublishRdy(true);
        } else {
          setPublishRdy(false);
        }
      }
      if (mode === 'post') {
        if (quoteIds && content && threadId) {
          setPublishRdy(true);
        } else {
          setPublishRdy(false);
        }
      }
    }, [content, mainTag, mode, quoteIds, threadId]);

    useEffect(() => {
      checkPublishRdy();
    }, [checkPublishRdy]);

    const handleCloseBtn = useCallback(() => {
      dispatch({ type: 'RESET_DRAFT' });
      history.goBack();
    }, [dispatch]);

    return (
      <NavWrapper compose="true">
        {!showError ? (
          <NavFirstRowCompose>
            <CloseBtn onClick={handleCloseBtn}><Cross /></CloseBtn>
            <TitleAndModeWrapper>
              <NavText>{mode === 'thread' ? '发表新帖' : '回复引用'}</NavText>
              <SendModeWrapper>
                <SelectWrapper>
                  <select value={optionVal} onChange={handleChange}>
                    <option value="anonymous">匿名发帖</option>
                    <option value="normal">用户名</option>
                  </select>
                </SelectWrapper>
              </SendModeWrapper>
            </TitleAndModeWrapper>
            <SendBtn
              disabled={!publishRdy}
              onClick={handleSubmit}
            >
              发帖
            </SendBtn>
          </NavFirstRowCompose>
        ) : (
          <NavFirstRowError>
            <CloseBtn isError onClick={() => setShowError(false)}><Cross /></CloseBtn>
            <ErrInfo>{errInfo}</ErrInfo>
          </NavFirstRowError>
        )}
      </NavWrapper>
    );
  };
  FirstRowComposing.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        mode: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  return (
    <Switch>
      <Route path="/draft/:mode" exact component={FirstRowComposing} />
      <Route path={['/', '/tags', '/thread', '/profile']} component={firstRowRegular} />
    </Switch>
  );
};

const PUB_THREAD = gql`
  mutation PubThread($thread: ThreadInput!) {
    pubThread(thread: $thread) {
      id
    }
  }
`;

const PUB_POST = gql`
  mutation PubPost($post: PostInput!) {
    pubPost(post: $post) {
      id
    }
  }
`;

export default Navbar;
