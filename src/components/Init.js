import { useContext, useEffect, useState, useCallback } from 'react';
import gql from 'graphql-tag';

// import Query from 'components/Query';
import { useQuery } from '@apollo/react-hooks';
import TagsContext from 'providers/Tags';
import LoginContext from 'providers/Login';
import { useLoadingBar } from 'styles/Loading';
import { UNAUTHENTICATED } from 'utils/errorCodes';

const Tags = () => {
  const { loading, data, error } = useQuery(TAGS);
  console.log('render init');
  const [, dispatchTags] = useContext(TagsContext);
  const [, { startLoading, stopLoading }] = useLoadingBar();

  useEffect(() => {
    if (loading) startLoading();

    if (!loading && !error) {
      const { mainTags, recommended } = data;
      dispatchTags({ type: 'INIT', tags: { mainTags, recommended } });
      stopLoading();
    }
  }, [data, dispatchTags, loading, error, startLoading, stopLoading]);
  return null;
};

const Login = () => {
  const [, dispatchLogin] = useContext(LoginContext);
  const [, dispatchTags] = useContext(TagsContext);
  const [, { startLoading, stopLoading }] = useLoadingBar();
  const [errCode, setErrCode] = useState('');

  const handleOnErr = useCallback((e) => {
    setErrCode(e.graphQLErrors[0].extensions.code);
  }, []);
  const { loading, data } = useQuery(PROFILE, { onError: handleOnErr });

  console.log('render login');
  useEffect(() => {
    if (loading) startLoading();
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
  }, [dispatchLogin, dispatchTags, loading, errCode, data, startLoading, stopLoading]);

  return null;
};

const Init = () => {
  Tags();
  Login();
  return null;
};

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
