# Setup Instructions - Fixing the Application Error

## Problem

You're seeing "Application error: a server-side exception has occurred" because your Supabase environment variables appear to be incomplete or invalid.

## Current .env.local values (INCOMPLETE):

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvnsfdhzjrhawijsgtau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here-truncated-example
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here-truncated-example
```

**Note:** These keys look truncated. A valid Supabase anon key is typically 200+ characters long.

## Solution

### Step 1: Get Your Real Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one if you don't have one)
3. Click on the **Settings** icon (gear icon) in the left sidebar
4. Click on **API** in the settings menu
5. You'll see:
   - **Project URL** - Copy this entire URL
   - **Project API keys** section with:
     - `anon` `public` key - Copy this (it's very long, ~200 characters)
     - `service_role` `secret` key - Copy this if you need it

### Step 2: Update Your .env.local File

Replace the contents of `.env.local` with your actual credentials:

```env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6I...YOUR_FULL_ANON_KEY...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6I...YOUR_FULL_SERVICE_KEY...
```

**Important:** 
- The anon key should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.` and be very long
- Make sure to copy the ENTIRE key, not just part of it
- Don't add quotes around the values
- Don't commit this file to git (it's already in .gitignore)

### Step 3: Restart Your Development Server

1. Stop the current dev server (Ctrl+C in the terminal)
2. Run `npm run dev` again
3. Open your browser to http://localhost:3000

## Alternative: Use a Test/Demo Supabase Project

If you don't have a Supabase project yet:

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create a new project:
   - Choose a name
   - Create a strong database password (save it!)
   - Select a region close to you
   - Wait for the project to be created (~2 minutes)
5. Follow Step 1 above to get your credentials

## Verify It's Working

After updating your credentials and restarting:

1. The home page should load without errors
2. You should be able to click "Log in" or "Get Started"
3. Check the browser console (F12) - there should be no Supabase-related errors

## Still Having Issues?

Check:
- [ ] Did you copy the COMPLETE anon key? (should be ~200 characters)
- [ ] Did you restart the dev server after updating .env.local?
- [ ] Is your Supabase project active and not paused?
- [ ] Are there any typos in the .env.local file?
- [ ] Did you remove any quotes around the values?

## Need Help?

If you're still seeing errors:
1. Check the terminal where `npm run dev` is running for error messages
2. Check the browser console (F12 → Console tab) for errors
3. The custom error page should now show you the specific error message
