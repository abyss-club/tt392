const reducer = (state, action) => {
  switch (action.type) {
    case 'PUBLISH_RDY': {
      const { publishRdy } = action;
      return {
        ...state,
        publishRdy,
      };
    }

    case 'SET_ANONYMOUS': {
      const { anonymous } = action;
      return {
        ...state,
        anonymous,
      };
    }

    case 'SET_TITLE': {
      const { title } = action;
      return {
        ...state,
        title,
      };
    }

    case 'SET_MAINTAG': {
      const { mainTag } = action;
      return {
        ...state,
        mainTag,
      };
    }

    case 'SET_SUBTAGS': {
      const { subTags } = action;
      return {
        ...state,
        subTags,
      };
    }

    case 'SET_CONTENT': {
      const { content } = action;
      return {
        ...state,
        content,
      };
    }

    case 'SET_QUOTEDIDS': {
      const { quoteIds } = action;
      return {
        ...state,
        quoteIds,
      };
    }

    case 'REMOVE_QUOTEID': {
      const { quoteId } = action;
      const prevQuotedIds = new Set(state.quoteIds);
      prevQuotedIds.delete(quoteId);
      return {
        ...state,
        quoteIds: prevQuotedIds,
      };
    }

    case 'SET_THREADID': {
      const { threadId } = action;
      return {
        ...state,
        threadId,
      };
    }

    case 'RESET_DRAFT': {
      return {
        anonymous: true,
        title: '',
        content: '',
        mainTag: '',
        subTags: new Set(),
        quoteIds: new Set(),
        threadId: '',
      };
    }

    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
