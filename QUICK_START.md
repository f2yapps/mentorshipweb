# Quick Start Guide

## 🚀 Get Your Platform Running in 5 Minutes

### Step 1: Run SQL Migrations (2 minutes)

Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → **SQL Editor**

**Copy and paste each of these, then click Run:**

#### Migration 1: Enable Auth Trigger
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### Migration 2: Fix Existing Users
```sql
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  au.id, au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  COALESCE((au.raw_user_meta_data->>'role')::TEXT, 'mentee') as role,
  au.created_at, NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

#### Migration 3: Fix RLS Policies
```sql
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Public can view user profiles" ON public.users;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can view user profiles"
  ON public.users FOR SELECT USING (true);
```

#### Migration 4: Seed Categories
```sql
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Academics', 'academics', 'Get help with studies, research, university applications, and academic planning.', 1),
  ('Career', 'career', 'Guidance on job search, career transitions, professional development, and workplace challenges.', 2),
  ('Life', 'life', 'General life advice, personal growth, decision-making, and life transitions.', 3),
  ('Relationships', 'relationships', 'Navigate family, friendships, dating, marriage, and interpersonal relationships.', 4),
  ('Mental Health', 'mental-health', 'Support for stress, anxiety, self-care, and emotional wellbeing.', 5),
  ('Entrepreneurship', 'entrepreneurship', 'Start and grow your business, funding, business planning, and scaling.', 6),
  ('Tech', 'tech', 'Software development, IT careers, coding, and technology guidance.', 7),
  ('Agriculture', 'agriculture', 'Farming techniques, agribusiness, sustainable agriculture, and rural development.', 8),
  ('Leadership', 'leadership', 'Develop leadership skills, team management, and organizational impact.', 9),
  ('Immigration', 'immigration', 'Study abroad, work visas, relocation, and settling in a new country.', 10),
  ('Faith & Purpose', 'faith-purpose', 'Spiritual growth, finding purpose, values, and faith-based guidance.', 11)
ON CONFLICT (slug) DO NOTHING;
```

---

### Step 2: Fix Supabase Settings (1 minute)

#### Update Site URL
1. Go to **Authentication** → **URL Configuration**
2. **Site URL:** `https://your-vercel-app.vercel.app` (replace with your actual URL)
3. **Redirect URLs:** Add both:
   - `https://your-vercel-app.vercel.app/**`
   - `http://localhost:3000/**`
4. Click **Save**

#### Manually Confirm Your Email (if needed)
1. Go to **Authentication** → **Users**
2. Find your user
3. Click three dots (•••)
4. Click **Confirm email**

---

### Step 3: Test Your Platform (2 minutes)

1. **Clear browser cache:**
   - Mac: `Cmd + Shift + Delete`
   - Windows: `Ctrl + Shift + Delete`
   - Select "All time" and clear cookies + cache

2. **Go to your website**

3. **Log in** with your credentials

4. **You should see:**
   - ✅ Your name in the header
   - ✅ "Dashboard" button (not "Log in")
   - ✅ Categories page populated
   - ✅ No 500 errors in console

5. **Complete your profile:**
   - If mentee: Fill out goals and categories
   - If mentor: Fill out expertise and availability

6. **Test the flow:**
   - Browse mentors
   - Send a mentorship request (if mentee)
   - Check your dashboard

---

## ✅ Success Checklist

- [ ] Auth trigger enabled
- [ ] Existing users fixed
- [ ] RLS policies fixed
- [ ] Categories seeded
- [ ] Site URL updated
- [ ] Email confirmed
- [ ] Can sign in successfully
- [ ] See Dashboard button
- [ ] Profile completed
- [ ] No 500 errors

---

## 🆘 Still Having Issues?

### Check Console Errors
1. Press `Cmd + Option + I` (Mac) or `F12` (Windows)
2. Go to **Console** tab
3. Look for red errors
4. Share them for help

### Verify Database
Run this to check everything:

```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if your user exists
SELECT 
  au.email,
  CASE WHEN pu.id IS NULL THEN '❌ MISSING' ELSE '✅ EXISTS' END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email_confirmed_at IS NOT NULL;

-- Check categories
SELECT COUNT(*) FROM public.categories;
```

Expected results:
- Trigger: 1 row
- User status: ✅ EXISTS
- Categories: 11

---

## 📚 More Help

- **`FIXES_APPLIED.md`** - Detailed list of all fixes
- **`TROUBLESHOOTING.md`** - Common issues and solutions
- **`SETUP_SUMMARY.md`** - Comprehensive setup guide
- **`supabase/README.md`** - Database setup details

---

## 🎉 You're Done!

Your mentorship platform is now fully functional and ready to use!

**What you have:**
- ✅ User authentication
- ✅ Mentor/mentee profiles
- ✅ Mentorship requests
- ✅ Dashboards
- ✅ Search and filters
- ✅ 11 mentorship categories
- ✅ Responsive design
- ✅ Row-level security

**Next steps:**
- Invite mentors to join
- Promote to mentees
- Monitor requests in admin dashboard
- Consider optional enhancements (see `FIXES_APPLIED.md`)

Good luck with your mentorship platform! 🚀
