import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import { Form, Field, useForm } from '../components/Form';
import ErrorMessage from '../components/ErrorMessage';
import LogInGuard from '../components/LogInGuard';
import { ALL_ITEMS_QUERY, ITEMS_PER_PAGE } from '.';

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

const SellPage = () => {
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
    variables: { ...inputs, price: parseFloat(inputs.price) * 100 },
    refetchQueries: [{ query: ALL_ITEMS_QUERY, variables: { first: ITEMS_PER_PAGE, skip: 0 } }], // Refresh only first page, as new items are on the first page
  });

  // @TODO: Refactor this to be have more error handling
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
    // @TODO: Clear also the image
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
    <LogInGuard>
      <Form autoComplete="off" onSubmit={event => handleSubmit(event, createItem)}>
        <h2>Add new item</h2>
        <fieldset disabled={loading} aria-busy={loading}>
          <Field value={title} onChange={handleChange} name="title" required />
          <Field value={description} onChange={handleChange} name="description" required />
          <Field
            value={price}
            onChange={handleChange}
            name="price"
            type="text"
            inputMode="decimal"
            pattern="[0-9]+([\.,][0-9]+)?"
            required
          />
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
          {error && <ErrorMessage error={error} />}

          <button type="submit">Submit</button>
        </fieldset>
      </Form>
    </LogInGuard>
  );
};

export default SellPage;
