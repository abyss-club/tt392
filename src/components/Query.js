import React from 'react';
import PropTypes from 'prop-types';
import { Query as ApolloQuery } from 'react-apollo';

import { Loading } from 'utils/loading';
import modal from 'utils/modal';

class InQuery extends React.Component {
  constructor(props) {
    super(props);
    const { error } = this.props;
    if (error) {
      modal.open('NOTICE', {
        title: '网络错误',
        message: `请稍后重试 ${error}`,
      });
    }
  }
  render() {
    const {
      loading, error, children, apolloProps, queryProps,
    } = this.props;
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return null;
    }
    return children({ loading, ...apolloProps, ...queryProps });
  }
}
InQuery.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape(),
  children: PropTypes.func.isRequired,
  apolloProps: PropTypes.shape().isRequired,
  queryProps: PropTypes.shape().isRequired,
};
InQuery.defaultProps = {
  error: undefined,
};

const Query = ({ children, ...props }) => (
  <ApolloQuery {...props}>
    {({ loading, error, ...apolloProps }) => (
      <InQuery
        loading={loading}
        error={error}
        apolloProps={apolloProps}
        queryProps={props}
      >
        {children}
      </InQuery>
    )}
  </ApolloQuery>
);
Query.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Query;
