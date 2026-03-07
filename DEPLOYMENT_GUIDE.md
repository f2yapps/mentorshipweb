# 🚀 Deployment Guide - Production Checklist

Complete guide for deploying the Global Mentorship Platform to production.

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup ✅

#### Database Setup

- [ ] Create Supabase project at https://supabase.com
- [ ] Note down project URL and keys
- [ ] Run base schema: `supabase/schema.sql`
- [ ] Run comprehensive schema: `supabase/migrations/004_comprehensive_schema.sql`
- [ ] Run category seed: `supabase/migrations/003_seed_categories.sql`
- [ ] Verify all tables created successfully
- [ ] Check RLS policies are enabled

#### Storage Setup

- [ ] Create storage buckets:
  - `profile-images` (5MB limit, images only)
  - `publications` (50MB limit, documents)
  - `media` (500MB limit, video/audio/images)
  - `resources` (50MB limit, documents)
- [ ] Run storage policies: `supabase/storage-setup.sql`
- [ ] Test file upload to each bucket
- [ ] Verify public access works

#### Authentication Setup

- [ ] Enable email/password authentication
- [ ] Configure email templates (optional)
- [ ] Set up auth trigger:
  ```sql
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  ```
- [ ] Test user registration flow
- [ ] Test login flow

### 2. Environment Variables ✅

#### Local Development (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Production (Vercel)

- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` in Vercel (optional)
- [ ] Set environment for: Production, Preview, Development

### 3. Code Quality ✅

- [ ] Run `npm run lint` - fix all errors
- [ ] Run `npm run build` - ensure successful build
- [ ] Test all critical user flows locally
- [ ] Check mobile responsiveness
- [ ] Test file uploads work
- [ ] Verify authentication works
- [ ] Check database queries are optimized

### 4. Security Checklist ✅

- [ ] All RLS policies enabled and tested
- [ ] Service role key not exposed to client
- [ ] File upload validation working
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CORS configured correctly
- [ ] Rate limiting considered (Supabase handles this)

---

## 🚀 Deployment Steps

### Option 1: Deploy with Vercel (Recommended)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial production deployment"
git push origin main
```

#### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

#### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to Settings → Environment Variables
2. Add each variable:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY (optional)
   ```
3. Select environments: Production, Preview, Development

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Visit your production URL

#### Step 5: Verify Deployment

- [ ] Site loads successfully
- [ ] Authentication works (sign up, login, logout)
- [ ] Database queries work
- [ ] File uploads work
- [ ] All pages load without errors
- [ ] Mobile responsiveness works
- [ ] Check browser console for errors

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

### 2. Supabase URL Allowlist

1. Go to Supabase → Settings → API
2. Add your Vercel domain to allowed origins:
   ```
   https://your-app.vercel.app
   https://your-custom-domain.com
   ```

### 3. Email Configuration (Optional)

If using custom email provider:

1. Go to Supabase → Authentication → Email Templates
2. Configure SMTP settings
3. Customize email templates:
   - Confirmation email
   - Password reset
   - Magic link

### 4. Analytics Setup (Optional)

#### Vercel Analytics

1. Go to Vercel → Analytics
2. Enable Analytics
3. View metrics in dashboard

#### Google Analytics (Optional)

```typescript
// /app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 🧪 Production Testing Checklist

### Critical User Flows

#### Authentication
- [ ] Sign up as mentor
- [ ] Sign up as mentee
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials (should fail)
- [ ] Logout
- [ ] Password reset (if implemented)

#### Profile Management
- [ ] Upload profile picture
- [ ] Update basic profile info
- [ ] Add education entry
- [ ] Add experience entry
- [ ] View public profile

#### Mentorship Flow
- [ ] Browse mentors
- [ ] Filter mentors by category
- [ ] View mentor profile
- [ ] Send mentorship request
- [ ] Mentor receives notification
- [ ] Mentor accepts request
- [ ] Mentee receives notification
- [ ] View active mentorship

#### File Uploads
- [ ] Upload profile image (< 5MB)
- [ ] Upload profile image (> 5MB) - should fail
- [ ] Upload invalid file type - should fail
- [ ] Verify uploaded files are publicly accessible

#### Dashboards
- [ ] Mentor dashboard loads
- [ ] Mentee dashboard loads
- [ ] Admin dashboard loads (if admin user)
- [ ] Statistics display correctly

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] No console errors
- [ ] No 404 errors
- [ ] Database queries are fast (< 500ms)

