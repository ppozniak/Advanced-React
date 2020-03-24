import React from 'react';
import StripeBase from '../components/Stripe';
import CheckoutForm from '../components/Form/Checkout';

const Checkout = () => (
  <StripeBase>
    <CheckoutForm />
  </StripeBase>
);

export default Checkout;
