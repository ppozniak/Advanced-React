import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import formatMoney from '../../../lib/formatMoney';
import { invalidateItemsCache } from '../../index';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { CART_QUERY } from '../../../components/Cart';
import useAddToCart from '../../../hooks/useAddToCart';
import SickButton from '../../../components/styles/SickButton';

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

const PriceTag = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ToolButton = styled.button`
  display: inline-block;
  height: auto;
  border: 1px solid ${props => props.theme.grey};
  background: none;
  font-size: 1.2rem;
  text-transform: uppercase;
  padding: 1rem;
  cursor: pointer;
  margin-right: 1rem;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Item = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isUserAdmin, isUserCreatorOfItem, currentUser } = useCurrentUser();
  const { addToCart, addingToCart, buttonText } = useAddToCart({ id, currentUser });

  const { loading, error, data } = useQuery(ITEM_QUERY, {
    variables: { id },
  });
  const [deleteItem, { loading: deleting, error: deletingError }] = useMutation(
    DELETE_ITEM_MUTATION,
    {
      variables: { id },
      refetchQueries: [{ query: CART_QUERY }],
      update: invalidateItemsCache,
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
      <p>{description}</p>

      <Footer>
        {(isUserAdmin || isUserCreatorOfItem(data.item)) && (
          <div>
            <Link href="/item/[id]/update" as={`/item/${id}/update`} passHref>
              <ToolButton as="a">Update</ToolButton>
            </Link>

            <ToolButton
              type="button"
              onClick={() =>
                window.confirm('Are you sure you want to delete that item?') && deleteItem()
              }
            >
              {deleting && 'Deleting...'}
              {deletingError && 'Could not delete that item. Try again'}
              {!deleting && !deletingError && 'Delete item. ❌'}
            </ToolButton>
          </div>
        )}

        <div>
          <PriceTag>Price: {formatMoney(price)}</PriceTag>
          <SickButton onClick={addToCart} disabled={addingToCart}>
            {buttonText}
          </SickButton>
        </div>
      </Footer>
    </div>
  );
};

export default Item;
