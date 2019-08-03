import React, {
  useEffect, useContext,
} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { QuotedInDraft } from 'components/QuotedContent';
import { useRouter } from 'utils/routerHooks';
import { useQuery } from '@apollo/react-hooks';
import DraftContext from 'providers/Draft';

const QuotedWrapper = styled.div`
  margin-top: .5em;
  width: 100%;
`;

const QuotedContentWrapper = styled.div`
  margin: .5em 0;
`;

const QuotedPost = ({ id }) => {
  const [, dispatch] = useContext(DraftContext);
  const { loading, data, error } = useQuery(QUERY_REFERS, { variables: { id } });
  useEffect(() => {
    let didCancel = false;
    if (!loading && error && !didCancel) {
      dispatch({
        type: 'REMOVE_QUOTEID',
        quoteId: id,
      });
    }
    return () => {
      didCancel = true;
    };
  }, [id, loading, error, dispatch]);

  return loading ? (<p>Loading...</p>) : (!error) && (
    <QuotedInDraft quote={data.post} />
  );
};
QuotedPost.propTypes = {
  id: PropTypes.string.isRequired,
};

const PostSettings = () => {
  const { location } = useRouter();
  const [{ quoteIds }, dispatch] = useContext(DraftContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    dispatch({
      type: 'SET_QUOTEDIDS',
      quoteIds: new Set(params.getAll('p')),
    });
    dispatch({
      type: 'SET_THREADID',
      threadId: params.get('reply'),
    });
  }, [dispatch, location.search]);

  return (
    <QuotedWrapper>
      <QuotedContentWrapper>
        {(quoteIds.size > 0) && [...quoteIds].map(quoteId => (
          <QuotedPost key={quoteId} id={quoteId} />
        ))}
      </QuotedContentWrapper>
    </QuotedWrapper>
  );
};
const QUERY_REFERS = gql`
  query Post($id: String!) {
    post(id: $id) {
      id, author, anonymous, content, createdAt
    }
  }
`;

export default PostSettings;
