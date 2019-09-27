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
  query ALL_ITEMS_QUERY($first: Int, $after: String, $before: String, $last: Int) {
    itemsConnection(
      after: $after
      before: $before
      first: $first
      last: $last
      orderBy: createdAt_DESC
    ) {
      edges {
        node {
          id
          title
          description
          price
          image
          largeImage
        }
        cursor
      }
    }

    full: itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Home = () => {
  const { query } = useRouter();
  let currentPage = parseInt(query.page, 10) || 1;
  const { after, before } = query;

  const { data, loading, error } = useQuery(ALL_ITEMS_QUERY, {
    variables: {
      after,
      before,
      [before ? 'last' : 'first']: ITEMS_PER_PAGE,
    },
  });

  if (loading) return <i>Loading...</i>;
  if (error) return <strong>Error :(</strong>;

  const totalItems = data.full.aggregate.count;

  if (currentPage > totalItems / ITEMS_PER_PAGE) {
    currentPage = 1;
  }

  const { edges } = data.itemsConnection;
  const lastCursor = edges[edges.length - 1].cursor;
  const firstCursor = edges[0].cursor;

  return (
    <>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        lastCursor={lastCursor}
        firstCursor={firstCursor}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <ItemsContainer>
        {edges.map(({ node }) => (
          <Item key={node.id} {...node} />
        ))}
      </ItemsContainer>
    </>
  );
};

export default Home;
