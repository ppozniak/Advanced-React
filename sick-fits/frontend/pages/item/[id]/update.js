import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { ITEM_QUERY } from './index';
import { Form, Field, useForm } from '../../../components/Form';

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $title: String
    $description: String
    $price: Int
    $image: String
    $largeImage: String
    $id: ID!
  ) {
    updateItem(
      data: {
        title: $title
        description: $description
        price: $price
        image: $image
        largeImage: $largeImage
      }
      where: { id: $id }
    ) {
      id
      description
      price
      image
      largeImage
    }
  }
`;

const Update = () => {
  // Form
  const { inputs, setInputs, handleChange } = useForm({});

  // Hooks
  const {
    replace,
    query: { id },
  } = useRouter();
  const { loading, data, error } = useQuery(ITEM_QUERY, { variables: { id } });
  const [updateItem, { loading: updating, error: updateError }] = useMutation(
    UPDATE_ITEM_MUTATION,
    {
      variables: {
        ...inputs,
        id,
      },
      onCompleted: () => {
        replace('/item/[id]', `/item/${id}`);
      },
    }
  );
  // @TODO: Update cache

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error {error.message}</div>;

  // // @TODO: Refactor this to be less error prone
  const handleSubmit = async event => {
    event.preventDefault();

    await updateItem();
    setInputs({
      title: '',
      description: '',
      price: 0,
      image: '',
      largeImage: '',
    });
  };

  return (
    <Form autoComplete="off" onSubmit={event => handleSubmit(event, updateItem)}>
      <h2>Add new item</h2>
      <fieldset disabled={updating} aria-busy={updating}>
        <Field onChange={handleChange} name="title" defaultValue={data.item.title} />
        <Field onChange={handleChange} name="description" defaultValue={data.item.description} />
        <Field onChange={handleChange} name="price" type="number" defaultValue={data.item.price} />

        {/* @TODO: deal with image later */}
        {/* <Field onChange={handleChange} name="image" type="file" /> */}
        {updateError && <div>{updateError.message}</div>}

        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
};

export default Update;
