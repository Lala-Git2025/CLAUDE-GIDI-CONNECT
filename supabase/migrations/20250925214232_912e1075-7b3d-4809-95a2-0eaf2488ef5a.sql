-- Fix the security linter warnings from the previous migration

-- Fix 1: Remove the problematic view and replace with a proper security definer function
DROP VIEW IF EXISTS public.public_profiles;

-- Fix 2: Update functions to have proper search_path settings
DROP FUNCTION IF EXISTS public.get_public_profile_data(uuid);
DROP FUNCTION IF EXISTS public.get_safe_public_profile(uuid);

-- Create a single, secure function for getting public profile data
CREATE OR REPLACE FUNCTION public.get_safe_public_profile(profile_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  role user_role,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only return non-sensitive profile data for public access
  -- Phone numbers and other PII are excluded for security
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.location,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
END;
$$;

-- Fix the existing handle_new_user function to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'Consumer')
  );
  RETURN NEW;
END;
$$;

-- Ensure the update_updated_at_column function also has proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;