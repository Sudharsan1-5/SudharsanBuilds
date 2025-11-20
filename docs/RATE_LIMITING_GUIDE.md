# 🚦 Server-Side Rate Limiting Implementation Guide

## ⚠️ Why Server-Side Rate Limiting is Critical

**Current Status**: The portfolio has client-side rate limiting only, which can be bypassed by:
- Disabling JavaScript in browser console
- Using curl/Postman to directly call API endpoints
- Manipulating localStorage to reset rate limit counters

**Risks Without Server-Side Rate Limiting**:
1. **API Abuse**: Malicious actors can spam Gemini AI API, exhausting your quota
2. **Cost Overruns**: Unlimited API calls can result in unexpected charges
3. **DDoS Vulnerability**: Attackers can flood endpoints, causing service disruption
4. **Database Overload**: Unlimited inquiries/payments can overwhelm Supabase

---

## ✅ Solution: Upstash Redis + Supabase Edge Functions

We'll use **Upstash Redis** (serverless Redis) for distributed rate limiting across all edge function invocations.

### Why Upstash?
- ✅ Serverless (no infrastructure management)
- ✅ Global edge network (low latency)
- ✅ Generous free tier (10,000 requests/day)
- ✅ Works seamlessly with Deno/Supabase Edge Functions
- ✅ Built-in rate limiting algorithms

---

## 📋 Implementation Steps

### Step 1: Create Upstash Account & Redis Database

