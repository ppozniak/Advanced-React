import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import NProgress from 'nprogress';
import styled from 'styled-components';
import { useRouter } from 'next/router';
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
      orderId
    }
  }
`;

export const FINISH_PAYMENT_MUTATION = gql`
  mutation FINISH_PAYMENT_MUTATION($stripeId: String!, $status: String!) {
    finishPayment(stripeId: $stripeId, status: $status) {
      status
    }
  }
`;

const CheckoutForm = () => {
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(CART_QUERY);
  const [closeCart] = useMutation(CLOSE_CART_MUTATION);
  const [finishPayment] = useMutation(FINISH_PAYMENT_MUTATION, {
    refetchQueries: [{ query: ORDERS_QUERY }],
    awaitRefetchQueries: true,
  });
  const [startCheckout, { loading: loadingCheckout }] = useMutation(CHECKOUT_MUTATION, {
    refetchQueries: [{ query: ORDERS_QUERY }, { query: CART_QUERY }],
  });
  const [paymentStatus, setPaymentStatus] = useState();
  const [checkoutDisabled, setCheckoutDisabled] = useState(true);
  const { replace } = useRouter();

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
    setCheckoutDisabled(true);

    const cardElement = elements.getElement(CardElement);
    if (cardElement._empty || cardElement._invalid) return;

    NProgress.start();
    const {
      data: {
        checkout: { clientSecret, orderId },
      },
    } = await startCheckout();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      NProgress.done();
      setPaymentStatus(result.error.message);
      replace(`/payment?orderId=${orderId}&errorMessage=${result.error.message}`);
    } else if (result.paymentIntent.status === 'succeeded') {
      await finishPayment({
        variables: {
          stripeId: result.paymentIntent.id,
          status: result.paymentIntent.status,
        },
      });

      NProgress.done();
      setPaymentStatus('Success, redirecting to orders...');
      replace('/orders');
    }
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
