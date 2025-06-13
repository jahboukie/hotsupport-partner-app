const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Get raw body for signature verification
    const body = req.body;
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('✅ Webhook verified:', event.type);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('🎉 Checkout session completed:', event.data.object.id);
        break;

      case 'customer.subscription.created':
        console.log('✅ Subscription created:', event.data.object.id);
        break;

      case 'customer.subscription.updated':
        console.log('🔄 Subscription updated:', event.data.object.id);
        break;

      case 'customer.subscription.deleted':
        console.log('❌ Subscription deleted:', event.data.object.id);
        break;

      case 'invoice.payment_succeeded':
        console.log('💰 Payment succeeded:', event.data.object.id);
        break;

      case 'invoice.payment_failed':
        console.log('💸 Payment failed:', event.data.object.id);
        break;

      case 'customer.created':
        console.log('👤 Customer created:', event.data.object.id);
        break;

      case 'payment_intent.succeeded':
        console.log('✅ Payment intent succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment intent failed:', event.data.object.id);
        break;

      case 'product.created':
        console.log('📦 Product created:', event.data.object.id);
        break;

      case 'price.created':
        console.log('💲 Price created:', event.data.object.id);
        break;

      case 'charge.succeeded':
        console.log('💳 Charge succeeded:', event.data.object.id);
        break;

      case 'charge.updated':
        console.log('🔄 Charge updated:', event.data.object.id);
        break;

      case 'payment_intent.created':
        console.log('🔄 Payment intent created:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success
    res.status(200).json({ 
      received: true, 
      type: event.type,
      id: event.id 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
}

// Important: This tells Vercel to pass raw body for signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}