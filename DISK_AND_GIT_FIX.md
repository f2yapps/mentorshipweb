# Fix: "No space left on device" and "origin does not appear to be a git repository"

## Step 1: Free disk space (required first)

Git needs space to create `.git/index.lock` and update the index. Until you free space, git commands will keep failing.

**Quick ways to free space on Mac:**

1. **Empty Trash** – Right-click Trash → Empty Trash (or Finder → Empty Trash).

2. **Check disk usage:**
   - Apple menu → About This Mac → Storage (see what’s using space).
   - Or in Terminal: `df -h` (look at the “Avail” column for your main disk).

3. **Common space hogs to clear:**
   - **Xcode derived data:**  
     `rm -rf ~/Library/Developer/Xcode/DerivedData/*`  
     (Only if you don’t need current Xcode build caches.)
   - **npm cache:**  
     `npm cache clean --force`
   - **Homebrew cache:**  
     `brew cleanup -s`
   - **Docker (if you use it):**  
     Docker Desktop → Settings → Resources → Free space, or prune:  
     `docker system prune -a`
   - **Large files in Downloads/Desktop:**  
     Move or delete old installers, videos, duplicates.
   - **System/Library caches:**  
     Don’t delete system folders; use “Manage Storage” in About This Mac to remove old iOS backups, etc.

4. **After freeing at least 500 MB–1 GB**, try the git commands again.

---

## Step 2: Re-add the `origin` remote (after space is fixed)

The error `'origin' does not appear to be a git repository` means the remote named `origin` is missing or wrong. Fix it like this:

1. **See current remotes:**
   ```bash
   cd /Users/fitsumteshome/Desktop/MentorshipWeb
   git remote -v
   ```

2. **If nothing is listed (or no `origin`), add GitHub as origin:**
   ```bash
   git remote add origin https://github.com/f2yapps/mentorshipweb.git
   ```
   (Use your real repo URL if it’s different – same one you use to clone.)

3. **If `origin` exists but URL is wrong:**
   ```bash
   git remote set-url origin https://github.com/f2yapps/mentorshipweb.git
   ```

4. **Then add lib, commit, and push:**
   ```bash
   rm -f .git/index.lock
   git add lib
   git commit -m "Add lib for Vercel build"
   git push -u origin main
   ```

---

## Summary

1. Free disk space (Empty Trash, clear caches, delete large files).
2. Run `git remote -v` and fix `origin` with `git remote add origin …` or `git remote set-url origin …`.
3. Run `git add lib`, `git commit`, `git push origin main`.
