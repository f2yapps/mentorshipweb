-- ============================================================================
-- FIX EXISTING USERS
-- ============================================================================
-- This script helps fix users who signed up before the trigger was enabled.
-- It creates user records for any auth users that don't have a corresponding
-- record in the public.users table.
-- ============================================================================

-- Create user records for any auth users missing from public.users
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1)
  ) as name,
  COALESCE(
    (au.raw_user_meta_data->>'role')::TEXT,
    'mentee'
  ) as role,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  AND au.email_confirmed_at IS NOT NULL;

-- Show how many users were fixed
SELECT COUNT(*) as users_fixed FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  AND au.email_confirmed_at IS NOT NULL;
