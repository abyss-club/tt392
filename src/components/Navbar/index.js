import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Store from 'providers/Store';
import MainContent from 'styles/MainContent';

import NavTags from './NavTags';
import SignInBtn from './SignInBtn';

const Wrapper = styled.div`
  width: 100%;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const NavWrapper = styled.nav`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const NavFirstRow = styled.div`
  height: 3rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  > a {
    text-decoration: none;
    color: black;
  }
`;

const NavTitle = styled.div`
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight: 700;
  font-size: 2em;
  line-height: 3rem;
  transform: translateY(-0.25rem);
`;

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

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    const { setStore, profile, tags } = this.props;
    setStore({
      profile: {
        isSignedIn: (profile.email || '') !== '',
        email: profile.email,
      },
      tags: parseTags(profile, tags),
    });
  }

  render() {
    const { profile } = this.props;
    return (
      <Wrapper>
        <MainContent>
          <NavWrapper>
            <NavFirstRow>
              <Link to="/">
                <NavTitle>abyss</NavTitle>
              </Link>
              <SignInBtn profile={profile || {}} />
            </NavFirstRow>
            <Route path="/" exact component={NavTags} />
          </NavWrapper>
        </MainContent>
      </Wrapper>
    );
  }
}
Navbar.propTypes = {
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
      recommended
    }
  }
`;

export default () => (
  <Store.Consumer>
    {({ setStore }) => (
      <Query query={INITIAL}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>error...</p>;
          return (
            <Navbar
              profile={data.profile}
              tags={data.tags}
              setStore={setStore}
            />
          );
        }}
      </Query>
    )}
  </Store.Consumer>
);
