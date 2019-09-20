import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import { Form, Field, useForm } from '../components/Form';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      data: {
        title: $title
        description: $description
        price: $price
        image: $image
        largeImage: $largeImage
      }
    ) {
      id
    }
  }
`;

const Sell = () => {
  const { inputs, setInputs, handleChange } = useForm({
    title: '',
    description: '',
    price: 0,
    image: '',
    largeImage: '',
  });

  const [
    createItem,
    { data: { createItem: { id: newItemId } = {} } = {}, error, loading },
  ] = useMutation(CREATE_ITEM_MUTATION, {
    variables: inputs,
  });

  // @TODO: Refactor this to be less error prone
  const handleSubmit = async event => {
    event.preventDefault();

    if (inputs.image) {
      const formData = new FormData();
      formData.append('file', inputs.image);
      formData.append('upload_preset', 'ink-link');

      const response = await fetch('https://api.cloudinary.com/v1_1/ppozniak/image/upload', {
        body: formData,
        method: 'POST',
      });

      const data = await response.json();
      const image = data.secure_url;
      const largeImage = data.eager[0].secure_url;

      setInputs({ ...inputs, image, largeImage });
    }

    await createItem();
    setInputs({
      title: '',
      description: '',
      price: 0,
      image: '',
      largeImage: '',
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
        <Field onChange={handleChange} name="image" type="file" />

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
