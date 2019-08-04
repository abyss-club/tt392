import { useContext } from 'react';
import { useRouter } from 'utils/routerHooks';
import LoginContext from 'providers/Login';

const RequireSignIn = () => {
  const { history } = useRouter();
  const [{ profile }] = useContext(LoginContext);
  if (profile.initialized && !profile.isSignedIn) history.replace('/sign_in');
  return null;
};

export default RequireSignIn;