1. Go to https://upstash.com and sign up (free tier available)
2. Click **"Create Database"**
3. Choose **Global** for multi-region or **Regional** for specific location
4. Name: `sudharsanbuilds-ratelimit`
5. Copy the following credentials:
   - **UPSTASH_REDIS_REST_URL**: `https://your-db.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: `Your token here`

---

### Step 2: Add Upstash Credentials to Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Settings** → **Edge Functions** → **Secrets**
3. Add these environment variables:

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

4. Click **Save**

---

### Step 3: Update `ai-chatbot` Edge Function

Replace the current `supabase/functions/ai-chatbot/index.ts` with rate limiting:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Ratelimit } from "https://esm.sh/@upstash/ratelimit@2.0.3";
import { Redis } from "https://esm.sh/@upstash/redis@1.34.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ✅ FIX #9: Initialize Upstash Redis for rate limiting
const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

// ✅ FIX #9: Configure rate limiter - 10 requests per minute per user
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per 1 minute
  analytics: true, // Enable analytics for Upstash dashboard
  prefix: "ai-chatbot", // Namespace for this endpoint
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // ✅ FIX #9: Extract user identifier (IP address or User ID)
    const userId = req.headers.get("x-user-id") || "anonymous";
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const identifier = userId !== "anonymous" ? userId : clientIp;

    // ✅ FIX #9: Check rate limit BEFORE processing request
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

    if (!success) {
      console.warn(`⚠️ Rate limit exceeded for ${identifier} (IP: ${clientIp})`);

      return new Response(
        JSON.stringify({
          error: "RATE_LIMIT_EXCEEDED",
          message: `Too many requests. You can make ${limit} requests per minute.`,
          userMessage: `⚠️ You've sent too many messages. Please wait ${Math.ceil((reset - Date.now()) / 1000)} seconds before trying again.`,
          remaining: remaining,
          resetAt: new Date(reset).toISOString()
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    console.log(`✅ Rate limit check passed for ${identifier} (${remaining}/${limit} remaining)`);

    // Continue with existing AI chatbot logic...
    const {
      message,
      conversationHistory = [],
      context = "UnknownPage",
      pageSummary = "",
      userId: requestUserId = "anonymous",
      enableStreaming = false
    } = await req.json();

    // ... rest of your existing code ...

  } catch (error) {
    console.error("Error in chatbot function:", error);
    return new Response(
      JSON.stringify({
        error: "UNEXPECTED_ERROR",
        userMessage: "Something went wrong. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

### Step 4: Update `create-payment-order` Edge Function

Add rate limiting to prevent payment spam:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Ratelimit } from "https://esm.sh/@upstash/ratelimit@2.0.3";
import { Redis } from "https://esm.sh/@upstash/redis@1.34.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

// ✅ FIX #9: Initialize rate limiter for payment orders
const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

// ✅ FIX #9: Stricter rate limit for payments - 3 per hour per IP
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 payment attempts per hour
  analytics: true,
  prefix: "payment-order",
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ✅ FIX #9: Rate limit check BEFORE payment processing
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const { success, limit, remaining, reset } = await ratelimit.limit(clientIp);

    if (!success) {
      console.error(`❌ Payment rate limit exceeded for IP: ${clientIp}`);

      return new Response(
        JSON.stringify({
          error: 'RATE_LIMIT_EXCEEDED',
          message: `Too many payment attempts. Limit: ${limit} per hour. Try again after ${new Date(reset).toLocaleTimeString()}`
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
          },
          status: 429
        }
      );
    }

    console.log(`✅ Payment rate limit OK for ${clientIp} (${remaining}/${limit} remaining)`);

    // ... rest of your existing payment logic ...

  } catch (error) {
    console.error('Error creating payment order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
```

---

## 🎯 Rate Limit Recommendations by Endpoint

| Endpoint | Recommended Limit | Reasoning |
|----------|-------------------|-----------|
| **AI Chatbot** | 10 req/min per user | Prevents API abuse while allowing normal conversation |
| **Payment Order** | 3 req/hour per IP | Prevents spam bookings, allows genuine retries |
| **Contact Form** | 5 req/hour per IP | Prevents spam inquiries |
| **Invoice Lookup** | 20 req/min per user | Allow customers to check their invoices |

---

## 📊 Monitoring Rate Limits

### Upstash Dashboard
1. Go to https://console.upstash.com
2. Click your database
3. View **Analytics** tab to see:
   - Total requests
   - Rate-limited requests
   - Top users by request count

### Supabase Logs
1. Go to Supabase Dashboard → **Edge Functions** → **Logs**
2. Filter for `"Rate limit"` to see blocked requests
3. Look for patterns (e.g., same IP spamming)

---

## 🔒 Advanced: Multi-Tier Rate Limiting

For production, consider different limits for different user types:

```typescript
// Example: Authenticated users get higher limits
const getUserLimit = (userId: string) => {
  if (userId.startsWith("premium_")) {
    return Ratelimit.slidingWindow(50, "1 m"); // Premium: 50/min
  } else if (userId !== "anonymous") {
    return Ratelimit.slidingWindow(20, "1 m"); // Registered: 20/min
  } else {
    return Ratelimit.slidingWindow(10, "1 m"); // Anonymous: 10/min
  }
};

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: getUserLimit(userId),
  analytics: true,
});
```

---

## 🧪 Testing Rate Limits

### Test with curl:

```bash
# Test AI chatbot rate limit (should block after 10 requests)
for i in {1..15}; do
  echo "Request $i:"
  curl -X POST https://your-project.supabase.co/functions/v1/ai-chatbot \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -d '{"message": "Hello"}' \
    -w "\nHTTP Status: %{http_code}\n\n"
  sleep 1
done
```

Expected output:
- Requests 1-10: HTTP 200 (success)
- Requests 11-15: HTTP 429 (rate limited)

---

## ⏱️ Implementation Timeline

1. **Create Upstash account**: 5 minutes
2. **Add credentials to Supabase**: 2 minutes
3. **Update ai-chatbot function**: 10 minutes
4. **Update create-payment-order function**: 10 minutes
5. **Test rate limits**: 10 minutes
6. **Monitor for 24 hours**: Ongoing

**Total**: ~40 minutes of active work

---

## 💰 Cost Analysis

### Upstash Free Tier:
- **10,000 requests/day** (free)
- **300,000 requests/month** (free)
- Typical usage: ~1,000-3,000 requests/day
- **Expected cost**: $0/month (well within free tier)

### Paid Tier (if needed):
- $0.20 per 100,000 requests
- Even at 1M requests/month: **$2/month**

---

## ❓ FAQ

**Q: What happens if Upstash goes down?**
A: Add a fallback in your code:

```typescript
try {
  const { success } = await ratelimit.limit(identifier);
  if (!success) return rateLimitResponse;
} catch (redisError) {
  console.error("Redis unavailable, allowing request:", redisError);
  // Continue without rate limiting (graceful degradation)
}
```

**Q: Can I use a different rate limiting solution?**
A: Yes! Alternatives:
- **Cloudflare Workers** (if using Cloudflare)
- **Vercel Edge Config** (if using Vercel)
- **Supabase Database** (store request counts in PostgreSQL, but slower)

**Q: Should I rate limit by IP or User ID?**
A: Use a combination:
- **Unauthenticated requests**: Rate limit by IP
- **Authenticated requests**: Rate limit by User ID (more accurate)
- **Payment requests**: ALWAYS rate limit by IP (prevents account abuse)

---

## 🎉 After Implementation

Once rate limiting is active:

1. ✅ Update `SECURITY.md` to mark Fix #9 as **COMPLETED**
2. ✅ Monitor Upstash dashboard for 1 week
3. ✅ Adjust limits if needed (e.g., increase for legitimate heavy users)
4. ✅ Add rate limit info to API documentation
5. ✅ Consider adding user-facing rate limit display (e.g., "You have 7 messages remaining this minute")

---

## 📞 Support

If you encounter issues:
- **Upstash Support**: https://upstash.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Email**: sudharsanofficial0001@gmail.com

---

**Last Updated**: January 2025
**Status**: ⏳ Awaiting Implementation
**Priority**: HIGH (Fix #9)
**Estimated Time**: 40 minutes
**Dependencies**: Upstash account, Supabase environment variables

---

## ✅ Next Steps

1. [ ] Create Upstash account and database
2. [ ] Add credentials to Supabase secrets
3. [ ] Update ai-chatbot edge function
4. [ ] Update create-payment-order edge function
5. [ ] Test rate limits with curl
6. [ ] Monitor for 24 hours
7. [ ] Mark Fix #9 as completed in SECURITY.md

**Once complete, all 7 HIGH priority fixes (#6-12) will be DONE!** 🎉
