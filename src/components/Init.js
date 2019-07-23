import { useContext, useEffect } from 'react';
import gql from 'graphql-tag';

// import Query from 'components/Query';
import { useQuery } from '@apollo/react-hooks';
import TagsContext from 'providers/Tags';
import LoginContext from 'providers/Login';
import { UNAUTHENTICATED } from 'utils/errorCodes';

const Tags = () => {
  const { loading, data, error } = useQuery(TAGS);
  console.log('render init');
  const [, dispatchTags] = useContext(TagsContext);

  useEffect(() => {
    if (!loading && !error) {
      const { mainTags, recommended } = data;
      dispatchTags({ type: 'INIT', tags: { mainTags, recommended } });
    }
  }, [data, dispatchTags, loading, error]);
  // [dispatchTags, loading, error, data] data] data]would cause infinite rerender in apollo hooks beta

  return null;
};

const Login = () => {
  const [, dispatchLogin] = useContext(LoginContext);
  const [, dispatchTags] = useContext(TagsContext);
  const { loading, data, error } = useQuery(PROFILE);
  console.log('render login');
  useEffect(() => {
    if (!loading) {
      if (error && error.graphQLErrors[0].extensions.code === UNAUTHENTICATED) {
        dispatchLogin({ type: 'INIT' });
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
      }
    }
  }, [dispatchLogin, dispatchTags, loading, error, data]);
  // TODO: adding data to dep list would cause infinite rerender in apollo hooks beta

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
