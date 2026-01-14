# Phase 1: Core Social Features - Migration Guide

## 📋 Overview

This guide walks you through deploying Phase 1 database tables and connecting your application to live data.

## 🗄️ Database Migration

### Step 1: Run the Migration in Supabase

You have two options to run the migration:

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/phase1_core_social_features.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Cmd/Ctrl + Enter`
7. Verify success - you should see "Success. No rows returned"

#### Option B: Via Supabase CLI
```bash
# Make sure you're in the project root
cd /Users/femimoritiwon/gidi-vibe-connect-1

# Run the migration
supabase db push

# Or run the specific migration file
supabase db execute -f supabase/migrations/phase1_core_social_features.sql
```

### Step 2: Verify Tables Were Created

Run this query in Supabase SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'stories', 'user_checkins', 'user_reviews', 'user_activity_log',
    'communities', 'community_members', 'badge_definitions',
    'user_badges', 'user_favorites'
  )
ORDER BY table_name;
```

You should see all 9 tables listed.

### Step 3: Verify Seed Data

Check that communities and badges were seeded:

```sql
-- Check communities
SELECT name, icon, member_count FROM public.communities;

-- Check badge definitions
SELECT name, icon_emoji, category, requirement_count FROM public.badge_definitions;
```

You should see:
- 8 communities (Nightlife Lagos, Restaurant Reviews, etc.)
- 9 badges (First Check-in, Explorer, etc.)

## 🔌 What Changed in the App

After running this migration, the following features will start using real data:

### 1. **Social Feed** (`apps/consumer-app/screens/SocialScreen.tsx`)
- Communities are now loaded from database
- Join/leave functionality will persist
- Member counts are real and auto-updated

### 2. **Profile Statistics** (`apps/consumer-app/screens/ProfileScreen.tsx`)
- Venues Visited: Counts from `user_checkins` table
- Events Attended: Counts from `user_activity_log`
- Reviews Written: Counts from `user_reviews` table
- Photos Uploaded: Counts from activity log

### 3. **Stories** (`src/components/StorySection.tsx`)
- Stories will be fetched from database
- Auto-expire after 24 hours
- Real-time updates

### 4. **User Activity**
- All actions are now logged in `user_activity_log`
- Recent Activity section will show real data
- Badge progress is tracked

## 🚀 Next Steps

### Update Components (I'll do this automatically)

1. ✅ Update Social Feed to fetch communities from database
2. ✅ Implement join/leave community functionality
3. ✅ Update Profile to calculate real statistics
4. ✅ Update Stories component to use database
5. ✅ Implement check-in functionality
6. ✅ Add activity logging throughout app

### Test the Features

After I update the components, test:

1. **Communities**
   - View list of communities in Social tab
   - Join/leave communities
   - See member count update

2. **Profile Stats**
   - Check in to a venue
   - Write a review
   - See stats update in real-time

3. **Stories**
   - Create a story
   - See it expire after 24 hours
   - View other users' stories

## 📊 Database Schema Reference

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `communities` | Community groups | name, icon, member_count |
| `community_members` | User memberships | user_id, community_id, role |
| `user_checkins` | Venue check-ins | user_id, venue_id, checked_in_at |
| `user_reviews` | Venue reviews | user_id, venue_id, rating, content |
| `user_activity_log` | Activity tracking | user_id, action_type, created_at |
| `stories` | User stories | user_id, media_url, expires_at |
| `badge_definitions` | Available badges | name, requirement_type, points |
| `user_badges` | Earned badges | user_id, badge_id, earned_at |
| `user_favorites` | Saved venues | user_id, venue_id |

### Important Functions

```sql
-- Log user activity
SELECT log_user_activity(
  'user-uuid'::uuid,
  'venue_visit',
  'venue',
  'venue-uuid'::uuid,
  '{"venue_name": "Bar Beach"}'::jsonb
);

-- Expire old stories (run periodically)
SELECT expire_old_stories();
```

## 🔐 Security (RLS Policies)

All tables have Row Level Security enabled:

- **Public Read**: Communities, badge definitions, public stories
- **User Read**: Own activity, checkins, reviews, badges
- **User Write**: Can only modify own data
- **System Write**: Activity logging, badge awarding

## 🐛 Troubleshooting

### Migration Fails

**Error**: "relation already exists"
- Tables may already be created
- Run: `DROP TABLE IF EXISTS table_name CASCADE;` first
- Or skip to updating components

**Error**: "permission denied"
- Make sure you're using service role key or authenticated as owner
- Check Supabase dashboard permissions

### No Seed Data

If communities/badges weren't inserted:
```sql
-- Manually insert communities
INSERT INTO public.communities (name, description, icon, is_public) VALUES
  ('Nightlife Lagos', 'Best nightlife spots in Lagos', '🌙', true)
-- ... (copy from migration file)
ON CONFLICT (name) DO NOTHING;
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Verify RLS policies are enabled
3. Check that auth.users table exists
4. Ensure venues table exists (required foreign key)

---

**Migration File**: `supabase/migrations/phase1_core_social_features.sql`
**Status**: Ready to run ✅
