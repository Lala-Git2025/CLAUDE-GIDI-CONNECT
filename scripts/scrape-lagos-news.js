#!/usr/bin/env node

/**
 * 🕷️ ENHANCED REAL NEWS SCRAPER FOR GIDI CONNECT
 *
 * Scrapes actual articles from Lagos and Nigerian news sources
 */

import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Enhanced Lagos news sources with working selectors
const NEWS_SOURCES = [
  {
    name: 'Punch Nigeria',
    url: 'https://punchng.com',
    selector: '.post-title a, article h2 a',
    imageSelector: 'article img, .wp-post-image'
  },
  {
    name: 'The Cable',
    url: 'https://www.thecable.ng',
    selector: 'h2 a, h3 a',
    imageSelector: 'article img, .post-thumbnail img'
  },
  {
    name: 'Linda Ikeji Blog',
    url: 'https://www.lindaikejisblog.com',
    selector: '.entry-title a, h2 a, h3 a',
    imageSelector: 'article img, .post-thumbnail img'
  },
  {
    name: 'BellaNaija',
    url: 'https://www.bellanaija.com',
    selector: '.entry-title a, h2.entry-title a, h3 a',
    imageSelector: 'article img, .wp-post-image'
  },
  {
    name: 'Vanguard News',
    url: 'https://www.vanguardngr.com',
    selector: '.entry-title a, h3 a, h2 a',
    imageSelector: 'article img, .attachment-post-thumbnail'
  },
  {
    name: 'Guardian Nigeria',
    url: 'https://guardian.ng',
    selector: '.entry-title a, h2 a, h3.entry-title a',
    imageSelector: 'article img, .wp-post-image'
  },
  {
    name: 'Lagos State Government',
    url: 'https://lagosstate.gov.ng',
    selector: '.entry-title a, h3 a, .post-title a, h2 a',
    imageSelector: 'article img, .featured-image img'
  }
];

// Diverse fallback images by category (3 per category)
const FALLBACK_IMAGES = {
  traffic: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=85',
    'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&q=85',
    'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&q=85'
  ],
  events: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=85',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=85',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=85'
  ],
  nightlife: [
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=85',
    'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=85',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=85'
  ],
  food: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=85',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85'
  ],
  general: [
    'https://images.unsplash.com/photo-1568822617270-2e2b9c7c7a1e?w=800&q=85',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=85',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=85'
  ]
};

let imageIndex = 0;

function getNextImage(category) {
  const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.general;
  const img = images[imageIndex % images.length];
  imageIndex++;
  return img;
}

async function scrapeSource(source) {
  try {
    console.log(`📰 Scraping ${source.name}...`);

    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const articles = [];

    $(source.selector).slice(0, 15).each((idx, el) => {
      const title = $(el).text().trim();
      let url = $(el).attr('href');

      if (!title || title.length < 10) return;

      // Make URL absolute
      if (url && !url.startsWith('http')) {
        url = url.startsWith('/') ? `${source.url}${url}` : `${source.url}/${url}`;
      }

      // Try to find the article's featured image
      let imageUrl = null;

      // Look for image in the article container (parent elements)
      const articleContainer = $(el).closest('article, .post, .entry, .item');
      if (articleContainer.length > 0) {
        const img = articleContainer.find(source.imageSelector).first();
        if (img.length > 0) {
          // Try multiple attributes for lazy-loaded images
          imageUrl = img.attr('data-src') ||
                     img.attr('data-lazy-src') ||
                     img.attr('data-original') ||
                     img.attr('data-srcset')?.split(',')[0]?.split(' ')[0] ||
                     img.attr('src');
        }
      }

      // If no image found in container, look in siblings
      if (!imageUrl) {
        const img = $(el).siblings(source.imageSelector).first();
        if (img.length > 0) {
          imageUrl = img.attr('data-src') ||
                     img.attr('data-lazy-src') ||
                     img.attr('data-original') ||
                     img.attr('data-srcset')?.split(',')[0]?.split(' ')[0] ||
                     img.attr('src');
        }
      }

      // If still no image, look in parent's siblings
      if (!imageUrl) {
        const img = $(el).parent().siblings().find(source.imageSelector).first();
        if (img.length > 0) {
          imageUrl = img.attr('data-src') ||
                     img.attr('data-lazy-src') ||
                     img.attr('data-original') ||
                     img.attr('data-srcset')?.split(',')[0]?.split(' ')[0] ||
                     img.attr('src');
        }
      }

      // Skip SVG placeholders and data URIs
      if (imageUrl && (imageUrl.includes('data:image/svg') || imageUrl.startsWith('data:'))) {
        imageUrl = null;
      }

      // Make image URL absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = imageUrl.startsWith('/')
          ? `${source.url}${imageUrl}`
          : `${source.url}/${imageUrl}`;
      }

      // Categorize by keywords
      let category = 'general';
      const lower = title.toLowerCase();

      if (lower.includes('traffic') || lower.includes('road') || lower.includes('bridge')) {
        category = 'traffic';
      } else if (lower.includes('concert') || lower.includes('festival') || lower.includes('event')) {
        category = 'events';
      } else if (lower.includes('bar') || lower.includes('club') || lower.includes('nightlife')) {
        category = 'nightlife';
      } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('chef')) {
        category = 'food';
      }

      articles.push({
        title: title.substring(0, 60),
        summary: title.substring(0, 150),
        category,
        external_url: url,
        featured_image_url: imageUrl || getNextImage(category),
        source: source.name
      });
    });

    console.log(`   ✓ Found ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return [];
  }
}

async function uploadToSupabase(articles) {
  if (articles.length === 0) return;

  const items = articles.map(a => ({
    title: a.title,
    summary: a.summary,
    category: a.category,
    external_url: a.external_url,
    featured_image_url: a.featured_image_url,
    publish_date: new Date().toISOString(),
    is_active: true,
    source: a.source
  }));

  const { data, error } = await supabase.from('news').insert(items).select();

  if (error) throw error;

  console.log(`✅ Uploaded ${data.length} articles`);
  return data;
}

async function main() {
  console.log('🕷️  LAGOS NEWS SCRAPER\n');

  const allArticles = [];

  for (const source of NEWS_SOURCES) {
    const articles = await scrapeSource(source);
    allArticles.push(...articles);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n📊 Total: ${allArticles.length} articles\n`);

  if (allArticles.length > 0) {
    await uploadToSupabase(allArticles);
  }

  console.log('\n🎉 COMPLETE!');
  console.log(`   🔗 Real article URLs`);
  console.log(`   🖼️  Diverse images`);
}

main();
