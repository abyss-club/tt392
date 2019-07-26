const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_THREADVIEW_CATALOG': {
      const { catalog } = action;
      return {
        ...state,
        threadView: catalog,
      };
    }
    case 'RESET_CATALOG': {
      return {
        threadView: new Map(),
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
