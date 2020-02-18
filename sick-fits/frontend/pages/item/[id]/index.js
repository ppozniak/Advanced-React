import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import formatMoney from '../../../lib/formatMoney';
import { ALL_ITEMS_QUERY } from '../../index';
import useCurrentUser from '../../../components/useCurrentUser';

export const ITEM_QUERY = gql`
  query ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
      largeImage
      user {
        id
      }
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(where: { id: $id }) {
      id
    }
  }
`;

const Thumbnail = styled.img`
  border: 10px solid #ffffff55;
  box-shadow: 3px 3px 12px #ffffff55;
`;

const CoverPhoto = styled.div`
display: flex;
justify-content: flex-start;
align-items: flex-end;
  padding: 2rem;
  background: url("${p => p.src}") no-repeat;
  height: 200px;
`;

const Item = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isUserAdmin, isUserCreatorOfItem } = useCurrentUser();

  const { loading, error, data } = useQuery(ITEM_QUERY, {
    variables: { id },
  });
  const [deleteItem, { loading: deleting, error: deletingError }] = useMutation(
    DELETE_ITEM_MUTATION,
    {
      variables: { id },
      update: (
        cache,
        {
          data: {
            deleteItem: { id: deletedItemId },
          },
        }
      ) => {
        const { items } = cache.readQuery({ query: ALL_ITEMS_QUERY });

        cache.writeQuery({
          query: ALL_ITEMS_QUERY,
          data: {
            items: items.filter(({ id }) => id !== deletedItemId),
          },
        });
      },
      onCompleted: () => {
        router.replace('/');
      },
    }
  );

  if (loading) return 'Loading item';
  if (error) return 'Error when loading an item. Try again.';
  if (!data.item) return 'No item found!';

  const { title, image, largeImage, description, price } = data.item;
  return (
    <div>
      <Head>
        <title>{title} | Ink Link</title>
      </Head>
      {largeImage && (
        <CoverPhoto src={largeImage}>{image && <Thumbnail src={image} alt="" />}</CoverPhoto>
      )}
      <h1>{title}</h1>
      <em>{id}</em>
      <p>{description}</p>
      <p>Price: {formatMoney(price)}</p>

      {(isUserAdmin || isUserCreatorOfItem(data.item)) && (
        <>
          <div>
            <Link href="/item/[id]/update" as={`/item/${id}/update`}>
              <a>Update</a>
            </Link>
          </div>

          <button
            type="button"
            onClick={() =>
              window.confirm('Are you sure you want to delete that item?') && deleteItem()
            }
          >
            <div>
              {deleting && 'Deleting...'}
              {deletingError && 'Could not delete that item. Try again'}
              {!deleting && !deletingError && 'Delete item. ❌'}
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default Item;
