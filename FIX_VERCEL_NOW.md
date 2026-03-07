# One-time fix: make MentorshipWeb its own repo and push

Your git repo root is your **home folder**, so pushes from MentorshipWeb never sent this project’s files. Do this **once** so MentorshipWeb is the repo and GitHub gets the right code.

## Steps (run in Terminal)

```bash
cd /Users/fitsumteshome/Desktop/MentorshipWeb

# 1. Make this folder its own repo (ignore the parent .git)
git init

# 2. Point at GitHub (same repo as now)
git remote add origin https://github.com/f2yapps/mentorshipweb.git

# 3. Fetch current main so we can match it
git fetch origin main

# 4. Use GitHub’s current main as base, then add our files on top
git reset --soft origin/main
git add app components lib types next.config.js postcss.config.js tailwind.config.ts .gitignore .eslintrc.json package.json package-lock.json supabase tsconfig.json
git status
# You should see only project files (app, components, lib, etc.), nothing from ../../

# 5. Commit
git commit -m "Add full project with app and lib for Vercel"

# 6. Push (overwrites main with this commit)
git push origin main --force
```

After step 6, Vercel will redeploy and the build should pass (it will see `app`, `lib`, and the path alias in `tsconfig.json`).

---

**If you don’t want to force-push:**  
Use a new branch and set Vercel to deploy that branch:

```bash
git checkout -b deploy-with-lib
git push -u origin deploy-with-lib
```

Then in Vercel: Project → Settings → Git → Production Branch → set to `deploy-with-lib` and Save.
