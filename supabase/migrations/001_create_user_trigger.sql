-- ============================================================================
-- ENABLE AUTH USER TRIGGER
-- ============================================================================
-- This trigger automatically creates a user record in public.users
-- when a new user signs up via Supabase Auth.
--
-- The function already exists in schema.sql, we just need to enable the trigger.
-- ============================================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
-- You can check in: Database -> Triggers in Supabase Dashboard
