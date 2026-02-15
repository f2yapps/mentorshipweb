# Troubleshooting Guide

## Issue: "Still showing Log In button after creating account and signing in"

This issue occurs when the user record is not being created in the `users` table after signup.

### Solution

Follow these steps to fix the issue:

### Step 1: Enable the Database Trigger

The trigger automatically creates a user record when someone signs up.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

6. Click **Run** or press `Ctrl/Cmd + Enter`
7. You should see: "Success. No rows returned"

### Step 2: Fix Existing Users (If Needed)

If you already created an account before enabling the trigger, you need to manually create the user record:

1. Go to **SQL Editor** in Supabase
2. Run this query to see your auth users:

```sql
SELECT id, email, raw_user_meta_data FROM auth.users;
```

3. Copy your user ID and email
4. Run this query to create your user record (replace the values):

```sql
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
VALUES (
  'YOUR-USER-ID-HERE',  -- Replace with your ID from step 2
  'your-email@example.com',  -- Replace with your email
  'Your Name',  -- Replace with your name
  'mentee',  -- or 'mentor' depending on your role
  NOW(),
  NOW()
);
```

### Step 3: Test the Fix

1. **If you already have an account:**
   - Clear your browser cache and cookies
   - Go to your application
   - Log in with your credentials
   - You should now see your name and "Dashboard" button

2. **Create a new test account:**
   - Sign up with a new email
   - Verify the email
   - Log in
   - You should see your name and "Dashboard" button immediately

### Step 4: Verify the Trigger is Working

After enabling the trigger, test with a new account:

1. Create a new account
2. Go to Supabase Dashboard → **Table Editor** → **users** table
3. You should see a new row with your user data

## Other Common Issues

### Issue: Environment Variables Not Set

**Symptoms:** Application shows errors about Supabase connection

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
3. Redeploy your application

### Issue: Email Not Confirmed

**Symptoms:** Can't log in, getting "Email not confirmed" error

**Solution:**
1. Check your email inbox (and spam folder)
2. Click the confirmation link
3. Try logging in again

### Issue: Session Not Persisting

**Symptoms:** Logged in but page refresh shows "Log in" button again

**Solution:**
1. Clear browser cache and cookies
2. Check browser console for errors (F12 → Console tab)
3. Make sure you're not in incognito/private mode
4. Check if third-party cookies are enabled

## Need More Help?

If you're still experiencing issues:

1. **Check browser console:**
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Look for red error messages
   - Share these errors for help

2. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any error messages

3. **Verify database setup:**
   - Go to Table Editor
   - Make sure all tables exist: users, mentors, mentees, categories, mentorship_requests, reviews
   - Check if RLS (Row Level Security) is enabled

4. **Check the trigger:**
   - Go to Database → Triggers
   - Look for `on_auth_user_created` trigger
   - It should be enabled on `auth.users` table
