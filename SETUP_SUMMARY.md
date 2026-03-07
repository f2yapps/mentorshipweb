# Setup Summary - Mentorship Platform

## Current Issue: Sign-in Not Persisting

**Problem:** After creating an account and verifying email, users still see the "Log in" button instead of being signed in.

**Root Cause:** The database trigger that creates user records in the `public.users` table is not enabled.

## Solution (3 Steps)

### 🔧 Step 1: Enable the Database Trigger

This is the **most important step**. The trigger automatically creates a user record when someone signs up.

**Instructions:**
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

6. Click **Run** (or press Ctrl/Cmd + Enter)
7. You should see: "Success. No rows returned"

### 🔄 Step 2: Fix Your Existing Account

Since you already created an account before the trigger was enabled, you need to manually create your user record.

**Instructions:**
1. In **SQL Editor**, click **New Query**
2. First, find your user ID:

```sql
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'YOUR-EMAIL@example.com';
```

3. Copy your `id` from the results
4. Create your user record (replace the values):

```sql
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
VALUES (
  'YOUR-USER-ID-FROM-STEP-2',  -- Replace this
  'YOUR-EMAIL@example.com',     -- Replace this
  'Your Full Name',             -- Replace this
  'mentee',                     -- or 'mentor' if you signed up as mentor
  NOW(),
  NOW()
);
```

5. Click **Run**

**OR** run this automated script that fixes all existing users:

```sql
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  COALESCE((au.raw_user_meta_data->>'role')::TEXT, 'mentee') as role,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL AND au.email_confirmed_at IS NOT NULL;
```

### ✅ Step 3: Test the Fix

1. **Clear your browser cache and cookies**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
   - Safari: Safari → Clear History

2. **Go to your application**

3. **Log in with your credentials**

4. **You should now see:**
   - Your name in the header
   - "Dashboard" button instead of "Log in"

## Verification

### Check if Everything is Working

**1. Verify the trigger exists:**
- Go to Supabase Dashboard → **Database** → **Triggers**
- Look for `on_auth_user_created` trigger
- Status should be "Enabled"

**2. Verify your user record exists:**
- Go to **Table Editor** → **users** table
- Find your email in the list
- You should see your name and role

**3. Test with a new account:**
- Create a new test account with a different email
- Verify the email
- Log in
- Should work immediately without manual fixes

## Files Created

I've created several helpful files for you:

1. **`supabase/migrations/001_create_user_trigger.sql`**
   - Enables the auth trigger

2. **`supabase/migrations/002_fix_existing_users.sql`**
   - Fixes all existing users at once

3. **`supabase/README.md`**
   - Detailed setup instructions

4. **`TROUBLESHOOTING.md`**
   - Comprehensive troubleshooting guide

5. **`components/layout/Header.tsx`** (Updated)
   - Added automatic user creation as a fallback
   - Better error handling

## Environment Variables Reminder

Make sure these are set in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
3. Redeploy after adding

## Need Help?

If you're still having issues after following these steps:

1. Check the browser console (F12 → Console) for errors
2. Check Supabase logs (Dashboard → Logs)
3. Review the `TROUBLESHOOTING.md` file
4. Share any error messages you see

## Summary Checklist

- [ ] Run Step 1: Enable the database trigger
- [ ] Run Step 2: Fix your existing account
- [ ] Clear browser cache and cookies
- [ ] Test by logging in
- [ ] Verify trigger is enabled in Supabase
- [ ] Verify user record exists in users table
- [ ] Environment variables are set in Vercel
- [ ] Application is redeployed

Once all checkboxes are complete, your sign-in should work perfectly! 🎉
