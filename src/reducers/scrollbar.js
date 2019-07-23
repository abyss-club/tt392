const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_POST_LOC_IN_THREAD': {
      const { postId, createdAt } = action;
      return {
        ...state,
        threadView: {
          postId,
          createdAt,
        },
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
