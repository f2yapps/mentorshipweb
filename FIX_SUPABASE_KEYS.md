# 🔧 Fix: Invalid Supabase Keys Error

## ❌ The Problem

Your `.env.local` file has **invalid/placeholder Supabase keys**. The keys in your file look like this:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__hFcFgddlPYzvMzuZre7Pw_rNhPWzP2
```

**This is NOT a real Supabase key!** Real Supabase keys are much longer (200+ characters).

This is causing the error: `Application error: a server-side exception has occurred`

## ✅ The Solution

You need to get your **real** Supabase keys and update `.env.local`.

### Step 1: Get Your Real Supabase Keys

1. Go to https://supabase.com/dashboard
2. Select your project (or create one if you haven't)
3. Go to **Settings** (gear icon in sidebar)
4. Click **API**
5. You'll see:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (very long string, starts with `eyJ...`)

### Step 2: Update Your `.env.local` File

Replace the contents of `.env.local` with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_VERY_LONG_KEY_HERE

# Optional: Service role key (keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_SERVICE_ROLE_KEY_HERE
```

**Important:** 
- The `anon key` should be about 200+ characters long
- It should start with `eyJ`
- Copy the ENTIRE key (don't truncate it)

### Step 3: Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Test It

Visit http://localhost:3000/profile/edit

It should work now! ✅

---

## 🎯 Example of Real vs Fake Keys

### ❌ FAKE (What you have now):
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__hFcFgddlPYzvMzuZre7Pw_rNhPWzP2
```
**Length:** ~50 characters (TOO SHORT!)

### ✅ REAL (What you need):
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bnNmZGh6anJoYXdpanNndGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1MjQ4MDAsImV4cCI6MjAwNTEwMDgwMH0.abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP
```
**Length:** 200+ characters (CORRECT!)

---

## 🔍 How To Find Your Supabase Project

If you don't have a Supabase project yet:

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name:** mentorship-platform
   - **Database Password:** (create a strong password)
   - **Region:** Choose closest to you
6. Click "Create new project"
7. Wait 2 minutes for setup
8. Go to Settings → API
9. Copy your keys

---

## 📝 Quick Checklist

- [ ] Go to Supabase Dashboard
- [ ] Find Settings → API
- [ ] Copy Project URL (full URL)
- [ ] Copy anon/public key (FULL key, 200+ chars)
- [ ] Update `.env.local` with real keys
- [ ] Restart dev server (`npm run dev`)
- [ ] Visit http://localhost:3000/profile/edit
- [ ] Should work! ✅

---

## 🆘 Still Getting Errors?

After updating with real keys, if you still see errors:

1. **Check the keys are complete:**
   - anon key should be 200+ characters
   - Should start with `eyJ`
   - No spaces or line breaks

2. **Restart dev server:**
   ```bash
   # Kill the server (Ctrl+C)
   npm run dev
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check Supabase project is active:**
   - Go to Supabase Dashboard
   - Make sure project status is "Active" (green)

---

**Once you have real Supabase keys, everything will work!** 🚀
