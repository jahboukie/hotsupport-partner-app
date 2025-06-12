# 🎯 **Stripe Webhook Setup Guide**

## 📍 **Webhook Endpoints to Create**

### **1. Development Webhook**
```
URL: http://localhost:3000/api/stripe-webhook
Description: Local development testing
```

### **2. Production Webhook**
```
URL: https://your-domain.com/api/stripe-webhook  
Description: Production environment
```

## 🎪 **Required Events**

Add these events to your Stripe webhook:

```json
[
  "checkout.session.completed",
  "customer.subscription.created", 
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed", 
  "customer.created",
  "customer.updated",
  "payment_intent.succeeded",
  "payment_intent.payment_failed"
]
```

## 🧪 **Testing Setup**

### **Step 1: Install Stripe CLI**
```bash
# Mac
brew install stripe/stripe-cli/stripe

# Windows  
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Linux
wget -O - https://packages.stripe.dev/api/security/keypairs/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

### **Step 2: Login and Test**
```bash
# Login to Stripe
stripe login

# Test webhook endpoint
stripe listen --forward-to localhost:3000/api/stripe-webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

## 🔧 **Environment Variables Needed**

Make sure your `.env` has:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (get from webhook dashboard)
```

## 📝 **Stripe Dashboard Setup**

### **Step 1: Create Webhook**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL
4. Select events listed above
5. Click "Add endpoint"

### **Step 2: Get Webhook Secret**
1. Click on your created webhook
2. Copy the "Signing secret" 
3. Add to your `.env` as `STRIPE_WEBHOOK_SECRET`

### **Step 3: Test Events**
1. Click "Send test webhook"
2. Select `checkout.session.completed`
3. Check your server logs

## 🚀 **Testing Commands**

```bash
# Test webhook locally
curl -X POST http://localhost:3000/api/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check server logs
tail -f logs/stripe-webhooks.log

# Monitor webhook events
stripe logs tail
```

## ✅ **Verification Checklist**

- [ ] Webhook endpoint created in Stripe dashboard
- [ ] All required events selected  
- [ ] Webhook secret added to environment variables
- [ ] Local testing with Stripe CLI working
- [ ] Server logs showing webhook events
- [ ] Payment flow tested end-to-end

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Signature verification failed**
   - Check webhook secret is correct
   - Ensure raw body is passed to verification

2. **404 on webhook URL**
   - Verify endpoint URL is correct
   - Check server is running on correct port

3. **Events not received**
   - Check webhook is enabled
   - Verify events are selected
   - Check server firewall settings

### **Debug Commands:**
```bash
# Check webhook status
stripe webhooks list

# View specific webhook
stripe webhooks retrieve we_...

# Test specific events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.updated
```

## 📊 **Monitoring**

### **Production Monitoring:**
- Monitor webhook delivery success rate
- Set up alerts for failed webhooks
- Log all webhook events for debugging
- Track subscription lifecycle events

### **Key Metrics:**
- Webhook delivery rate: >99%
- Payment success rate: >95%  
- Subscription churn rate: <5%
- Failed payment recovery: >80%

---

**🎯 Your webhook is ready to handle all SupportPartner subscription events!**