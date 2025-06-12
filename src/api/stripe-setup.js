// Stripe Test Product and Price Setup
// Run this script to create test products and prices in Stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createTestProducts() {
  try {
    console.log('Creating Stripe test products and prices...');

    // Essential Support Plan
    const essentialProduct = await stripe.products.create({
      name: 'Essential Support',
      description: 'Core support tools for life transitions',
      type: 'service',
    });

    const essentialPrice = await stripe.prices.create({
      product: essentialProduct.id,
      unit_amount: 1299, // $12.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    // Comprehensive Care Plan
    const comprehensiveProduct = await stripe.products.create({
      name: 'Comprehensive Care',
      description: 'Advanced support with personalized coaching',
      type: 'service',
    });

    const comprehensivePrice = await stripe.prices.create({
      product: comprehensiveProduct.id,
      unit_amount: 2499, // $24.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    // Premium Partnership Plan
    const premiumProduct = await stripe.products.create({
      name: 'Premium Partnership',
      description: 'Complete support ecosystem for couples',
      type: 'service',
    });

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 3999, // $39.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    console.log('✅ Stripe test products created successfully!');
    console.log('\nAdd these price IDs to your .env file:');
    console.log(`STRIPE_ESSENTIAL_PRICE_ID=${essentialPrice.id}`);
    console.log(`STRIPE_COMPREHENSIVE_PRICE_ID=${comprehensivePrice.id}`);
    console.log(`STRIPE_PREMIUM_PRICE_ID=${premiumPrice.id}`);

    console.log('\nProducts created:');
    console.log(`Essential: ${essentialProduct.id} (Price: ${essentialPrice.id})`);
    console.log(`Comprehensive: ${comprehensiveProduct.id} (Price: ${comprehensivePrice.id})`);
    console.log(`Premium: ${premiumProduct.id} (Price: ${premiumPrice.id})`);

    return {
      essential: { productId: essentialProduct.id, priceId: essentialPrice.id },
      comprehensive: { productId: comprehensiveProduct.id, priceId: comprehensivePrice.id },
      premium: { productId: premiumProduct.id, priceId: premiumPrice.id }
    };

  } catch (error) {
    console.error('❌ Error creating Stripe products:', error.message);
    throw error;
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  createTestProducts()
    .then(() => {
      console.log('\n🎉 Stripe setup complete! Update your .env file with the price IDs above.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestProducts };