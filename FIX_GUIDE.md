# 🔧 Fix Guide - Resolve All Issues Before Deployment

## Issues Fixed ✅

### 1. ✅ Mentor Not Appearing in Directory
**Problem**: After registering as a mentor, you couldn't see yourself in the mentor list.

**Solution**: Modified `/app/mentors/page.tsx` to allow users to see their own unverified mentor profile. Verified mentors are publicly visible, but you can always see your own profile regardless of verification status.

### 2. ✅ Long Dashes Replaced
**Problem**: Admin dashboards used long dashes (—) instead of short dashes (-).

**Solution**: Replaced all long dashes with short dashes in:
- `/components/dashboard/AdminUsersList.tsx`
- `/components/dashboard/AdminMentorsList.tsx`

## Issues Requiring Database Setup ⚠️

### 3. Media Upload & Edit Profile Errors

**Problem**: Server error "Application error: a server-side exception has occurred (Digest: 3159136797)" when:
- Uploading media
- Editing profile (adding education, experience, certifications, social links)

**Root Cause**: Missing database tables from the comprehensive schema.

**Solution**: Run the comprehensive database migration

#### Steps to Fix:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Comprehensive Schema Migration**
   - Open the file: `supabase/migrations/004_comprehensive_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify Tables Were Created**
   After running the migration, these tables should exist:
   - ✅ `education` - For education history
   - ✅ `experience` - For work experience
   - ✅ `certifications` - For professional certifications
   - ✅ `external_links` - For social/professional links (Zoom, WhatsApp, LinkedIn, etc.)
   - ✅ `media_posts` - For photos, videos, audio uploads
   - ✅ `publications` - For research papers
   - ✅ `success_stories` - For success stories
   - ✅ `resources` - For downloadable resources
   - ✅ `availability_slots` - For mentor availability
   - ✅ `mentorship_sessions` - For tracking sessions
   - ✅ `mentorship_milestones` - For goal tracking
   - ✅ `mentorship_outcomes` - For completed mentorships
   - ✅ `activity_feed` - For community activity
   - ✅ `notifications` - For user notifications

5. **Verify Storage Buckets**
   - Go to "Storage" in the left sidebar
   - Verify these buckets exist:
     - `profile-images`
     - `publications`
     - `media`
     - `resources`
   
   If missing, run `supabase/storage-setup.sql` in SQL Editor or create them manually with public access.

6. **Test the Fixes**
   - Try uploading media at `/media/upload`
   - Try adding education/experience at `/profile/edit`
   - Both should work without errors now

## How to Verify Admin Access

To approve mentors (make them visible in the directory):

1. **Check Your User Role**
   ```sql
   SELECT id, name, email, role FROM users WHERE email = 'your-email@example.com';
   ```

2. **Grant Yourself Admin Role** (if needed)
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. **Access Admin Dashboard**
   - Go to `/dashboard/admin`
   - You should see all users and mentors
   - Click "Approve" next to unverified mentors to make them visible in the directory

## Testing Checklist Before Deployment

Run through these tests to ensure everything works:

### Authentication & Profiles
- [ ] Register as mentee
- [ ] Register as mentor
- [ ] Login works
- [ ] Logout works
- [ ] Can view own profile

### Mentor Features
- [ ] Complete mentor onboarding form
- [ ] Can see own mentor profile in directory (even if unverified)
- [ ] Admin can verify mentor
- [ ] Verified mentor appears in public directory
- [ ] Can filter mentors by category, country, language

### Profile Editing
- [ ] Can add education
- [ ] Can add work experience
- [ ] Can add certifications
- [ ] Can add social/professional links (Zoom, WhatsApp, LinkedIn, etc.)
- [ ] Profile displays correctly

### Media & Content
- [ ] Can upload photos
- [ ] Can upload videos
- [ ] Can upload audio
- [ ] Uploaded media appears in media gallery
- [ ] Can view media posts

### Mentorship Flow
- [ ] Mentee can request mentorship
- [ ] Mentor receives request in dashboard
- [ ] Mentor can accept/decline request
- [ ] Both can see active mentorships

### Admin Features
- [ ] Admin can view all users
- [ ] Admin can verify/unverify mentors
- [ ] Admin can see statistics

## Environment Variables Check

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional, for server-side operations)
```

## Common Issues & Solutions

### Issue: "relation does not exist" error
**Solution**: You haven't run the comprehensive schema migration. Follow step 3 above.

### Issue: Storage upload fails
**Solution**: Check that storage buckets exist and have proper policies. Run `supabase/storage-setup.sql`.

### Issue: Can't see mentor profile after registration
**Solution**: This is now fixed. You should see your own profile immediately, even if unverified. Other users will only see you after admin approval.

### Issue: RLS policy prevents access
**Solution**: Ensure you're logged in with the correct account. Check RLS policies in Supabase Dashboard → Authentication → Policies.

## Quick Database Setup Script

You can also run the database check script:

```bash
node check-database.js
```

This will verify which tables exist and which are missing.

## Need Help?

1. Check Supabase logs: Dashboard → Logs → API Logs
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure you've run all SQL migrations

## Summary

✅ **Fixed Issues:**
- Mentor not appearing in list after registration
- Long dashes replaced with short dashes

⚠️ **Requires Action:**
- Run database migration: `supabase/migrations/004_comprehensive_schema.sql`
- Verify storage buckets exist
- Grant yourself admin role to approve mentors
- Test all features before deployment

Once you complete the database setup, all errors should be resolved! 🎉
