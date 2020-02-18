import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Form, Field, useForm } from '.';
import ErrorMessage from '../ErrorMessage';
import { CURRENT_USER_QUERY } from '../useCurrentUser';

const PASSWORD_RESET_MUTATION = gql`
  mutation PASSWORD_RESET_MUTATION(
    $password: String!
    $confirmPassword: String!
    $email: String!
    $resetToken: String!
  ) {
    resetPassword(
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      resetToken: $resetToken
    ) {
      name
    }
  }
`;

const DEFAULT_FORM_VALUES = {
  password: '',
  confirmPassword: '',
};

const PasswordRequest = ({ resetToken, email }) => {
  const { inputs, setInputs, handleChange } = useForm({
    ...DEFAULT_FORM_VALUES,
  });

  // @TODO: Show some message
  const [resetPassword, { error, loading }] = useMutation(PASSWORD_RESET_MUTATION, {
    variables: { resetToken, email, ...inputs },
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY,
      },
    ],
  });

  const handleSubmit = async event => {
    event.preventDefault();

    await resetPassword();
    setInputs({ ...DEFAULT_FORM_VALUES });
  };

  const { password, confirmPassword } = inputs;

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <h2>Enter your new password</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <Field
          value={password}
          onChange={handleChange}
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <Field
          value={confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          required
        />

        {error && <ErrorMessage error={error} />}
        {/* {message && <div>{message}</div>} */}

        <button type="submit">Reset password</button>
      </fieldset>
    </Form>
  );
};

export default PasswordRequest;
