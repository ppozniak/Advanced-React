// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET);

async function createPaymentIntent({
  amount
}) {
  return stripe.paymentIntents.create({
    amount,
    currency: 'gbp',
  })
}

module.exports = {
  createPaymentIntent,
}