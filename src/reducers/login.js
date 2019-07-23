const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        initialized: true,
        profile: {
          isSignedIn: false,
          email: '',
          name: '',
        },
      };
    }
    case 'INIT_WITH_LOGIN': {
      const { profile } = action;
      return {
        ...state,
        initialized: true,
        profile: {
          isSignedIn: (profile.email || '') !== '',
          email: profile.email || '',
          name: profile.name || '',
        },
      };
    }
    case 'SET_NAME': {
      const { name } = action;
      return {
        ...state,
        profile: {
          ...state.profile,
          name,
        },
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
