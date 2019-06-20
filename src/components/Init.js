import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import Query from 'components/Query';
import Store from 'providers/Store';

const parseTags = (profile, tags) => {
  const subscribedTags = profile.tags || tags.recommended || [];
  const mainTags = new Set(tags.mainTags);
  const subscribed = {
    main: new Set(),
    sub: new Set(),
  };
  subscribedTags.forEach((tag) => {
    if (mainTags.has(tag)) {
      subscribed.main.add(tag);
    } else {
      subscribed.sub.add(tag);
    }
  });
  return { mainTags, subscribed };
};

class Init extends React.Component {
  constructor(props) {
    super(props);
    const { setStore, profile, tags } = this.props;
    setStore({
      initialized: true,
      profile: {
        isSignedIn: (profile.email || '') !== '',
        email: profile.email || '',
        name: profile.name || '',
      },
      tags: parseTags(profile, tags),
    });
  }

  render() {
    return null;
  }
}
Init.propTypes = {
  profile: PropTypes.shape().isRequired,
  tags: PropTypes.shape().isRequired,
  setStore: PropTypes.func.isRequired,
};

const INITIAL = gql`
  query {
    profile {
      name
      email
      tags
    }
    tags {
      mainTags
    }
  }
`;

export default () => (
  <Store.Consumer>
    {({ setStore }) => (
      <Query query={INITIAL}>
        {({ data }) => (
          <Init
            profile={data.profile}
            tags={data.tags}
            setStore={setStore}
          />
        )}
      </Query>
    )}
  </Store.Consumer>
);
