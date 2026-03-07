(base) fitsumteshome@Fitsums-MacBook-Air MentorshipWeb % cd /Users/fitsumteshome/Desktop/MentorshipWeb
rm -f .git/index.lock
git add app components lib types next.config.js postcss.config.js tailwind.config.ts tsconfig.json .gitignore .eslintrc.json package.json package-lock.json supabase/migrations
git commit -m "Add app and build files for Vercel deployment"
git push origin main
fatal: .git/index: index file smaller than expected