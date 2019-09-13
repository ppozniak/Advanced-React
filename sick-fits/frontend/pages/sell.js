import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import Form from '../components/styles/Form';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION($title: String!, $description: String!, $price: Int!) {
    createItem(data: { title: $title, description: $description, price: $price }) {
      id
    }
  }
`;

const useForm = (defaultState = {}) => {
  const [inputs, setInputs] = useState(defaultState);

  const handleChange = ({ target: { name, value, type } }) => {
    setInputs({ ...inputs, [name]: type === 'Number' ? parseFloat(value) : value });
  };

  return { inputs, handleChange, setInputs };
};

const Field = ({ name, type = 'text', onChange = () => {}, value }) => (
  <label htmlFor={name}>
    {name.toUpperCase()}
    <input onChange={onChange} type={type} id={name} name={name} value={value} />
  </label>
);

const Sell = () => {
  const { inputs, setInputs, handleChange } = useForm({
    title: '',
    description: '',
    price: 0,
  });

  const [
    createItem,
    { data: { createItem: { id: newItemId } = {} } = {}, error, loading },
  ] = useMutation(CREATE_ITEM_MUTATION, {
    variables: inputs,
  });

  const handleSubmit = async (event, createItem) => {
    event.preventDefault();

    await createItem();
    setInputs({
      title: '',
      description: '',
      price: 0,
    });
  };

  const { title, description, price } = inputs;

  return (
    <Form autoComplete="off" onSubmit={event => handleSubmit(event, createItem)}>
      <h2>Add new item</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <Field value={title} onChange={handleChange} name="title" />
        <Field value={description} onChange={handleChange} name="description" />
        <Field value={price} onChange={handleChange} name="price" type="number" />

        {newItemId && (
          <div>
            <p>New item {newItemId} successfully created!</p>
            <p>
              View it{' '}
              <Link href="/item/[id]" as={`/item/${newItemId}`}>
                <a>here</a>
              </Link>
            </p>
          </div>
        )}
        {error && <div>{error.message}</div>}

        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
};

export default Sell;
