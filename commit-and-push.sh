#!/bin/bash
# One-time script: add app + build files, commit, and push for Vercel deployment.
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock

echo "Staging app, components, lib, types..."
git add app components lib types

echo "Staging config and package files..."
git add next.config.js postcss.config.js tailwind.config.ts tsconfig.json .gitignore .eslintrc.json package.json package-lock.json

echo "Staging supabase migrations..."
git add supabase/migrations

echo "Committing..."
git commit -m "Add app and build files for Vercel deployment"

echo "Pushing to origin main..."
git push origin main

echo "Done. Vercel will pick up the new commit and rebuild."
