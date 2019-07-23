const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SLIDER': {
      const { loc, max } = action;
      return {
        ...state,
        loc,
        max,
      };
    }
    case 'SET_SLIDER_LOC': {
      const { loc } = action;
      return {
        ...state,
        loc,
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
