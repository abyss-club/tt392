import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from 'styled-components';
import colors from 'utils/colors';

import LoginContext from 'providers/Login';
import MainContent, { maxWidth } from 'styles/MainContent';

const SET_NAME = gql`
  mutation SetName($name: String!) {
    setName(name: $name) {
      name
    }
  }
`;

const NameForm = styled.form`
  margin: 0 auto;
`;

const NameInput = styled.input`
  font-size: .75em;
  width: 100%;
  height: 2rem;
  padding: 0.5rem 1rem;
  margin: 0 0 .75rem;
  border: none;
  border-radius: 1.5rem;
  background-color: ${colors.mainBg};

  ::placeholder {
    color: ${colors.regularGrey};
  }
`;

const BtnWrapper = styled.div`
  margin: 0 auto;
`;

const SubmitBtn = styled.button`
  font-size: .6875em;
  width: 100%;
  height: 2rem;
  background-color: ${colors.accentGreen};
  color: white;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;

  :disabled {
    background-color: ${colors.buttonBgDisabled};
  }
`;

const UpperArea = styled.div`
  /* hack */
  margin: 0 auto;
  max-width: ${maxWidth}em;

  display: flex;
  flex-flow: row wrap;
  background-color: white;

`;

const NameRow = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 1rem;
  margin: .75rem 0 1.8rem;
`;

const TitleText = styled.h4`
  width: 100%;
  height: 3.5rem;

  font-weight: 600;
  font-size: 1.125em;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SetNameBtn = styled.button`
  color: white;
  appearance: none;
  border: none;
  border-radius: 2rem;
  background-color: ${colors.buttonBg};
  cursor: pointer;
  padding: 0 1rem;
  margin: 0 0 0 auto;
  height: 2rem;

  font-size: .6875em;

  :disabled {
    background-color: ${colors.buttonBgDisabled};
  }
`;

const ErrInfo = styled.p`
  width: 100%;
  color: white;
`;

const Profile = () => {
  const [{ profile }, dispatch] = useContext(LoginContext);
  const [inputName, setInputName] = useState('');
  const [status, setStatus] = useState('INIT');
  const [errInfo, setErrInfo] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const [setName, { error, loading, data }] = useMutation(SET_NAME,
    { variables: { name: inputName } });

  // console.log({ error, loading, data });

  const handleChange = useCallback((e) => {
    setInputName(e.target.value);
  }, []);

  const dispatchSetName = useCallback((name) => {
    dispatch({
      type: 'SET_NAME',
      name,
    });
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    setName();
  };

  useEffect(() => {
    if (!loading) {
      if (data && data.setName.name) {
        setDisabled(true);
        dispatchSetName(data.setName.name);
      } else if (error) {
        setStatus('ERROR');
        setErrInfo(error.message);
        setDisabled(false);
      }
    } else {
      setStatus('LOADING');
    }
  }, [data, loading, error, setStatus, setDisabled, dispatchSetName]);

  useEffect(() => {
    if (profile.name) {
      setStatus('COMPLETE');
    }
  }, [profile]);

  const firstRow = (
    <NameRow>
      {showInput ? (
        <NameForm autoComplete="off" onSubmit={handleSubmit}>
          <NameInput autoComplete="false" spellCheck="false" autoCapitalize="none" type="text" name="name" placeholder="用户名" onChange={handleChange} disabled={status === 'LOADING'} />
          <SubmitBtn type="submit" title="提交" disabled={!inputName || disabled}>确认（之后不能修改)</SubmitBtn>
        </NameForm>
      ) : (
        <BtnWrapper>
          <SetNameBtn onClick={() => { setShowInput(true); }}>设置用户名</SetNameBtn>
        </BtnWrapper>
      ) }
    </NameRow>
  );

  const firstRowWithName = (
    <NameRow>
      <TitleText>{ profile.name }</TitleText>
    </NameRow>
  );

  return (
    <UpperArea>
      <TitleText>个人中心</TitleText>
      {(status === 'COMPLETE' ? firstRowWithName : firstRow)}
      {(status === 'ERROR') && (
        <ErrInfo>
          错误：
          {errInfo}
        </ErrInfo>
      )}
    </UpperArea>
  );
};

export default Profile;
