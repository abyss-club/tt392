import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import gql from 'graphql-tag';

// import Query from 'components/Query';
import { useQuery } from '@apollo/react-hooks';
import TagsContext from 'providers/Tags';
import LoginContext from 'providers/Login';
import { useLoadingBar } from 'styles/Loading';
import { UNAUTHENTICATED, UNKNOWN_ERROR } from 'utils/errorCodes';

const Tags = () => {
  const { loading, data, error } = useQuery(TAGS);
  const [, dispatchTags] = useContext(TagsContext);
  const [, { startLoading, stopLoading }] = useLoadingBar();

  useEffect(() => {
    if (loading) {
      startLoading();
    }
    if (!loading && !error) {
      const { mainTags, recommended } = data;
      dispatchTags({ type: 'INIT', tags: { mainTags, recommended } });
      stopLoading();
    }
  }, [data, loading, error, startLoading, stopLoading, dispatchTags]);
  return null;
};
Tags.whyDidYouRender = true;

const Login = () => {
  const [{ initialized }, dispatchLogin] = useContext(LoginContext);
  const [, dispatchTags] = useContext(TagsContext);
  const [, { startLoading, stopLoading }] = useLoadingBar();
  const [errCode, setErrCode] = useState('');

  const handleOnErr = useCallback((e) => {
    if (e.graphQLErrors) {
      setErrCode(e.graphQLErrors[0].extensions.code);
    } else {
      setErrCode(UNKNOWN_ERROR);
    }
  }, []);
  const { loading, data } = useQuery(PROFILE, { onError: handleOnErr });

  useEffect(() => {
    if (!initialized) {
      if (loading) {
        startLoading();
      }
      if (!loading) {
        if (errCode === UNAUTHENTICATED) {
          dispatchLogin({ type: 'INIT' });
          stopLoading();
        }
        if (data && data.profile) {
          const { profile, mainTags, recommended } = data;
          dispatchLogin({
            type: 'INIT_WITH_LOGIN',
            profile,
          });
          dispatchTags({
            type: 'INIT_WITH_LOGIN',
            profile,
            tags: { mainTags, recommended },
          });
          stopLoading();
        }
      }
    }
  }, [loading, errCode, data, startLoading, stopLoading, dispatchLogin, dispatchTags, initialized]);

  return null;
};
Login.whyDidYouRender = true;

const Init = () => (
  <>
    <Tags />
    <Login />
  </>
);

const PROFILE = gql`
  query {
    profile {
      name
      email
      tags
    }
    mainTags
    recommended
  }
`;

const TAGS = gql`
  query {
    mainTags
    recommended
  }
`;

export default Init;
