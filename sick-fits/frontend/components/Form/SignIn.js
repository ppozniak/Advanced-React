import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import styled from 'styled-components';
import { Form, Field, useForm } from '.';
import { CURRENT_USER_QUERY } from '../../hooks/useCurrentUser';
import ErrorMessage from '../ErrorMessage';
import { CART_QUERY } from '../Cart';

const ForgotPasswordLinkContainer = styled.div`
  margin-top: 2rem;
  font-size: 1rem;
`;

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      message
    }
  }
`;

const DEFAULT_FORM_VALUES = {
  email: '',
  password: '',
};

const SignIn = () => {
  const { inputs, setInputs, handleChange } = useForm({
    ...DEFAULT_FORM_VALUES,
  });

  const [signIn, { data: { signIn: { message } = {} } = {}, error, loading }] = useMutation(
    SIGN_IN_MUTATION,
    {
      variables: inputs,
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY,
        },
        {
          query: CART_QUERY,
        },
      ],
    }
  );

  const handleSubmit = async event => {
    event.preventDefault();

    await signIn();
    setInputs({ ...DEFAULT_FORM_VALUES });
  };

  const { email, password } = inputs;

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p>Already a member?</p>
      <fieldset disabled={loading} aria-busy={loading}>
        <Field
          value={email}
          onChange={handleChange}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          value={password}
          onChange={handleChange}
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />

        {error && <ErrorMessage error={error} />}
        {message && <div>{message}</div>}

        <button type="submit">Sign in</button>

        <ForgotPasswordLinkContainer>
          <Link href="reset-password">
            <a>Forgot password?</a>
          </Link>
        </ForgotPasswordLinkContainer>
      </fieldset>
    </Form>
  );
};

export default SignIn;
