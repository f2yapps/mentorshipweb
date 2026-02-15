# Supabase Database Setup

This folder contains SQL migrations for setting up your Supabase database.

## Quick Start Guide

If you're experiencing the "still showing Log In button after signup" issue, follow these steps:

### Step 1: Enable the Auth Trigger (Required)

This trigger automatically creates a user record when someone signs up.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `migrations/001_create_user_trigger.sql`
6. Click **Run** or press `Ctrl/Cmd + Enter`
7. You should see: "Success. No rows returned"

### Step 2: Fix Existing Users (If Applicable)

If you already created accounts before enabling the trigger, run this:

1. In **SQL Editor**, click **New Query**
2. Copy and paste the contents of `migrations/002_fix_existing_users.sql`
3. Click **Run**
4. You should see how many users were fixed

### Step 3: Test the Fix

**Option A - Existing Account:**
1. Clear your browser cache and cookies
2. Go to your application
3. Log in with your credentials
4. You should now see your name and "Dashboard" button

**Option B - New Account:**
1. Create a new test account
2. Verify the email
3. Log in
4. You should see your name and "Dashboard" button immediately

## What These Migrations Do

### Migration 001: Create User Trigger
- Enables automatic user record creation in `public.users` table
- Triggered when a new user signs up via Supabase Auth
- Copies `name` and `role` from signup form metadata

### Migration 002: Fix Existing Users
- Creates user records for any auth users missing from `public.users`
- Only processes confirmed email accounts
- Safe to run multiple times (won't create duplicates)

## Verification

### Check if Trigger is Active
1. Go to **Database** → **Triggers** in Supabase Dashboard
2. Look for `on_auth_user_created` trigger
3. It should be enabled on the `auth.users` table

### Check if User Records Exist
1. Go to **Table Editor** → **users** table
2. You should see a row for each signed-up user
3. The `id` should match the `auth.users` table

## Troubleshooting

See the main [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) file in the root directory for detailed troubleshooting steps.

### Quick Checks

**Trigger not working?**
```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**User record missing?**
```sql
-- Check auth users vs public users
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  CASE WHEN pu.id IS NULL THEN 'MISSING' ELSE 'EXISTS' END as user_record_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;
```

**Manual user creation:**
```sql
-- Get your user ID first
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'your-email@example.com';

-- Then create the user record (replace the values)
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
VALUES (
  'YOUR-USER-ID-HERE',
  'your-email@example.com',
  'Your Name',
  'mentee',  -- or 'mentor'
  NOW(),
  NOW()
);
```