### Mobile Testing

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Navigation works on mobile
- [ ] Forms are usable on mobile
- [ ] Images display correctly on mobile

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 📊 Monitoring & Maintenance

### Supabase Dashboard Monitoring

Check regularly:

1. **Database**
   - Query performance
   - Table sizes
   - Index usage
   - Slow queries

2. **Storage**
   - Storage usage
   - Bandwidth usage
   - File access patterns

3. **Authentication**
   - Daily active users
   - Sign-up rate
   - Failed login attempts

4. **API**
   - Request count
   - Error rate
   - Response times

### Vercel Dashboard Monitoring

Check regularly:

1. **Analytics**
   - Page views
   - Unique visitors
   - Top pages
   - Geographic distribution

2. **Performance**
   - Core Web Vitals
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

3. **Errors**
   - Runtime errors
   - Build errors
   - Function errors

### Error Tracking (Optional)

Consider integrating:

- **Sentry** for error tracking
- **LogRocket** for session replay
- **Hotjar** for user behavior

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **main branch** → Production
- **other branches** → Preview deployments

### Deployment Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push origin feature/new-feature

# 4. Vercel creates preview deployment
# Test the preview URL

# 5. Merge to main when ready
git checkout main
git merge feature/new-feature
git push origin main

# 6. Vercel deploys to production automatically
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. "Supabase client error"

**Problem:** Environment variables not set

**Solution:**
- Verify environment variables in Vercel
- Redeploy after adding variables
- Check variable names are correct (including `NEXT_PUBLIC_` prefix)

#### 2. "File upload fails"

**Problem:** Storage bucket not configured or RLS policy issue

**Solution:**
- Verify storage buckets exist in Supabase
- Check storage policies are applied
- Verify file size and type are within limits
- Check browser console for specific error

#### 3. "Authentication not working"

**Problem:** Auth trigger not set up or RLS policies blocking

**Solution:**
- Verify auth trigger exists in Supabase
- Check RLS policies on users table
- Verify email confirmation is not required (or is handled)

#### 4. "Database query fails"

**Problem:** RLS policy blocking query

**Solution:**
- Check RLS policies for the table
- Verify user is authenticated
- Check if user has permission for the operation
- Review Supabase logs for specific error

#### 5. "Build fails on Vercel"

**Problem:** TypeScript errors or missing dependencies

**Solution:**
- Run `npm run build` locally to see errors
- Fix TypeScript errors
- Verify all dependencies are in package.json
- Check Node.js version compatibility

---

## 📈 Scaling Considerations

### When to Upgrade

Monitor these metrics:

1. **Database**
   - > 500MB database size → Consider paid plan
   - > 2GB bandwidth/month → Consider paid plan
   - Slow queries → Add indexes or optimize

2. **Storage**
   - > 1GB files → Consider paid plan
   - > 2GB bandwidth/month → Consider paid plan

3. **Authentication**
   - > 50,000 MAU → Consider paid plan

4. **Vercel**
   - > 100GB bandwidth/month → Consider Pro plan
   - > 6,000 build minutes/month → Consider Pro plan

### Performance Optimization

1. **Database**
   - Add indexes on frequently queried columns
   - Use database functions for complex queries
   - Implement pagination for large lists
   - Cache frequently accessed data

2. **Images**
   - Use Next.js Image component
   - Compress images before upload
   - Use appropriate image formats (WebP)
   - Implement lazy loading

3. **Code**
   - Code splitting with dynamic imports
   - Minimize bundle size
   - Use React Server Components where possible
   - Implement caching strategies

---

## ✅ Launch Checklist

Final checks before announcing:

- [ ] All critical features working
- [ ] Mobile experience is good
- [ ] Load testing completed
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Documentation complete
- [ ] Team trained on admin functions
- [ ] Support channels ready
- [ ] Marketing materials prepared
- [ ] Social media posts scheduled
- [ ] Press release ready (if applicable)

---

## 🎉 Post-Launch

### Week 1
- [ ] Monitor errors closely
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Monitor performance metrics

### Week 2-4
- [ ] Analyze user behavior
- [ ] Identify pain points
- [ ] Plan improvements
- [ ] Implement quick wins

### Ongoing
- [ ] Weekly metrics review
- [ ] Monthly feature planning
- [ ] Quarterly roadmap updates
- [ ] Regular security audits

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Next.js Discord**: https://nextjs.org/discord

---

**Remember:** Start small, monitor closely, and scale as needed. The platform is designed to grow with your community!

Good luck with your launch! 🚀
