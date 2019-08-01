const reducer = (state, action) => {
  switch (action.type) {
    case 'REFETCH_THREADLIST': {
      const { status } = action;
      if (!!status === state.threadList) return state;
      return {
        ...state,
        threadList: !!status,
      };
    }
    case 'REFETCH_THREAD': {
      const { status } = action;
      if (!!status === state.thread) return state;
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
