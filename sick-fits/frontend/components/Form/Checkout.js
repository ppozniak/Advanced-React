import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import NProgress from 'nprogress';
import styled from 'styled-components';
import ErrorMessage from '../ErrorMessage';
import LogInGuard from '../LogInGuard';
import { CART_QUERY, CLOSE_CART_MUTATION } from '../Cart';
import Item, { ItemsTotal } from '../Item';
import calcTotalPrice from '../../lib/calcTotalPrice';
import SickButton from '../styles/SickButton';
import { ORDERS_QUERY } from '../../pages/orders';

const Form = styled.form`
  border: 1px solid black;
  padding: 3rem;
  margin-top: 2rem;
  display: flex;
  align-content: center;

  .StripeElement {
    flex: 1;
  }
`;

const CHECKOUT_MUTATION = gql`
  mutation CHECKOUT_MUTATION {
    checkout {
      clientSecret
    }
  }
`;

const CheckoutForm = () => {
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(CART_QUERY);
  const [closeCart] = useMutation(CLOSE_CART_MUTATION);
  const [startCheckout, { loading: loadingCheckout }] = useMutation(CHECKOUT_MUTATION, {
    refetchQueries: [{ query: ORDERS_QUERY }],
  });
  const [paymentStatus, setPaymentStatus] = useState();
  const [checkoutDisabled, setCheckoutDisabled] = useState(true);

  const items = (cartData && cartData.currentUser && cartData.currentUser.cart) || [];

  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    closeCart();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    if (!elements || !stripe) {
      console.log('Elements are not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (cardElement._empty || cardElement._invalid) return;

    NProgress.start();
    const {
      data: {
        checkout: { clientSecret },
      },
    } = await startCheckout({ refetchQueries: [{ query: CART_QUERY }] });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      setPaymentStatus(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      // The payment has been processed!
      // Show a success message to your customer
      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
      setPaymentStatus('Success');
    }
    NProgress.done();
  };

  const handleChange = event => {
    const valid = event.complete && !event.error;
    setCheckoutDisabled(!valid);
  };

  const totalPrice = calcTotalPrice(items);

  return (
    <LogInGuard>
      {cartError && <ErrorMessage error={cartError} />}
      {cartLoading && 'Loading your cart items...'}
      <h1>Checkout</h1>
      <ul>
        {items.map(({ quantity, item, id }) => (
          <Item
            key={id}
            title={item.title}
            description={item.description}
            image={item.image}
            price={item.price}
            quantity={quantity}
          />
        ))}
      </ul>
      <ItemsTotal total={totalPrice} />
      {items.length === 0 && !paymentStatus && 'Your cart is empty'}
      {!!items.length && (
        <Form onSubmit={handleSubmit}>
          <CardElement hidePostalCode onChange={handleChange} />
          <SickButton
            style={{ marginLeft: '2rem', marginTop: '-1.25rem' }}
            disabled={loadingCheckout || checkoutDisabled}
            type="submit"
          >
            Pay now
          </SickButton>
        </Form>
      )}
      {paymentStatus}
    </LogInGuard>
  );
};

export default CheckoutForm;
