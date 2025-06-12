const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create subscription endpoint
router.post('/create', async (req, res) => {
  try {
    const { paymentMethodId, priceId, customerId } = req.body;

    // Create customer if not provided
    let customer = customerId;
    if (!customer) {
      const newCustomer = await stripe.customers.create({
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customer = newCustomer.id;
    } else {
      // Attach payment method to existing customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer,
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 7, // 7-day free trial
    });

    res.json({
      id: subscription.id,
      status: subscription.status,
      customerId: customer,
      client_secret: subscription.latest_invoice.payment_intent?.client_secret,
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(400).json({
      error: error.message || 'Failed to create subscription'
    });
  }
});

// Get subscription status
router.get('/status/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      return res.json({
        status: 'no_subscription',
        message: 'No active subscription found'
      });
    }

    const subscription = subscriptions.data[0];
    res.json({
      id: subscription.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      plan: subscription.items.data[0]?.price,
      trial_end: subscription.trial_end,
    });

  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(400).json({
      error: error.message || 'Failed to fetch subscription status'
    });
  }
});

// Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: subscription.current_period_end,
      }
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to cancel subscription'
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      console.log('Subscription created:', event.data.object);
      break;
    case 'customer.subscription.updated':
      console.log('Subscription updated:', event.data.object);
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription deleted:', event.data.object);
      break;
    case 'invoice.payment_succeeded':
      console.log('Payment succeeded:', event.data.object);
      break;
    case 'invoice.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Test payment endpoint for development
router.post('/test-payment', async (req, res) => {
  try {
    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1299, // $12.99 in cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        test: 'true',
        environment: 'development'
      }
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('Test payment error:', error);
    res.status(400).json({
      error: error.message || 'Failed to create test payment'
    });
  }
});

module.exports = router;