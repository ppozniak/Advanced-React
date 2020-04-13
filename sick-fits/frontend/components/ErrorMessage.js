import styled from 'styled-components';
import React from 'react';

import PropTypes from 'prop-types';

const ErrorStyles = styled.div`
  padding: 2rem;
  background: white;
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid red;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

const DisplayError = ({ error }) => {
  if (!error) return null;

  // Multiple graphql errors
  if (error.networkError && error.networkError.result && error.networkError.result.errors.length) {
    return error.networkError.result.errors.map((error, i) => (
      <ErrorStyles key={i}>
        <p data-test="graphql-error">{error.message.replace('GraphQL error: ', '')}</p>
      </ErrorStyles>
    ));
  }
  if (error.message) {
    return (
      <ErrorStyles>
        <p data-test="graphql-error">{error.message.replace('GraphQL error: ', '')}</p>
      </ErrorStyles>
    );
  }
  if (typeof error === 'string') {
    return (
      <ErrorStyles>
        <p>{error}</p>
      </ErrorStyles>
    );
  }
};

DisplayError.defaultProps = {
  error: {},
};

DisplayError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DisplayError;
