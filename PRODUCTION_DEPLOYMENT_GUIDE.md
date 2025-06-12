# 🔥 **HOTSUPPORT.APP PRODUCTION DEPLOYMENT**

## 🎯 **Domain: www.hotsupport.app**

Perfect branding for menopause support! Let's get this live.

## 🚀 **Step 1: Deploy to Vercel**

```bash
cd web-apps/supportivepartner-web

# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to production
vercel --prod

# During setup:
# - Project name: hotsupport-app
# - Framework: React/Vite
# - Build command: npm run build
# - Output directory: dist
```

## 🌐 **Step 2: Configure Custom Domain**

### **In Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add domain: `hotsupport.app`
3. Add domain: `www.hotsupport.app`
4. Set `www.hotsupport.app` as primary

### **DNS Configuration:**
```
# Add these DNS records in your domain registrar:
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.19
```

## 🔧 **Step 3: Environment Variables in Vercel**

Add these in **Vercel Dashboard → Settings → Environment Variables**:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration (Replace with your actual keys)
VITE_STRIPE_PUBLISHABLE_KEY=your_live_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_live_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# App Configuration
VITE_APP_NAME=SupportPartner
VITE_SITE_URL=https://www.hotsupport.app
NODE_ENV=production

# AI Configuration
VITE_ANTHROPIC_API_KEY=your_claude_api_key
```

## 🔐 **Step 4: Configure Supabase for Production**

### **In Supabase Dashboard → Authentication → URL Configuration:**

```
Site URL: https://www.hotsupport.app
Redirect URLs:
- https://www.hotsupport.app/**
- https://www.hotsupport.app/dashboard
- https://www.hotsupport.app/auth/callback
- https://hotsupport.app/**
```

## 💳 **Step 5: Configure Stripe Webhook**

### **Create Production Webhook:**
```
URL: https://www.hotsupport.app/api/stripe-webhook
Events: 
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- customer.created
- payment_intent.succeeded
- payment_intent.payment_failed
```

### **Update Environment Variable:**
Copy the webhook signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel.

## 📊 **Step 6: Test Production Deployment**

### **Test Checklist:**
- [ ] Visit https://www.hotsupport.app
- [ ] Test responsive design on mobile
- [ ] Test user registration/login
- [ ] Test pricing table and plan selection
- [ ] Test webhook endpoint with Stripe CLI
- [ ] Verify SSL certificate is working
- [ ] Test all navigation links
- [ ] Check browser console for errors

### **Performance Testing:**
```bash
# Test with Lighthouse
npx lighthouse https://www.hotsupport.app --view

# Should achieve:
# Performance: 90+
# Accessibility: 100
# Best Practices: 100
# SEO: 90+
```

## 🎯 **Step 7: Go Live Checklist**

### **Before Launch:**
- [ ] Domain configured and SSL active
- [ ] All environment variables set
- [ ] Supabase authentication working
- [ ] Stripe test payments working
- [ ] All pages load correctly
- [ ] Mobile experience tested
- [ ] Error handling tested

### **Launch Day:**
- [ ] Switch Stripe to live mode (when ready)
- [ ] Update webhook with live keys
- [ ] Monitor error logs
- [ ] Test real payment flow
- [ ] Social media announcement ready

## 🔥 **Expected URLs:**

- **Landing Page:** https://www.hotsupport.app
- **Pricing:** https://www.hotsupport.app#pricing  
- **Dashboard:** https://www.hotsupport.app/dashboard
- **Webhook:** https://www.hotsupport.app/api/stripe-webhook
- **Health Check:** https://www.hotsupport.app/api/health

## 💡 **Post-Launch Optimizations:**

1. **SEO Setup:**
   - Add Google Analytics
   - Submit to search engines
   - Create sitemap.xml

2. **Marketing:**
   - Facebook Pixel
   - Google Ads conversion tracking
   - Email capture optimization

3. **Performance:**
   - CDN optimization
   - Image compression
   - Caching headers

---

**🚀 Ready to make www.hotsupport.app the go-to destination for menopause support partners!**