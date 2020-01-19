import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Form, Field, useForm } from '../components/Form';

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
  const { inputs, setInputs, handleChange } = useForm({ ...DEFAULT_FORM_VALUES });

  const [
    signUp,
    { data: { signUp: { name: newUserName } = {} } = {}, error, loading },
  ] = useMutation(CREATE_USER_MUTATION, {
    variables: inputs,
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

        {error && <div>{error.message}</div>}
        {newUserName && <div>Account for {newUserName} has been created!</div>}

        <button type="submit">Sign up</button>
      </fieldset>
    </Form>
  );
};

export default SignUp;
