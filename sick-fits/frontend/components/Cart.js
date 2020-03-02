import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($itemId: ID!) {
    addToCart(itemId: $itemId) {
      item {
        id
        title
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
    }
  }
`;

export const CART_QUERY = gql`
  query CART_QUERY {
    currentUser {
      id
      cart {
        id
        quantity
        item {
          id
          title
          price
        }
      }
    }
  }
`;

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

const CartItem = ({ title, price, quantity, id }) => {
  const [removeFromCart, { loading: removingFromCart }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: {
      cartItemId: id,
    },
    refetchQueries: [{ query: CART_QUERY }],
    optimisticResponse: {
      __typename: 'MUTATION',
      removeFromCart: {
        __typename: 'CartItem',
        id,
      },
    },
    update: (cache, { data }) => {
      const deletedCartItemId = data.removeFromCart.id;
      const { currentUser } = cache.readQuery({ query: CART_QUERY });

      const newCart = [...currentUser.cart].filter(cartItem => cartItem.id !== deletedCartItemId);
      const newData = { currentUser: { ...currentUser, cart: newCart } };

      cache.writeQuery({ query: CART_QUERY, data: newData });
    },
  });

  return (
    <li>
      {title} - x{quantity} = {formatMoney(price * quantity)} ({formatMoney(price)} pu){' '}
      <button type="button" onClick={removeFromCart} disabled={removingFromCart}>
        {removingFromCart ? 'Removing...' : '🗑'}
      </button>
    </li>
  );
};

const Cart = () => {
  const { data: { currentUser } = {}, loading, error } = useQuery(CART_QUERY);
  const { data: { cartOpen } = {} } = useQuery(LOCAL_STATE_QUERY);
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  const totalItems =
    currentUser && currentUser.cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice =
    currentUser &&
    currentUser.cart.reduce((total, { quantity, item }) => total + quantity * item.price, 0);

  return (
    <CartStyles open={cartOpen}>
      <header>
        <CloseButton title="Close cart" onClick={toggleCart}>
          &times;
        </CloseButton>
        <Supreme>Your cart</Supreme>
        <p>You have {totalItems} items.</p>
      </header>

      {loading && 'Loading your cart...'}
      {error && <ErrorMessage error={error} />}
      <ul>
        {currentUser &&
          currentUser.cart.map(({ quantity, item: { title, price }, id }) => (
            <CartItem id={id} quantity={quantity} title={title} key={id} price={price} />
          ))}
      </ul>

      <footer>
        <p>{formatMoney(totalPrice)}</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  );
};

export default Cart;
