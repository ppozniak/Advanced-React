import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import currency from 'currency.js';
import { ITEM_QUERY } from './index';
import { Form, Field, useForm } from '../../../components/Form';
import LogInGuard from '../../../components/LogInGuard';
import useCurrentUser from '../../../components/useCurrentUser';
import { invalidateItemsCache } from '../../index';

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
  const { inputs, setInputs, handleChange } = useForm({
    title: '',
    description: '',
    price: 0,
    image: '',
    largeImage: '',
  });

  // Hooks
  const {
    replace,
    query: { id },
  } = useRouter();
  const { loading, data, error } = useQuery(ITEM_QUERY, {
    variables: { id },
    onCompleted: () => {
      setInputs({
        ...data.item,
        price: currency(data.item.price / 100),
      });
    },
  });
  const [updateItem, { loading: updating, error: updateError }] = useMutation(
    UPDATE_ITEM_MUTATION,
    {
      variables: {
        ...inputs,
        price: currency(inputs.price).intValue,
        id,
      },
      update: invalidateItemsCache,
      onCompleted: () => {
        replace('/item/[id]', `/item/${id}`);
      },
    }
  );

  const { isUserAdmin, isUserCreatorOfItem } = useCurrentUser();

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
    <LogInGuard>
      {((isUserAdmin || isUserCreatorOfItem(data.item)) && (
        <Form autoComplete="off" onSubmit={event => handleSubmit(event, updateItem)}>
          <h2>Update item</h2>
          <h3>Item ID: {data.item.id}</h3>
          <fieldset disabled={updating} aria-busy={updating}>
            <Field onChange={handleChange} name="title" value={inputs.title} />
            <Field onChange={handleChange} name="description" value={inputs.description} />
            <Field
              onChange={handleChange}
              name="price"
              value={inputs.price}
              inputMode="decimal"
              pattern="[0-9]{1,7}([\.][0-9]{0,2})?"
              label="Price (£)"
            />

            {/* @TODO: deal with image later */}
            {/* <Field onChange={handleChange} name="image" type="file" /> */}
            {updateError && <div>{updateError.message}</div>}

            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )) ||
        'You have no rights to update this item.'}
    </LogInGuard>
  );
};

export default Update;
