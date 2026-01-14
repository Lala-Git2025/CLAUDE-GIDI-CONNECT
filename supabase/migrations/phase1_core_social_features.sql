-- =====================================================
-- PHASE 1: CORE SOCIAL FEATURES - Database Migration
-- =====================================================
-- This migration creates all tables needed for Phase 1:
-- - Stories feature
-- - User check-ins
-- - User activity logging
-- - Communities system
-- - Community membership
-- - User badges & achievements
-- =====================================================

-- =====================================================
-- 1. STORIES TABLE
-- =====================================================
-- For Instagram-style stories that expire after 24 hours
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours') NOT NULL,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Indexes for stories
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS stories_expires_at_idx ON public.stories(expires_at);
CREATE INDEX IF NOT EXISTS stories_active_idx ON public.stories(is_active) WHERE is_active = true;

-- RLS policies for stories
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active stories" ON public.stories
  FOR SELECT
  USING (is_active = true AND expires_at > now());

CREATE POLICY "Users can create their own stories" ON public.stories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON public.stories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON public.stories
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 2. USER CHECK-INS TABLE
-- =====================================================
-- Track when users visit venues for statistics and activity
CREATE TABLE IF NOT EXISTS public.user_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  checked_in_at timestamp with time zone DEFAULT now() NOT NULL,
  checked_out_at timestamp with time zone,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  note text,
  is_public boolean DEFAULT true,
  CONSTRAINT valid_checkout CHECK (checked_out_at IS NULL OR checked_out_at > checked_in_at)
);

-- Indexes for user_checkins
CREATE INDEX IF NOT EXISTS user_checkins_user_id_idx ON public.user_checkins(user_id);
CREATE INDEX IF NOT EXISTS user_checkins_venue_id_idx ON public.user_checkins(venue_id);
CREATE INDEX IF NOT EXISTS user_checkins_checked_in_at_idx ON public.user_checkins(checked_in_at DESC);
CREATE INDEX IF NOT EXISTS user_checkins_active_idx ON public.user_checkins(checked_in_at) WHERE checked_out_at IS NULL;

-- RLS policies for user_checkins
ALTER TABLE public.user_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for public checkins" ON public.user_checkins
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can read their own checkins" ON public.user_checkins
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins" ON public.user_checkins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins" ON public.user_checkins
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. USER REVIEWS TABLE
-- =====================================================
-- User reviews and ratings for venues
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  content text,
  photos text[],
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, venue_id)
);

-- Indexes for user_reviews
CREATE INDEX IF NOT EXISTS user_reviews_user_id_idx ON public.user_reviews(user_id);
CREATE INDEX IF NOT EXISTS user_reviews_venue_id_idx ON public.user_reviews(venue_id);
CREATE INDEX IF NOT EXISTS user_reviews_rating_idx ON public.user_reviews(rating);
CREATE INDEX IF NOT EXISTS user_reviews_created_at_idx ON public.user_reviews(created_at DESC);

-- RLS policies for user_reviews
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for reviews" ON public.user_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews" ON public.user_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.user_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.user_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. USER ACTIVITY LOG TABLE
-- =====================================================
-- Log all user activities for "Recent Activity" section
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'venue_visit', 'event_attend', 'review_posted', 'photo_uploaded',
    'post_created', 'comment_posted', 'venue_favorited', 'story_posted',
    'community_joined', 'badge_earned', 'checkin'
  )),
  resource_type text CHECK (resource_type IN ('venue', 'event', 'post', 'comment', 'story', 'community', 'badge')),
  resource_id uuid,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes for user_activity_log
CREATE INDEX IF NOT EXISTS user_activity_log_user_id_idx ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS user_activity_log_created_at_idx ON public.user_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS user_activity_log_action_type_idx ON public.user_activity_log(action_type);

-- RLS policies for user_activity_log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own activity" ON public.user_activity_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create activity logs" ON public.user_activity_log
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 5. COMMUNITIES TABLE
-- =====================================================
-- Communities/groups for social features
CREATE TABLE IF NOT EXISTS public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  cover_image_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  member_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  is_public boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes for communities
CREATE INDEX IF NOT EXISTS communities_name_idx ON public.communities(name);
CREATE INDEX IF NOT EXISTS communities_created_at_idx ON public.communities(created_at DESC);
CREATE INDEX IF NOT EXISTS communities_member_count_idx ON public.communities(member_count DESC);
CREATE INDEX IF NOT EXISTS communities_is_active_idx ON public.communities(is_active) WHERE is_active = true;

-- RLS policies for communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active communities" ON public.communities
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create communities" ON public.communities
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Community creators can update their communities" ON public.communities
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- =====================================================
-- 6. COMMUNITY MEMBERS TABLE
-- =====================================================
-- Track community membership
CREATE TABLE IF NOT EXISTS public.community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true,
  UNIQUE(community_id, user_id)
);

-- Indexes for community_members
CREATE INDEX IF NOT EXISTS community_members_community_id_idx ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS community_members_user_id_idx ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS community_members_joined_at_idx ON public.community_members(joined_at DESC);

