import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 250px));
`;

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      description
      price
    }
  }
`;

class Home extends Component {
  render() {
    return (
      <ItemsContainer>
        <Query query={ALL_ITEMS_QUERY}>
          {({ loading, data, error }) => {
            if (error) return <strong>{error.message}</strong>;
            if (loading) return <strong>Loading inks, please wait.</strong>;
            return data.items.map(item => <Item key={item.id} {...item} />);
          }}
        </Query>
      </ItemsContainer>
    );
  }
}

export default Home;
