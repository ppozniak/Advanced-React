import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import RequestPasswordRequestForm from '../components/Form/RequestPasswordReset';
import ResetPasswordForm from '../components/Form/ResetPassword';

const SingleFormWrapper = styled.div`
  max-width: 650px;
  margin: 0 auto;
`;

const ResetPasswordPage = () => {
  const {
    query: { resetToken, email },
  } = useRouter();

  return (
    <SingleFormWrapper>
      {resetToken && email ? (
        <ResetPasswordForm resetToken={resetToken} email={email} />
      ) : (
        <RequestPasswordRequestForm />
      )}
    </SingleFormWrapper>
  );
};

export default ResetPasswordPage;
