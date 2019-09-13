import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import formatMoney from '../../lib/formatMoney';

const ITEM_QUERY = gql`
  query ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
      largeImage
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

  const { loading, error, data } = useQuery(ITEM_QUERY, {
    variables: { id },
  });

  if (loading) return 'Loading item';
  if (error) return 'Error when loading an item. Try again.';
  if (!data.item) return 'No item found!';

  const { title, image, largeImage, description, price } = data.item;
  return (
    <div>
      {largeImage && (
        <CoverPhoto src={largeImage}>{image && <Thumbnail src={image} alt="" />}</CoverPhoto>
      )}
      <h1>{title}</h1>
      <em>{id}</em>
      <p>{description}</p>
      <p>Price: {formatMoney(price)}</p>
    </div>
  );
};

export default Item;
