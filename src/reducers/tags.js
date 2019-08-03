const parseTags = ({ profile = {}, tags }) => {
  const mainTags = new Set(tags.mainTags);
  const subTags = new Set();
  const subscribed = {
    main: new Set(),
    sub: new Set(),
  };
  const subscribedTags = profile.tags || tags.recommended || mainTags;
  subscribedTags.forEach((tag) => {
    if (mainTags.has(tag)) {
      subscribed.main.add(tag);
    } else {
      subscribed.sub.add(tag);
    }
  });
  return { mainTags, subTags, subscribed };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { tags } = action;
      return {
        ...state,
        tags: parseTags({ tags }),
      };
    }
    case 'INIT_WITH_LOGIN': {
      const { profile, tags } = action;
      return {
        ...state,
        tags: parseTags({ profile, tags }),
      };
    }
    case 'ADD_TAG': {
      const { tag, isMain } = action;
      const newSubscribed = { ...state.tags.subscribed };
      if (isMain) newSubscribed.main.add(tag);
      else newSubscribed.sub.add(tag);
      return {
        ...state,
        tags: {
          ...state.tags,
          subscribed: newSubscribed,
        },
      };
    }
    case 'DEL_TAG': {
      const { tag, isMain } = action;
      const newSubscribed = { ...state.tags.subscribed };
      if (isMain) newSubscribed.main.delete(tag);
      else newSubscribed.sub.delete(tag);
      return {
        ...state,
        tags: {
          ...state.tags,
          subscribed: newSubscribed,
        },
      };
    }
    default:
      throw new Error('Invalid action type.');
  }
};

export default reducer;
