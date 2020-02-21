import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';

export const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;

const Cart = () => {
  const { data: { cartOpen } = {} } = useQuery(LOCAL_STATE_QUERY);

  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  return (
    <CartStyles open={cartOpen}>
      <header>
        <CloseButton title="Close cart" onClick={toggleCart}>
          &times;
        </CloseButton>
        <Supreme>Your cart</Supreme>
        <p>You have 5 items.</p>
      </header>

      <footer>
        <p>$10.00</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  );
};

export default Cart;
