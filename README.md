# 🌍 Global Mentorship & Professional Development Platform

A production-ready digital ecosystem connecting volunteer mentors and mentees across Ethiopia, Africa, and globally. This platform enables professionals to guide others, share knowledge, track mentorship impact, and publish achievements, research, and success stories.

## 🎯 Mission

Create a living platform where professionals guide others, share knowledge, track mentorship impact, and publish achievements, research, and success stories—NOT just a directory.

## ✨ Key Features

### 👤 Professional Profile System
- **Rich LinkedIn-style profiles** with education, experience, certifications
- **Impact metrics** auto-calculated (mentees supported, completed mentorships, community contributions)
- **Availability scheduling** with timezone-aware calendar
- **External links** (Zoom, WhatsApp, LinkedIn, Google Scholar, YouTube, Calendly)
- **Profile photos** uploaded to Supabase Storage
- **Professional details** (current position, organization, languages, timezone)

### 🤝 Mentorship Matching & Tracking
- **Advanced search** by category, country, language, availability
- **Request system** with goals, background, preferred frequency
- **Progress tracking** with sessions, milestones, outcomes
- **Session notes** for both mentor and mentee
- **Mentorship lifecycle**: Requested → Active → In Progress → Completed

### 📚 Knowledge & Media Sharing
- **Research publications** with PDF uploads and DOI links
- **Success stories** with rich text, images, and tags
- **Media posts** (videos, audio, photos)
- **Resource library** (documents, slides, training materials)
- **Full-text search** across all content

### 🌍 Community Impact Feed
- **Public activity stream** showing:
  - New mentors/mentees joined
  - Mentorships started/completed
  - Publications and success stories shared
  - Milestones reached
- **Inspiration and transparency** for the community

### 📊 Comprehensive Dashboards
- **Mentor Dashboard**: Requests inbox, active mentees, impact stats, resource publishing
- **Mentee Dashboard**: Requested mentors, session history, progress tracking
- **Admin Dashboard**: Analytics, content moderation, user management

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password, OAuth-ready)
- **Storage**: Supabase Storage (profile images, publications, media, resources)
- **Security**: Row Level Security (RLS) enabled
- **Deployment**: Vercel

## 📁 Project Structure

```
/app
  /(public)         # Public pages (home, about, categories)
  /(auth)           # Authentication pages (login, register, onboarding)
  /(dashboard)      # Protected dashboard pages
  /(profile)        # User profile pages
  /(mentorship)     # Mentorship management
  /(community)      # Community feed and resources

/components
  /auth             # Authentication components
  /dashboard        # Dashboard components
  /layout           # Layout components (header, footer)
  /mentors          # Mentor-related components
  /profile          # Profile management components
  /upload           # File upload components
  /ui               # Reusable UI components

/lib
  /supabase         # Supabase client utilities
  utils.ts          # Utility functions
  storage.ts        # Storage/upload utilities

/types
  database.ts       # TypeScript database types

/supabase
  /migrations       # Database migration files
  schema.sql        # Complete database schema
  storage-setup.sql # Storage bucket setup
  seed.sql          # Seed data
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd MentorshipWeb
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com

2. Run the database migrations:
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/schema.sql` (base schema)
   - Run `supabase/migrations/004_comprehensive_schema.sql` (comprehensive schema)
   - Run `supabase/migrations/003_seed_categories.sql` (seed categories)

3. Set up Storage buckets:
   - Go to Supabase Dashboard → Storage
   - Run `supabase/storage-setup.sql` in SQL Editor
   - Or manually create buckets: `profile-images`, `publications`, `media`, `resources`

