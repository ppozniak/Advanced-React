import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Item from '../components/Item';
import Pagination from '../components/Pagination';

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 250px));
  grid-gap: 20px;
`;

export const ITEMS_PER_PAGE = 3;

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($first: Int, $skip: Int) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      description
      price
      image
      largeImage
    }

    full: itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Home = () => {
  // @TODO: Invalidate cache
  // @TODO: Validate page number even more
  const { query } = useRouter();
  let currentPage = parseInt(query.page, 10) || 1;

  const { data, loading, error } = useQuery(ALL_ITEMS_QUERY, {
    variables: {
      first: 3,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
    },
  });

  if (loading) return <i>Loading...</i>;
  if (error) return <strong>Error :(</strong>;

  if (currentPage < 0) {
    currentPage = 1;
  }

  const totalItems = data.full.aggregate.count;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (currentPage > totalPages) {
    currentPage = 1;
  }

  return (
    <>
      <Pagination currentPage={currentPage} totalItems={totalItems} totalPages={totalPages} />
      <ItemsContainer>
        {data.items.map(item => (
          <Item key={item.id} {...item} />
        ))}
      </ItemsContainer>
    </>
  );
};

export default Home;
