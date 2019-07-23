const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTI_COUNT': {
      const { system, replied, quoted } = action;
      return {
        ...state,
        unreadNotiCount: {
          system: system || 0,
          replied: replied || 0,
          quoted: quoted || 0,
        },
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
