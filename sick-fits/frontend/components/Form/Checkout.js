import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import NProgress from 'nprogress';
import ErrorMessage from '../ErrorMessage';
import LogInGuard from '../LogInGuard';
import { CART_QUERY, CLOSE_CART_MUTATION } from '../Cart';

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
  const [startCheckout, { loading: loadingCheckout }] = useMutation(CHECKOUT_MUTATION);
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

  return (
    <LogInGuard>
      {cartError && <ErrorMessage error={cartError} />}
      {cartLoading && 'Loading your cart items...'}
      <h1>Checkout</h1>
      {items.map(cartItem => (
        <p key={cartItem.id}>
          {cartItem.item.title} - {cartItem.quantity}x
        </p>
      ))}
      {items.length === 0 && !paymentStatus && 'Your cart is empty'}
      {!!items.length && (
        <form onSubmit={handleSubmit}>
          <CardElement hidePostalCode onChange={handleChange} />
          <button disabled={loadingCheckout || checkoutDisabled} type="submit">
            Pay now
          </button>
        </form>
      )}
      {paymentStatus}
    </LogInGuard>
  );
};

export default CheckoutForm;
