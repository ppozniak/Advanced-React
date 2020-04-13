import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import NProgress from 'nprogress';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import ErrorMessage from '../ErrorMessage';
import LogInGuard from '../LogInGuard';
import Item, { ItemsTotal } from '../Item';
import calcTotalPrice from '../../lib/calcTotalPrice';
import SickButton from '../styles/SickButton';
import { ORDERS_QUERY } from '../../pages/orders';
import { FINISH_PAYMENT_MUTATION } from './Checkout';

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

const RETRY_PAYMENT_MUTATION = gql`
  mutation RETRY_PAYMENT_MUTATION($stripeId: String!) {
    retryPayment(stripeId: $stripeId) {
      clientSecret
    }
  }
`;

const ORDER_QUERY = gql`
  query ORDER_QUERY($orderId: ID!) {
    order(orderId: $orderId) {
      items {
        id
        quantity
        title
        price
        description
        image
      }
      payment {
        stripeId
      }
    }
  }
`;

const PaymentForm = () => {
  const {
    replace,
    query: { orderId, errorMessage },
  } = useRouter();

  // Get order items
  const { data: { order } = {}, loading: orderLoading, error: orderError } = useQuery(ORDER_QUERY, {
    variables: {
      orderId,
    },
  });

  const [retryPayment, { loading: retryingPayment }] = useMutation(RETRY_PAYMENT_MUTATION);

  const [finishPayment] = useMutation(FINISH_PAYMENT_MUTATION, {
    refetchQueries: [{ query: ORDERS_QUERY }],
    awaitRefetchQueries: true,
  });

  // Local state
  const [paymentStatus, setPaymentStatus] = useState();
  const [checkoutDisabled, setCheckoutDisabled] = useState(true);

  const items = (order && order.items) || [];

  const elements = useElements();
  const stripe = useStripe();

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
        retryPayment: { clientSecret },
      },
    } = await retryPayment({
      variables: {
        stripeId: order.payment.stripeId,
      },
    });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      NProgress.done();
      setPaymentStatus(result.error.message);
      setCheckoutDisabled(false);
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
      {(orderError || errorMessage) && <ErrorMessage error={orderError || errorMessage} />}
      {orderLoading && 'Loading your cart items...'}
      <h1>Retry payment for order ID: {orderId}</h1>
      <ul>
        {items.map(({ quantity, id, title, description, image, price }) => (
          <Item
            key={id}
            title={title}
            description={description}
            image={image}
            price={price}
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
            disabled={retryingPayment || checkoutDisabled}
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

export default PaymentForm;
