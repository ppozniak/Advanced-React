const { stripe } = require("./services/stripe");
const db = require("./db");


const webhook = async (request, response) => {
  const stripeSignature = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const { id, status } = paymentIntent;

      const existingPayment = await db.query.payment({
        where: { stripeId: id }
      });

      if (existingPayment) {
        await db.mutation.updatePayment({
          where: {
            stripeId: id
          },
          data: {
            status
          }
        });
      }
      break;
    default:
      // Unexpected event type
      return response.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
};

module.exports = {
  webhook,
}
