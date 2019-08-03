import React from 'react';
import PropTypes from 'prop-types';
import {
  FORBIDDEN, NOT_FOUND, INTERNAL_ERROR, PARAMS_ERROR,
} from 'utils/errorCodes';
import MainContent from 'styles/MainContent';

const ErrorPage = ({ match }) => {
  const errCode = match.params.errCode || 'NOT_FOUND';
  const errMsgList = {
    [FORBIDDEN]: 'You are not allowed to access the content.',
    [NOT_FOUND]: 'Requested content not found.',
    [INTERNAL_ERROR]: 'We screwed up.',
    [PARAMS_ERROR]: 'Server screwed up.',
    UNKNOWN_ERROR: 'Unknown error occured.',
    NETWORK_ERROR: 'Remote server unreachable.',
  };
  return (
    <MainContent>
      <p>
        Error occured:
        {' '}
        {errMsgList[errCode]}
      </p>
    </MainContent>
  );
};
ErrorPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      errCode: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ErrorPage;
