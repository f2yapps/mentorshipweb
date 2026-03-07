# Contact email and email verification

## 1. Receiving contact form messages (support@f2yapps.com)

The contact form sends email via [Resend](https://resend.com). To receive messages in your inbox:

1. Sign up at https://resend.com and get an API key.
2. Add these to your environment (e.g. Vercel → Settings → Environment Variables):
   - `RESEND_API_KEY` = your Resend API key (e.g. `re_xxxx`)
   - `CONTACT_EMAIL` = `support@f2yapps.com` (or the inbox where you want messages)
3. Resend’s free “from” address is `onboarding@resend.dev`. To send from your own domain (e.g. `noreply@f2yapps.com`), verify your domain in Resend and set:
   - `RESEND_FROM_EMAIL` = `noreply@yourdomain.com`
4. Redeploy so the new env vars are used.

Without `RESEND_API_KEY`, the form still shows “Message sent!” but no email is delivered.

## 2. “Successfully verified email” instead of “localhost refused to connect”

After users click the link in the verification email, they see “localhost refused to connect” when the link points to localhost instead of your live site.

**Fix in Supabase (one-time):**

1. Open **Supabase Dashboard** → **Authentication** → **URL Configuration**.
2. Set **Site URL** to your production URL, e.g. `https://your-app.vercel.app` or `https://yourdomain.com`.
3. Under **Redirect URLs**, add:
   - `https://your-app.vercel.app/**` (or your production URL + `/**`)
   - `http://localhost:3000/**` (for local dev).
4. Save.

New verification emails will use the Site URL, so users will land on your live site and see “Successfully verified email” instead of a connection error.
