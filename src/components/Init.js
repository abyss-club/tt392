import { useContext, useEffect } from 'react';
import gql from 'graphql-tag';

// import Query from 'components/Query';
import { useQuery } from '@apollo/react-hooks';
import TagsContext from 'providers/Tags';
import LoginContext from 'providers/Login';
import LoadingContext from 'providers/Loading';
import { UNAUTHENTICATED } from 'utils/errorCodes';

const Tags = () => {
  const { loading, data, error } = useQuery(TAGS);
  console.log('render init');
  console.log({ loading, data, error });
  const [, dispatchTags] = useContext(TagsContext);
  const [, dispatchLoading] = useContext(LoadingContext);

  useEffect(() => {
    if (loading) dispatchLoading({ type: 'START_LOADING' });

    if (!loading && !error) {
      const { mainTags, recommended } = data;
      dispatchTags({ type: 'INIT', tags: { mainTags, recommended } });
      dispatchLoading({ type: 'STOP_LOADING' });
    }
  }, [data, dispatchTags, loading, error, dispatchLoading]);

  return null;
};

const Login = () => {
  const [, dispatchLogin] = useContext(LoginContext);
  const [, dispatchTags] = useContext(TagsContext);
  const [, dispatchLoading] = useContext(LoadingContext);
  const { loading, data, error } = useQuery(PROFILE);
  console.log('render login');
  useEffect(() => {
    if (loading) dispatchLoading({ type: 'START_LOADING' });
    if (!loading) {
      if (error && error.graphQLErrors[0].extensions.code === UNAUTHENTICATED) {
        dispatchLogin({ type: 'INIT' });
        dispatchLoading({ type: 'STOP_LOADING' });
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
        dispatchLoading({ type: 'STOP_LOADING' });
      }
    }
  }, [dispatchLogin, dispatchTags, loading, error, data, dispatchLoading]);

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
