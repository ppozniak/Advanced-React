import React from 'react';
import styled from 'styled-components';
import RequestPasswordRequestForm from '../components/Form/RequestPasswordReset';

const SingleFormWrapper = styled.div`
  max-width: 650px;
  margin: 0 auto;
`;

const ResetPasswordPage = () => (
  <SingleFormWrapper>
    <RequestPasswordRequestForm />
  </SingleFormWrapper>
);

export default ResetPasswordPage;
