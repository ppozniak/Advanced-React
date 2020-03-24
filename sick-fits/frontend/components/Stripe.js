import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const PUBLISHABLE_KEY = 'pk_test_55p5uR6jzrOPV5uNr5YcBRkV00rAJl7pyR';
const stripePromise = loadStripe(PUBLISHABLE_KEY);

function StripeBase({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}

export default StripeBase;
