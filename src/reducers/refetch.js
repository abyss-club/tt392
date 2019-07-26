const reducer = (state, action) => {
  switch (action.type) {
    case 'REFETCH_THREADLIST': {
      const { status } = action;
      return {
        ...state,
        threadList: !!status,
      };
    }
    case 'REFETCH_THREAD': {
      const { status } = action;
      return {
        ...state,
        thread: !!status,
      };
    }

    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
