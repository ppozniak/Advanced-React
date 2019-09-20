import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import Item from '../components/Item';

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 250px));
  grid-gap: 20px;
`;

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(ALL_ITEMS_QUERY);

  if (loading) return <i>Loading...</i>;
  if (error) return <strong>Error :(</strong>;
  return (
    <ItemsContainer>
      {data.items.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </ItemsContainer>
  );
};

export default Home;
