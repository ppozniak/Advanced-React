import React from 'react';
import StripeBase from '../components/Stripe';
import PaymentForm from '../components/Form/Payment';

const Checkout = () => (
  <StripeBase>
    <PaymentForm />
  </StripeBase>
);

export default Checkout;
