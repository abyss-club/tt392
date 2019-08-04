import React, {
  createContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';

const TagsContext = createContext({});

const initialState = {
  tags: {
    mainTags: new Set(),
    subTags: new Set(),
    subscribed: {
      main: new Set(),
      sub: new Set(),
    },
  },
};

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
    case 'UPDATE_SUBSCRIBED_TAGS': {
      const { profile } = action;
      return {
        ...state,
        tags: {
          ...state.tags,
          subscribed: parseTags({ profile, tags: state.tags }).subscribed,
        },
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

const TagsProvider = ({ children }) => (
  <TagsContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </TagsContext.Provider>
);
TagsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TagsContext;
export { TagsProvider };
