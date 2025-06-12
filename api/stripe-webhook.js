/**
 * SupportPartner - Stripe Webhook Handler
 * Handles subscription events and payment processing
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  console.log('Stripe webhook received:', event.type);

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'customer.created':
        await handleCustomerCreated(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutSessionCompleted(session) {
  console.log('🎉 Checkout session completed:', session.id);
  
  // TODO: Update user subscription in database
  // TODO: Send welcome email
  // TODO: Grant access to premium features
  
  const userId = session.client_reference_id;
  const subscriptionId = session.subscription;
  
  console.log(`User ${userId} completed checkout with subscription ${subscriptionId}`);
}

async function handleSubscriptionCreated(subscription) {
  console.log('✅ Subscription created:', subscription.id);
  
  // TODO: Create subscription record in database
  // TODO: Update user access level
  // TODO: Send subscription confirmation email
  
  const customerId = subscription.customer;
  const priceId = subscription.items.data[0].price.id;
  
  console.log(`Customer ${customerId} subscribed to ${priceId}`);
}

async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id);
  
  // TODO: Update subscription in database
  // TODO: Handle plan changes
  // TODO: Notify user of changes
  
  const status = subscription.status;
  const customerId = subscription.customer;
  
  console.log(`Customer ${customerId} subscription status: ${status}`);
}

async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription deleted:', subscription.id);
  
  // TODO: Revoke premium access
  // TODO: Send cancellation email
  // TODO: Update database
  
  const customerId = subscription.customer;
  console.log(`Customer ${customerId} subscription cancelled`);
}

async function handlePaymentSucceeded(invoice) {
  console.log('💰 Payment succeeded:', invoice.id);
  
  // TODO: Update payment history
  // TODO: Send receipt
  // TODO: Extend subscription period
  
  const subscriptionId = invoice.subscription;
  const amount = invoice.amount_paid;
  
  console.log(`Payment of $${amount/100} for subscription ${subscriptionId}`);
}

async function handlePaymentFailed(invoice) {
  console.log('💸 Payment failed:', invoice.id);
  
  // TODO: Notify user of failed payment
  // TODO: Update subscription status
  // TODO: Send payment retry email
  
  const customerId = invoice.customer;
  const amount = invoice.amount_due;
  
  console.log(`Payment of $${amount/100} failed for customer ${customerId}`);
}

async function handleCustomerCreated(customer) {
  console.log('👤 Customer created:', customer.id);
  
  // TODO: Create customer record in database
  // TODO: Send welcome email
  
  const email = customer.email;
  console.log(`New customer: ${email}`);
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);
  
  // TODO: Fulfill order
  // TODO: Send confirmation
  
  const amount = paymentIntent.amount;
  console.log(`Payment of $${amount/100} succeeded`);
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log('❌ Payment intent failed:', paymentIntent.id);
  
  // TODO: Notify user
  // TODO: Log failure reason
  
  const failureReason = paymentIntent.last_payment_error?.message;
  console.log(`Payment failed: ${failureReason}`);
}

// Export configuration for Next.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}