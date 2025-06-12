/**
 * Stripe Payment Flow Test Script
 * Tests the complete subscription payment flow for SupportPartner
 */

import Stripe from 'stripe';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key');

// Test card numbers (Stripe test cards)
const TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINE: '4000000000000002',
  AUTHENTICATION_REQUIRED: '4000002500003155',
  INSUFFICIENT_FUNDS: '4000000000000341'
};

// Test subscription plans (Reference Landing Page Pricing)
const TEST_PLANS = {
  basic: {
    priceId: 'price_1RYnQqELGHd3NbdJ5eEbaYbw',
    amount: 999, // $9.99
    name: 'Basic'
  },
  complete: {
    priceId: 'price_1RYnRdELGHd3NbdJ8UAOxdJq',
    amount: 1999, // $19.99
    name: 'Complete Partner'
  },
  couples_therapy_plus: {
    priceId: 'price_1RYnSTELGHd3NbdJQ9OyjJsZ',
    amount: 2999, // $29.99
    name: 'Couples Therapy Plus'
  }
};

async function testStripeSetup() {
  console.log('🧪 Testing Stripe Setup...\n');

  try {
    // Test 1: Verify Stripe connection
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe connection successful');
    console.log(`   Account: ${account.business_profile?.name || account.id}`);
    console.log(`   Environment: ${account.livemode ? 'LIVE' : 'TEST'}`);
    
    if (account.livemode) {
      console.log('⚠️  WARNING: Using LIVE Stripe keys! Switch to test keys for testing.');
      return;
    }

    // Test 2: List existing products and prices
    const products = await stripe.products.list({ limit: 10 });
    console.log(`\n📦 Found ${products.data.length} products:`);
    
    for (const product of products.data) {
      const prices = await stripe.prices.list({ product: product.id });
      console.log(`   - ${product.name}: ${prices.data.length} prices`);
      prices.data.forEach(price => {
        console.log(`     * ${price.id}: $${price.unit_amount / 100} ${price.currency} (${price.recurring?.interval || 'one-time'})`);
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Stripe setup test failed:', error.message);
    return false;
  }
}

async function testPaymentIntent() {
  console.log('\n💳 Testing Payment Intent Creation...\n');

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999, // $9.99 (Basic plan)
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        test: 'payment_intent_test',
        plan: 'basic'
      }
    });

    console.log('✅ Payment Intent created successfully');
    console.log(`   ID: ${paymentIntent.id}`);
    console.log(`   Amount: $${paymentIntent.amount / 100}`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Client Secret: ${paymentIntent.client_secret.substring(0, 20)}...`);

    return paymentIntent;
  } catch (error) {
    console.error('❌ Payment Intent test failed:', error.message);
    return null;
  }
}

async function testCustomerCreation() {
  console.log('\n👤 Testing Customer Creation...\n');

  try {
    const customer = await stripe.customers.create({
      email: 'test@supportpartner.com',
      name: 'Test User',
      metadata: {
        test: 'customer_test',
        app: 'SupportPartner'
      }
    });

    console.log('✅ Customer created successfully');
    console.log(`   ID: ${customer.id}`);
    console.log(`   Email: ${customer.email}`);
    console.log(`   Name: ${customer.name}`);

    return customer;
  } catch (error) {
    console.error('❌ Customer creation test failed:', error.message);
    return null;
  }
}

async function testSubscriptionCreation(customer, priceId) {
  console.log('\n📋 Testing Subscription Creation...\n');

  try {
    // First create a payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: TEST_CARDS.SUCCESS,
        exp_month: 12,
        exp_year: 2025,
        cvc: '123',
      },
    });

    // Attach to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethod.id,
      trial_period_days: 7,
      expand: ['latest_invoice.payment_intent'],
    });

    console.log('✅ Subscription created successfully');
    console.log(`   ID: ${subscription.id}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Current Period: ${new Date(subscription.current_period_start * 1000).toLocaleDateString()} - ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`);
    console.log(`   Trial End: ${subscription.trial_end ? new Date(subscription.trial_end * 1000).toLocaleDateString() : 'No trial'}`);

    return subscription;
  } catch (error) {
    console.error('❌ Subscription creation test failed:', error.message);
    return null;
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testing API Endpoints...\n');

  const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:3021';

  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Health endpoint working');
    console.log(`   Status: ${healthResponse.data.status}`);
    console.log(`   Service: ${healthResponse.data.service}`);

    // Test subscription test endpoint
    try {
      const testPaymentResponse = await axios.post(`${API_BASE}/api/subscriptions/test-payment`);
      console.log('✅ Test payment endpoint working');
      console.log(`   Client Secret: ${testPaymentResponse.data.client_secret.substring(0, 20)}...`);
    } catch (error) {
      console.log('❌ Test payment endpoint failed:', error.response?.data?.error || error.message);
    }

  } catch (error) {
    console.error('❌ API endpoint test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Make sure your server is running on port 3021');
      console.log('   Run: npm run dev');
    }
  }
}

async function testFullPaymentFlow() {
  console.log('\n🔄 Testing Complete Payment Flow...\n');

  try {
    // Create customer
    const customer = await testCustomerCreation();
    if (!customer) return false;

    // Test subscription for basic plan
    const subscription = await testSubscriptionCreation(customer, TEST_PLANS.basic.priceId);
    if (!subscription) return false;

    // Clean up - cancel the test subscription
    await stripe.subscriptions.del(subscription.id);
    console.log('✅ Test subscription cleaned up');

    // Delete test customer
    await stripe.customers.del(customer.id);
    console.log('✅ Test customer cleaned up');

    return true;
  } catch (error) {
    console.error('❌ Full payment flow test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 SupportPartner Stripe Payment Flow Tests\n');
  console.log('='.repeat(50));

  const results = {
    setup: false,
    paymentIntent: false,
    fullFlow: false,
    apiEndpoints: false
  };

  // Test 1: Stripe Setup
  results.setup = await testStripeSetup();

  if (results.setup) {
    // Test 2: Payment Intent
    const paymentIntent = await testPaymentIntent();
    results.paymentIntent = !!paymentIntent;

    // Test 3: Full Payment Flow
    results.fullFlow = await testFullPaymentFlow();
  }

  // Test 4: API Endpoints
  await testAPIEndpoints();
  results.apiEndpoints = true; // We run this regardless

  // Results Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY\n');

  console.log(`Stripe Setup: ${results.setup ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Payment Intent: ${results.paymentIntent ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Full Payment Flow: ${results.fullFlow ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${results.apiEndpoints ? '✅ TESTED' : '❌ FAIL'}`);

  const allPassed = results.setup && results.paymentIntent && results.fullFlow;
  
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (allPassed) {
    console.log('\n🎉 Your Stripe integration is ready for testing!');
    console.log('\nNext steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Test the subscription flow in the browser');
    console.log('3. Use test card: 4242 4242 4242 4242');
    console.log('4. Check Stripe dashboard for test transactions');
  } else {
    console.log('\n⚠️  Please fix the failing tests before proceeding.');
    console.log('\nCommon issues:');
    console.log('- Missing STRIPE_SECRET_KEY in .env');
    console.log('- Wrong Stripe price IDs');
    console.log('- Server not running on port 3021');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testStripeSetup,
  testPaymentIntent,
  testCustomerCreation,
  testSubscriptionCreation,
  testAPIEndpoints,
  testFullPaymentFlow,
  TEST_CARDS,
  TEST_PLANS
};