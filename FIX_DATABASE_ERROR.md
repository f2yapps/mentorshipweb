# 🔧 Fix: "relation public.users does not exist" Error

## ❌ The Problem

You're seeing this error because the database tables haven't been created yet in your Supabase project.

```
ERROR: relation "public.users" does not exist
```

## ✅ The Solution (5 minutes)

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Run the Setup Script

1. Open the file: `supabase/SETUP_DATABASE.sql` (I just created this)
2. **Copy ALL the contents** of that file
3. **Paste** into the Supabase SQL Editor
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. Wait 10-20 seconds for it to complete

You should see: `Database setup complete! ✅`

### Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **"Table Editor"** (left sidebar)
2. You should now see all these tables:
   - ✅ users
   - ✅ categories
   - ✅ mentors
   - ✅ mentees
   - ✅ education
   - ✅ experience
   - ✅ certifications
   - ✅ external_links
   - ✅ mentorship_requests
   - ✅ mentorship_sessions
   - ✅ mentorship_milestones
   - ✅ mentorship_outcomes
   - ✅ reviews
   - ✅ publications
   - ✅ success_stories
   - ✅ media_posts
   - ✅ resources
   - ✅ activity_feed
   - ✅ notifications
   - ✅ availability_slots

### Step 4: Test Your App

1. Go back to your app: http://localhost:3000
2. Try signing up as a mentor or mentee
3. The error should be gone! ✅

## 🎯 What This Script Does

The `SETUP_DATABASE.sql` script does EVERYTHING in one go:

1. ✅ Creates all 20+ tables
2. ✅ Creates all indexes for fast queries
3. ✅ Sets up Row Level Security (RLS)
4. ✅ Creates all RLS policies
5. ✅ Sets up triggers (updated_at, auth)
6. ✅ Seeds categories with 12 tech-focused areas

## 🆘 Still Getting Errors?

### Error: "permission denied for schema auth"

This is normal! The auth trigger will be created automatically. You can ignore this specific error.

### Error: "relation already exists"

This means tables are already created. You're good! Just refresh your app.

### Error: "syntax error"

Make sure you copied the ENTIRE contents of `SETUP_DATABASE.sql` - from the very first line to the very last line.

## 📋 Alternative: Run Scripts Separately

If you prefer to run scripts one by one:

1. Run `supabase/schema.sql` first
2. Then run `supabase/migrations/004_comprehensive_schema.sql`
3. Then run `supabase/migrations/003_seed_categories.sql`

But the `SETUP_DATABASE.sql` does all of this in one go!

## ✅ After Database Setup

Once your database is set up, you can:

1. ✅ Sign up as mentor/mentee
2. ✅ Create profile
3. ✅ Browse mentors
4. ✅ Send mentorship requests
5. ✅ Upload files (once storage is set up)

## 🚀 Next: Set Up Storage Buckets

After database is working, set up file uploads:

1. In Supabase Dashboard, go to **Storage**
2. Run the SQL from `supabase/storage-setup.sql`
3. Or manually create 4 buckets:
   - profile-images
   - publications
   - media
   - resources

## 💡 Pro Tip

Save the `SETUP_DATABASE.sql` file! If you ever need to:
- Set up a new Supabase project
- Reset your database
- Set up a staging environment

Just run this one file and everything is ready!

---

**That's it! Your database should now be working perfectly.** 🎉