-- RLS policies for community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for community members" ON public.community_members
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can join communities" ON public.community_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities" ON public.community_members
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their membership" ON public.community_members
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 7. BADGE DEFINITIONS TABLE
-- =====================================================
-- Define available badges/achievements
CREATE TABLE IF NOT EXISTS public.badge_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon_url text,
  icon_emoji text,
  category text CHECK (category IN ('social', 'explorer', 'contributor', 'special')),
  requirement_type text CHECK (requirement_type IN ('checkins', 'reviews', 'posts', 'events', 'photos', 'manual')),
  requirement_count integer,
  points integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes for badge_definitions
CREATE INDEX IF NOT EXISTS badge_definitions_category_idx ON public.badge_definitions(category);
CREATE INDEX IF NOT EXISTS badge_definitions_is_active_idx ON public.badge_definitions(is_active) WHERE is_active = true;

-- RLS policies for badge_definitions
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active badges" ON public.badge_definitions
  FOR SELECT
  USING (is_active = true);

-- =====================================================
-- 8. USER BADGES TABLE
-- =====================================================
-- Track badges earned by users
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES public.badge_definitions(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamp with time zone DEFAULT now() NOT NULL,
  progress integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- Indexes for user_badges
CREATE INDEX IF NOT EXISTS user_badges_user_id_idx ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS user_badges_badge_id_idx ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS user_badges_earned_at_idx ON public.user_badges(earned_at DESC);

-- RLS policies for user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for user badges" ON public.user_badges
  FOR SELECT
  USING (true);

CREATE POLICY "System can award badges" ON public.user_badges
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 9. USER FAVORITES TABLE
-- =====================================================
-- Track user's saved/favorite venues
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, venue_id)
);

-- Indexes for user_favorites
CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS user_favorites_venue_id_idx ON public.user_favorites(venue_id);
CREATE INDEX IF NOT EXISTS user_favorites_created_at_idx ON public.user_favorites(created_at DESC);

-- RLS policies for user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own favorites" ON public.user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. HELPER FUNCTIONS
-- =====================================================

-- Function to automatically update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET member_count = member_count + 1,
        updated_at = now()
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = GREATEST(member_count - 1, 0),
        updated_at = now()
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for community member count
DROP TRIGGER IF EXISTS trigger_update_community_member_count ON public.community_members;
CREATE TRIGGER trigger_update_community_member_count
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Function to auto-expire stories after 24 hours
CREATE OR REPLACE FUNCTION expire_old_stories()
RETURNS void AS $$
BEGIN
  UPDATE public.stories
  SET is_active = false
  WHERE expires_at < now() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id uuid,
  p_action_type text,
  p_resource_type text DEFAULT NULL,
  p_resource_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO public.user_activity_log (user_id, action_type, resource_type, resource_id, metadata)
  VALUES (p_user_id, p_action_type, p_resource_type, p_resource_id, p_metadata)
  RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. SEED DATA - Initial Communities
-- =====================================================

-- Insert default communities
INSERT INTO public.communities (name, description, icon, is_public, member_count) VALUES
  ('Nightlife Lagos', 'Discover the best nightlife spots, clubs, and late-night experiences in Lagos', '🌙', true, 0),
  ('Restaurant Reviews', 'Share and discover amazing restaurants, cafes, and food experiences', '🍽️', true, 0),
  ('Events & Concerts', 'Stay updated on upcoming events, concerts, and entertainment in Lagos', '🎵', true, 0),
  ('Island Vibes', 'Everything happening on Lagos Island - VI, Ikoyi, Lekki, and beyond', '🏝️', true, 0),
  ('Mainland Connect', 'Connect with people and places on the mainland - Ikeja, Yaba, Surulere, and more', '🏙️', true, 0),
  ('Foodies United', 'For food lovers exploring Lagos culinary scene', '🍕', true, 0),
  ('Party People', 'Where the party animals hang out', '🎉', true, 0),
  ('Culture & Arts', 'Art galleries, museums, cultural events, and exhibitions', '🎨', true, 0)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 12. SEED DATA - Initial Badges
-- =====================================================

-- Insert default badges
INSERT INTO public.badge_definitions (name, description, icon_emoji, category, requirement_type, requirement_count, points) VALUES
  ('First Check-in', 'Check in to your first venue', '📍', 'explorer', 'checkins', 1, 10),
  ('Explorer', 'Check in to 10 different venues', '🗺️', 'explorer', 'checkins', 10, 50),
  ('Super Explorer', 'Check in to 50 different venues', '⭐', 'explorer', 'checkins', 50, 200),
  ('First Review', 'Write your first venue review', '✍️', 'contributor', 'reviews', 1, 15),
  ('Critic', 'Write 10 venue reviews', '📝', 'contributor', 'reviews', 10, 75),
  ('Social Butterfly', 'Create 25 posts in communities', '🦋', 'social', 'posts', 25, 100),
  ('Event Enthusiast', 'Attend 5 events', '🎫', 'social', 'events', 5, 60),
  ('Photographer', 'Upload 20 photos', '📸', 'contributor', 'photos', 20, 80),
  ('Early Adopter', 'One of the first 1000 users', '🚀', 'special', 'manual', NULL, 500)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All Phase 1 tables created successfully
-- Next steps:
-- 1. Update application components to use these tables
-- 2. Implement real-time subscriptions
-- 3. Add proper error handling
-- =====================================================
