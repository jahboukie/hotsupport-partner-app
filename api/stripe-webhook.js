const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Helper function to get raw body from request
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔍 Webhook endpoint hit');
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Has signature:', !!sig);
  console.log('Has webhook secret:', !!webhookSecret);
  console.log('Webhook secret preview:', webhookSecret ? webhookSecret.substring(0, 10) + '...' : 'none');

  if (!webhookSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  if (!sig) {
    console.error('❌ Missing stripe-signature header');
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;

  try {
    // Get the raw body for signature verification
    const body = await getRawBody(req);
    console.log('Body length:', body.length);
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('✅ Webhook signature verified');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('✅ Processing event:', event.type, event.id);

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
        console.log(`❓ Unhandled event type: ${event.type}`);
    }

    console.log('✅ Event processed successfully');

    // Return success
    res.status(200).json({ 
      received: true, 
      type: event.type,
      id: event.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
}

// Critical: Disable body parsing for raw body access
export const config = {
  api: {
    bodyParser: false,
  },
}