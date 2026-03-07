# Database Schema Changelog

## 2026-02-16 - Fixed Reserved Keyword Issue

### Problem
PostgreSQL reserved keyword `current_role` was causing syntax error.

### Solution
Renamed column from `current_role` to `current_position` in:
- ✅ `SETUP_DATABASE.sql`
- ✅ `migrations/004_comprehensive_schema.sql`
- ✅ `types/database.ts`

### Impact
- No breaking changes for new installations
- Column name is now: `current_position`
- TypeScript types updated to match

### Migration Note
If you already ran the old script, you can rename the column:
```sql
ALTER TABLE public.users RENAME COLUMN current_role TO current_position;
```

---

## Initial Schema - 2026-02-16

### Created Tables (20+)
- users, categories, education, experience, certifications
- external_links, mentors, mentees, availability_slots
- mentorship_requests, mentorship_sessions, mentorship_milestones, mentorship_outcomes
- reviews, publications, success_stories, media_posts, resources
- activity_feed, notifications

### Features
- ✅ Row Level Security enabled on all tables
- ✅ Full-text search indexes
- ✅ Automatic triggers (updated_at, auth)
- ✅ Impact metrics calculation
- ✅ 12 categories seeded
