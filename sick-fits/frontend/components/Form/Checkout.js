import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import ErrorMessage from '../ErrorMessage';
import LogInGuard from '../LogInGuard';
import useCurrentUser from '../useCurrentUser';
import { CART_QUERY, CLOSE_CART_MUTATION } from '../Cart';

const CHECKOUT_MUTATION = gql`
  mutation CHECKOUT_MUTATION {
    checkout {
      clientSecret
    }
  }
`;

const CheckoutForm = () => {
  const { data, loading, error } = useCurrentUser();
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(CART_QUERY);
  const [closeCart] = useMutation(CLOSE_CART_MUTATION);
  const [startCheckout, { loading: loadingCheckout }] = useMutation(CHECKOUT_MUTATION);
  const [paymentStatus, setPaymentStatus] = useState();

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

    const {
      data: {
        checkout: { clientSecret },
      },
    } = await startCheckout({ refetchQueries: [{ query: CART_QUERY }] });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
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
  };

  return (
    <LogInGuard>
      {error && <ErrorMessage error={error} />}
      {cartError && <ErrorMessage error={cartError} />}
      {loading && 'Loading user data...'}
      {cartLoading && 'Loading your cart items...'}
      <h1>Checkout</h1>
      {items.map(cartItem => (
        <p key={cartItem.id}>
          {cartItem.item.title} - {cartItem.quantity}x
        </p>
      ))}
      {items.length === 0 && 'Your cart is empty'}
      {!!items.length && (
        <>
          <form onSubmit={handleSubmit}>
            <CardElement hidePostalCode />
            <button disabled={loadingCheckout} type="submit">
              Pay now
            </button>
          </form>
          {paymentStatus}
        </>
      )}
    </LogInGuard>
  );
};

export default CheckoutForm;
