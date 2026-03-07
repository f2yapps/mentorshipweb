# Push `lib` using a clean clone (fix for wrong repo root and "short read")

Your current **MentorshipWeb** folder is inside a git repo whose root is your **home directory** (`/Users/fitsumteshome`). So when you run `git add` from MentorshipWeb, git is using that big repo and can hit "short read" / index errors. The fix is to use a **separate clone** where the repo root is the project, then copy `lib` in and push.

Do this **once** from Terminal:

---

## Step 1: Clone the repo into a new folder (clean repo root)

```bash
cd ~/Desktop
git clone https://github.com/f2yapps/mentorshipweb.git mentorshipweb-push
cd mentorshipweb-push
```

Now the repo root is `~/Desktop/mentorshipweb-push` (only this project).

---

## Step 2: Copy your `lib` folder into the clone

```bash
cp -r ../MentorshipWeb/lib .
```

---

## Step 3: Add, commit, and push

```bash
git add lib
git status
# You should see only "lib" and maybe a few files - nothing from ../../ or other projects.

git commit -m "Add lib for Vercel build"
git pull origin main --rebase
git push origin main
```

If `git pull origin main --rebase` asks for a message, save and exit (`:wq` in vim, or Ctrl+X then Y in nano). If you get conflicts, say so and we can fix.

---

## Step 4: Optional – use this clone for future pushes

From now on, for this project you can either:

- **Option A:** Work in `~/Desktop/mentorshipweb-push`: pull changes there, make edits, then add/commit/push. Your current MentorshipWeb folder stays as your main workspace; you can copy changed files (e.g. `lib`, `app`) into the clone when you want to push.

- **Option B:** Make MentorshipWeb the real repo: delete the `.git` in your **home** directory (only if you’re sure nothing else needs it), then in MentorshipWeb run:
  ```bash
  cd ~/Desktop/MentorshipWeb
  git init
  git remote add origin https://github.com/f2yapps/mentorshipweb.git
  git fetch origin
  git reset --soft origin/main
  git add .
  git commit -m "Sync with remote and add lib"
  git push -u origin main
  ```
  This replaces MentorshipWeb’s history with the GitHub one and pushes. **Only do this if you don’t need the home-directory repo.**

---

## Why this works

- **"short read while indexing"** – Git in a huge repo (your home) can hit index or filesystem limits; a small clone avoids that.
- **"origin does not appear to be a git repository"** – You fixed this by adding `origin`; the clean clone uses the same remote.
- **Push rejected** – The remote has commits you don’t have; `git pull origin main --rebase` then `git push` fixes it when you’re in the **correct** repo (the clone).

After Step 3, Vercel will see the new commit and the build should find `@/lib/supabase/server` and `@/lib/supabase/errors`.
