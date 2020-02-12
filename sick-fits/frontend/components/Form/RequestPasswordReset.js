import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Form, Field, useForm } from '.';
import ErrorMessage from '../ErrorMessage';

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation REQUEST_PASSWORD_RESET_MUTATION($email: String!) {
    requestPasswordReset(email: $email) {
      message
    }
  }
`;

const DEFAULT_FORM_VALUES = {
  email: '',
};

const RequestPasswordRequest = () => {
  const { inputs, setInputs, handleChange } = useForm({
    ...DEFAULT_FORM_VALUES,
  });

  const [
    requestPasswordReset,
    { data: { requestPasswordReset: { message } = {} } = {}, error, loading },
  ] = useMutation(REQUEST_PASSWORD_RESET_MUTATION, {
    variables: inputs,
  });

  const handleSubmit = async event => {
    event.preventDefault();

    await requestPasswordReset();
    setInputs({ ...DEFAULT_FORM_VALUES });
  };

  const { email } = inputs;

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <h2>Reset password</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <p>
          Forgot your password? No worries. Input your email and we'll send you an email with
          further instructions.
        </p>
        <Field
          value={email}
          onChange={handleChange}
          name="email"
          type="email"
          autoComplete="email"
          required
        />

        {error && <ErrorMessage error={error} />}
        {message && <div>{message}</div>}

        <button type="submit">Request password change</button>
      </fieldset>
    </Form>
  );
};

export default RequestPasswordRequest;
