# 🔧 **SUPABASE CORS CONFIGURATION**

## 🚨 **Issue:**
CORS errors blocking authentication from localhost:3021

## ✅ **Quick Fix:**

### **Step 1: Configure Supabase Site URL**
1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Set:
   ```
   Site URL: http://localhost:3021
   ```

### **Step 2: Add Redirect URLs**
Add these URLs to **Redirect URLs**:
```
http://localhost:3021
http://localhost:3021/dashboard
http://localhost:3021/**
```

### **Step 3: Enable CORS**
In **Authentication** → **URL Configuration**:
- **Additional Redirect URLs**: `http://localhost:3021/**`

## 🔄 **Alternative: Use Environment Variables**

Update your `.env` file:
```env
# Change the Supabase URL in your .env to match your configured domain
VITE_SUPABASE_URL=https://xnxovbqqpdrmjzufevhe.supabase.co
VITE_SUPABASE_ANON_KEY=your-working-anon-key

# Make sure your site URL matches
VITE_SITE_URL=http://localhost:3021
```

## 🚀 **Production Setup:**
When deploying to Vercel:
1. Site URL: `https://your-domain.vercel.app`
2. Redirect URLs: `https://your-domain.vercel.app/**`

## 🧪 **Test Authentication:**
After configuring:
1. Restart your dev server
2. Try signup/login from the landing page
3. Check browser console for CORS errors

---

**The authentication should work once Supabase is configured to allow your localhost origin.**