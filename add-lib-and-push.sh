#!/bin/bash
# Add the lib folder so Vercel build can resolve @/lib/supabase/server and @/lib/supabase/errors
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock 2>/dev/null || true

echo "Adding lib..."
git add lib

echo "Committing..."
git commit -m "Add lib (Supabase client, server, errors) for Vercel build"

echo "Pushing to origin main..."
git push origin main

echo "Done. Vercel will rebuild and should resolve @/lib/supabase/*."
