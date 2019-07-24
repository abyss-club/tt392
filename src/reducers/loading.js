const reducer = (state, action) => {
  switch (action.type) {
    case 'START_LOADING': {
      return {
        ...state,
        show: state.show + 1,
      };
    }
    case 'STOP_LOADING': {
      return {
        ...state,
        show: state.show - 1,
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
