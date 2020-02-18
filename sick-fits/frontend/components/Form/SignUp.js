import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Form, Field, useForm } from '.';
import ErrorMessage from '../ErrorMessage';
import { CURRENT_USER_QUERY } from '../useCurrentUser';

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION($email: String!, $name: String!, $password: String!) {
    signUp(email: $email, name: $name, password: $password) {
      id
      name
      email
    }
  }
`;

const DEFAULT_FORM_VALUES = {
  email: '',
  name: '',
  password: '',
};

const SignUp = () => {
  const { inputs, setInputs, handleChange } = useForm({
    ...DEFAULT_FORM_VALUES,
  });

  const [
    signUp,
    { data: { signUp: { name: newUserName } = {} } = {}, error, loading },
  ] = useMutation(CREATE_USER_MUTATION, {
    variables: inputs,
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY,
      },
    ],
  });

  const handleSubmit = async event => {
    event.preventDefault();

    await signUp();
    setInputs({ ...DEFAULT_FORM_VALUES });
  };

  const { email, name, password } = inputs;

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <p>Create new account</p>
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
          value={name}
          onChange={handleChange}
          name="name"
          type="text"
          autoComplete="given-name"
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
        {newUserName && (
          <div>
            {newUserName}, welcome! <br />
            Your account has been successfully created and now you're logged in.
          </div>
        )}

        <button type="submit">Sign up</button>
      </fieldset>
    </Form>
  );
};

export default SignUp;