4. Enable Auth trigger:
   ```sql
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

### 3. Configure Environment Variables

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Service role key (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from: Supabase Dashboard → Settings → API

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 📦 Database Schema

### Core Tables

- **users** - User profiles with professional information
- **education** - Education history
- **experience** - Work experience
- **certifications** - Professional certifications
- **external_links** - Social and professional links
- **categories** - Mentorship categories
- **mentors** - Mentor-specific profiles with impact metrics
- **mentees** - Mentee-specific profiles
- **availability_slots** - Mentor availability schedule

### Mentorship Tables

- **mentorship_requests** - Mentorship requests and status
- **mentorship_sessions** - Session tracking with notes
- **mentorship_milestones** - Goal milestones
- **mentorship_outcomes** - Final outcomes and reflections
- **reviews** - Mentor reviews and ratings

### Knowledge Sharing Tables

- **publications** - Research publications
- **success_stories** - Success stories and case studies
- **media_posts** - Videos, audio, images
- **resources** - Downloadable resources

### Community Tables

- **activity_feed** - Public activity stream
- **notifications** - User notifications

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS policies enabled:

- **Users** can view/edit their own data
- **Public** can view published content (publications, stories, mentor profiles)
- **Mentors** can view mentees who requested them
- **Participants** can view/edit their mentorship sessions
- **Admins** have full access

### Storage Security

- Users can only upload to their own folders
- Public read access for all buckets
- File type and size validation
- Organized by user ID: `bucket/userId/file.ext`

## 🎨 UI/UX Design Principles

- **Professional + Warm + African + Global** aesthetic
- **Mobile-first** responsive design
- **Accessible** typography and color contrast
- **Meaningful empty states** encouraging volunteering
- **Impact-focused** metrics and visualizations

## 📊 Key Features Implementation Status

### ✅ Completed

- [x] Comprehensive database schema with 20+ tables
- [x] TypeScript types for all database entities
- [x] Supabase Storage setup with 4 buckets
- [x] File upload utilities with validation
- [x] Image upload and compression
- [x] Utility functions (formatting, validation, etc.)
- [x] Row Level Security policies
- [x] Automatic activity feed triggers
- [x] Notification system
- [x] Impact metrics calculation

### 🚧 In Progress

- [ ] Professional profile editor (education, experience, certifications)
- [ ] Mentorship session tracking interface
- [ ] Success story rich text editor
- [ ] Publication upload and management
- [ ] Community impact feed UI
- [ ] Enhanced mentor search with filters
- [ ] Dashboard with impact metrics
- [ ] Admin panel for content moderation

### 📋 Planned

- [ ] Real-time notifications with Supabase Realtime
- [ ] Email notifications for mentorship requests
- [ ] Calendar integration (Google Calendar, Calendly)
- [ ] Video call integration (Zoom, Google Meet)
- [ ] Mobile app (React Native)
- [ ] AI-powered mentor matching
- [ ] Multilingual support (Amharic, French, Swahili)

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub

2. Import project in Vercel:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY` (optional)

4. Deploy:
   ```bash
   vercel --prod
   ```

### Post-Deployment Checklist

- [ ] Verify Supabase connection
- [ ] Test authentication flow
- [ ] Verify file uploads work
- [ ] Check RLS policies are active
- [ ] Test mentor search and filtering
- [ ] Verify email notifications (if configured)
- [ ] Check mobile responsiveness
- [ ] Test all user roles (mentor, mentee, admin)

## 📈 Monitoring & Analytics

### Supabase Dashboard

- Monitor database performance
- Track storage usage
- View authentication logs
- Monitor RLS policy effectiveness

### Vercel Analytics

- Page views and performance
- User engagement metrics
- Error tracking
- Core Web Vitals

## 🤝 Contributing

This is a production platform serving real mentors and mentees. Contributions should:

1. Follow TypeScript best practices
2. Include proper error handling
3. Maintain RLS security
4. Be mobile-responsive
5. Include tests where appropriate

## 📝 License

[Your License Here]

## 🙏 Acknowledgments

Built to empower youth in developing countries through mentorship, knowledge sharing, and professional development.

---

## 🆘 Support

For issues or questions:
1. Check the documentation above
2. Review Supabase logs for errors
3. Check browser console for client-side errors
4. Verify environment variables are set correctly

## 🔗 Important Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Version**: 1.0.0  
**Last Updated**: February 2026
