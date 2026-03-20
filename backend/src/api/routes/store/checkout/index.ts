import { Router } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default (router: Router) => {
  // Create payment intent
  router.post("/checkout/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency, email, shipping } = req.body;

      if (!amount || !currency) {
        return res.status(400).json({ error: "Amount and currency required" });
      }

      // Create or retrieve customer
      const customers = await stripe.customers.list({ email, limit: 1 });
      let customer = customers.data[0];

      if (!customer) {
        customer = await stripe.customers.create({
          email,
          shipping,
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
        shipping,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe webhook
  router.post("/checkout/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        // TODO: Create order in database, trigger fulfillment
        break;
      case "payment_intent.payment_failed":
        const failed = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", failed.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Get order status
  router.get("/checkout/order/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // In production, query database
      // For now, return from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(id);

      res.json({
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        created: paymentIntent.created,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
};
