import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Link from 'next/link';
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

export const CLOSE_CART_MUTATION = gql`
  mutation CLOSE_CART_MUTATION {
    closeCart @client
  }
`;

const Dot = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.theme.black};
  color: white;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  font-size: 1rem;
  text-decoration: none;
  margin-bottom: -1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DotAnimation = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;

  .dot-animation-enter {
    transform: translateY(-20px);
  }

  .dot-animation-enter-active {
    transform: translateY(0px);
    transition: all 0.4s;
  }

  .dot-animation-exit {
    transform: translateY(0px);
  }

  .dot-animation-exit-active {
    transform: translateY(20px);
    transition: all 0.4s;
  }

  span {
    position: absolute;
  }
`;

const DotLoading = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }
  border-radius: 50%;

  position: absolute;
  top: 0;
  left: 0;
  width: 2.5rem;
  height: 2.5rem;
  border: 0.5rem solid red;
  border-top-width: 0;
  border-left-width: 0;
  animation: spin 1s infinite forwards linear;
`;

export const CartItemsQuantity = ({ quantity = 0, loading = false }) => (
  <Dot>
    {loading && <DotLoading />}
    <DotAnimation>
      <TransitionGroup component={null}>
        <CSSTransition classNames="dot-animation" key={quantity} unmountOnExit timeout={400}>
          <span>{quantity}</span>
        </CSSTransition>
      </TransitionGroup>
    </DotAnimation>
  </Dot>
);

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

  const itemCartString = `${title} - x${quantity} = ${formatMoney(price * quantity)} (${formatMoney(
    price
  )} pu)`;

  return (
    <li>
      {(title && quantity && itemCartString) || 'This item was deleted from our website.'}
      <button type="button" onClick={removeFromCart} disabled={removingFromCart}>
        {removingFromCart ? 'Removing...' : '🗑'}
      </button>
    </li>
  );
};

//  If item was deleted it will be null
const onlyWithExistingItems = ({ item }) => !!item;

const Cart = () => {
  const { data: { currentUser } = {}, loading, error } = useQuery(CART_QUERY);
  const { data: { cartOpen } = {} } = useQuery(LOCAL_STATE_QUERY);
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  const cartItemsWithExistingItems =
    (currentUser && currentUser.cart.filter(onlyWithExistingItems)) || [];

  const totalItems = cartItemsWithExistingItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  const totalPrice = cartItemsWithExistingItems.reduce(
    (total, { quantity, item }) => total + quantity * item.price,
    0
  );

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
          currentUser.cart.map(({ quantity, item, id }) => (
            <CartItem
              id={id}
              key={id}
              quantity={quantity}
              title={item && item.title}
              price={item && item.price}
            />
          ))}
      </ul>

      <footer>
        <p>{formatMoney(totalPrice)}</p>
        <Link href="/checkout" passHref>
          <SickButton as="a">Checkout</SickButton>
        </Link>
      </footer>
    </CartStyles>
  );
};

export default Cart;
