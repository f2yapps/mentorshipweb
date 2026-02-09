# Mentorship Platform

A full-stack mentorship website connecting volunteer mentors with mentees across Ethiopia, Africa, and the world. Built with **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, and **Supabase** (Auth, Database, Row Level Security), ready for deployment on **Vercel**.

## Features

- **Authentication**: Email/password via Supabase Auth; role-based access (mentor, mentee, admin).
- **Public pages**: Home, About, How It Works, Categories, Mentor Directory (search/filter), Contact.
- **Mentor flow**: Registration, profile (expertise, availability, languages), dashboard to view/accept/decline requests.
- **Mentee flow**: Registration, profile (goals, preferred categories), request mentorship, dashboard for request status.
- **Admin**: View users, approve/flag mentors, view platform statistics.
- **UI**: Clean, accessible, mobile-first design with an Africa-friendly warm color palette.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, RLS)
- **Vercel** (deployment)

## Project Structure

```
/app
  /page.tsx              # Home
  /about, /how-it-works, /categories, /mentors, /contact
  /auth/login, /auth/register, /auth/mentor, /auth/mentee
  /dashboard/mentor, /dashboard/mentee, /dashboard/admin
  /mentors/[id]/request  # Request mentorship (mentee)
/components
  layout/Header, Footer
  auth/LoginForm, RegisterForm, MentorOnboardingForm, MenteeOnboardingForm
  mentors/MentorCard, MentorDirectoryFilters, RequestMentorshipForm
  dashboard/MentorDashboardRequests, MenteeDashboardRequests, AdminStats, AdminUsersList, AdminMentorsList
/lib/supabase
  server.ts   # Server client
  client.ts   # Browser client
  middleware.ts
/types
  database.ts # DB types
/supabase
  schema.sql  # Tables, RLS, triggers
  seed.sql    # Categories sample data
```

## Setup

### 1. Clone and install

```bash
cd MentorshipWeb
npm install
```

### 2. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Database schema and seed

1. In Supabase **SQL Editor**, run the contents of `supabase/schema.sql` (creates tables, RLS, triggers).
2. Run `supabase/seed.sql` to insert categories (Academics, Career, Life, etc.).
3. **Auth trigger**: To create a `public.users` row on signup, run this in the SQL Editor (if you get permission errors, run it via **Database → Extensions** or Supabase CLI with service role):

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Create an admin user (optional)

1. Sign up a user via the app.
2. In Supabase **Table Editor → users**, set that user's `role` to `admin`.
3. Log in as that user to access `/dashboard/admin`.

## Deployment (Vercel)

1. Push the repo to GitHub and import the project in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel **Environment Variables**.
3. Deploy. The app uses the Supabase client directly (no mock APIs).

## Categories (from seed)

Academics, Career, Life, Relationships, Mental Health, Entrepreneurship, Tech, Agriculture, Leadership, Immigration, Faith & Purpose.

## License

MIT.
