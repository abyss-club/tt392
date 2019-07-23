const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ID': {
      const { id } = action;
      return {
        ...state,
        active: true,
        id,
      };
    }
    case 'RESET': {
      return {
        ...state,
        active: false,
        id: '',
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
