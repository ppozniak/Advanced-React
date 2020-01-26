import React from 'react';
import styled from 'styled-components';
import SignUpForm from '../components/Form/SignUp';
import SignInForm from '../components/Form/SignIn';

const SignUpWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 10%;
`;

const SignUpPage = () => (
  <SignUpWrapper>
    <SignInForm />
    <SignUpForm />
  </SignUpWrapper>
);

export default SignUpPage;
