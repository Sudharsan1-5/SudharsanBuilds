# EmailJS Setup Guide (FREE Plan - 2 Templates Only)

This is a simplified guide for EmailJS **FREE plan** which allows **2 email templates only**.

## 🎯 What You'll Get (100% FREE)

- ✅ Customer booking confirmation emails
- ✅ Invoice emails to customers
- ✅ Owner alert emails (reuses booking template)
- ✅ All data saved in Supabase
- ✅ 200 emails/month FREE

**What's disabled:**
- ❌ Contact form emails (but data is still saved in Supabase - you can check there)

---

## 🚀 Quick Setup (3 Minutes)

### Step 1: Create EmailJS Account (1 minute)

1. Go to https://www.emailjs.com/
2. Click **"Sign Up"** (FREE)
3. Use your email: `sudharsanofficial0001@gmail.com`
4. Verify your email

---

### Step 2: Connect Gmail (1 minute)

1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Click "Connect Account" and authorize your Gmail
5. You'll get a **Service ID** (looks like `service_abc123`)
6. **COPY THIS** → You'll paste it in `.env` file

---

### Step 3: Get Your Public Key (30 seconds)

1. Click **"Account"** → **"General"** tab
2. Copy your **Public Key** (looks like `xyz789abc`)
3. **SAVE THIS** → You'll paste it in `.env` file

---

### Step 4: Create 2 Email Templates (You already did this!)

You created:
1. ✅ `booking_confirm` (Template ID: `template_93arapj`)
2. ✅ `invoice` (Template ID: `template_invoice`)

**Perfect!** That's all you need for the FREE plan.

---

### Step 5: Update .env File (1 minute)

Create `.env` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Then edit `.env` and fill in:

```bash
# Supabase (you already have these)
VITE_SUPABASE_URL=your-existing-supabase-url
VITE_SUPABASE_ANON_KEY=your-existing-anon-key

# Razorpay (you already have this)
VITE_RAZORPAY_KEY_ID=your-existing-razorpay-key

# EmailJS - PASTE YOUR VALUES HERE
VITE_EMAILJS_SERVICE_ID=service_abc123              # From Step 2
VITE_EMAILJS_PUBLIC_KEY=xyz789abc                   # From Step 3
VITE_EMAILJS_TEMPLATE_BOOKING=template_93arapj      # Your booking template ID
VITE_EMAILJS_TEMPLATE_INVOICE=template_invoice      # Your invoice template ID

# Business Info - UPDATE THESE
VITE_YOUR_EMAIL=sudharsanofficial0001@gmail.com
VITE_WHATSAPP_NUMBER=919876543210                   # Your WhatsApp with country code
VITE_UPI_ID=sudharsan@upi                           # Your UPI ID
```

---

### Step 6: Create Supabase Invoice Table (1 minute)

1. Go to **Supabase Dashboard** → https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New Query"**
5. Copy the SQL from `supabase/migrations/002_create_invoices_table.sql`
6. Paste and click **"RUN"**
7. Verify: Go to **"Table Editor"** → You should see `invoices` table

---

## ✅ That's It! Ready to Test

Restart your dev server:

```bash
npm run dev
```

---

## 📧 How Emails Work (FREE Plan)

### When Customer Makes Payment:

1. **Email 1:** Customer gets booking confirmation ✅
2. **Email 2:** Customer gets invoice ✅
3. **Email 3:** YOU get alert email (reuses booking template) ✅

### When Someone Fills Contact Form:

- ❌ No email sent (to save your FREE quota)
- ✅ Data is saved in Supabase `inquiries` table
- ✅ You can check Supabase dashboard to see contact form submissions

---

## 🧪 Testing Your Setup

### Test 1: Payment Flow

1. Go to your website
2. Click **"Book Now"** on any service
3. Fill in booking modal
4. Complete payment (use test mode)
5. **Check:**
   - ✅ Customer email: Should receive 2 emails (booking + invoice)
   - ✅ Your email: Should receive 1 alert email
   - ✅ Supabase: Check `invoices` table for new record

### Test 2: Contact Form

1. Fill out contact form
2. Submit
3. **Check:**
   - ✅ Form shows success message
   - ✅ Supabase: Go to `inquiries` table → New row added
   - ℹ️ No email sent (FREE plan limitation)

---

## 📊 Email Usage Tracking

- Free plan: **200 emails/month**
- Each booking uses: **3 emails** (booking + invoice + alert to you)
- You can handle: **~65 bookings/month** FREE
- Check usage: EmailJS Dashboard → "Statistics"

---

## 🎨 How It Works (Technical)

### Template Reuse Strategy:

**Template 1 (`booking_confirm`):**
- Used for customer booking confirmations
- **ALSO** reused for owner alerts (just changes recipient and text)

**Template 2 (`invoice`):**
- Used for sending invoices to customers

This clever reuse keeps you on the FREE plan! 🎉

---

## 🆙 Want All Features? Upgrade Later

When you start getting lots of customers:

**EmailJS Personal Plan:**
- **$8.50/month**
- Unlimited templates
- 1,000 emails/month
- Contact form emails enabled

**When to upgrade?**
- When you need contact form emails
- When you get 50+ bookings/month
- When you're making ₹50,000+/month (then $8.50 is nothing!)

---

## ❓ Troubleshooting

### "Emails not being sent"

1. Check EmailJS dashboard → "Logs" for errors
2. Verify Service ID and Public Key in `.env`
3. Make sure template IDs match exactly
4. Check browser console (F12) for errors

### "Template not found"

- Double-check template IDs in `.env` file
- Make sure templates are "Active" in EmailJS dashboard

### "Invoice table not found"

- Run the SQL migration in Supabase (Step 6)
- Check Supabase Table Editor

---

## 🎉 You're All Set!

Your system now:
- ✅ Sends booking confirmations to customers
- ✅ Sends invoices to customers
- ✅ Alerts you about new bookings
- ✅ Saves all data in Supabase
- ✅ **100% FREE** (up to 200 emails/month)

**Questions?** Check:
- EmailJS docs: https://www.emailjs.com/docs/
- Supabase docs: https://supabase.com/docs
- Your browser console for errors

---

## 📝 Your Setup Summary

Fill this in once you're done:

```
✅ EmailJS Service ID: service_____________
✅ EmailJS Public Key: ___________________
✅ Template 1 (booking): template_93arapj
✅ Template 2 (invoice): template_invoice
✅ Supabase invoices table: Created
✅ Environment variables: Configured
```

**Everything working?** You're ready to start taking bookings! 🚀
