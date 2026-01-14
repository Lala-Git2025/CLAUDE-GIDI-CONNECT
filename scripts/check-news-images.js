#!/usr/bin/env node

/**
 * Check news images in database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkNewsImages() {
  console.log('🔍 Checking news images in database...\n');

  const { data, error } = await supabase
    .from('news')
    .select('title, source, featured_image_url')
    .order('publish_date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`Found ${data?.length || 0} recent articles:\n`);

  if (data && data.length > 0) {
    data.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Image: ${article.featured_image_url}`);

      // Check if it's a real news image or Unsplash fallback
      const isUnsplash = article.featured_image_url?.includes('unsplash.com');
      const isNewsImage = !isUnsplash;
      console.log(`   Type: ${isNewsImage ? '✅ Real News Image' : '⚠️ Unsplash Fallback'}`);
      console.log('');
    });

    // Count real vs fallback images
    const realImages = data.filter(a => !a.featured_image_url?.includes('unsplash.com')).length;
    const fallbackImages = data.filter(a => a.featured_image_url?.includes('unsplash.com')).length;

    console.log(`📊 Summary:`);
    console.log(`   Real Images: ${realImages}`);
    console.log(`   Fallback Images: ${fallbackImages}`);
  }
}

checkNewsImages();
