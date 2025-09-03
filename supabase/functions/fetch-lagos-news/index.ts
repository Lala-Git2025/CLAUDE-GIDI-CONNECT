import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    
    if (!newsApiKey) {
      console.error('NEWS_API_KEY not found');
      return new Response(JSON.stringify({ 
        error: 'NEWS_API_KEY not configured',
        fallback: true,
        data: []
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { category = 'general', limit = 10 } = await req.json().catch(() => ({}));

    // Fetch Lagos/Nigeria news
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=Lagos OR Nigeria OR Gidi&language=en&sortBy=publishedAt&pageSize=${limit}`,
      {
        headers: {
          'X-API-Key': newsApiKey,
        },
      }
    );

    if (!newsResponse.ok) {
      throw new Error(`NewsAPI error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();

    // Process and clean the news data
    const processedNews = newsData.articles?.map((article: any) => ({
      id: article.url,
      title: article.title,
      summary: article.description,
      content: article.content,
      featured_image_url: article.urlToImage,
      category: category,
      publish_date: article.publishedAt,
      author_id: null,
      venue_id: null,
      source: article.source.name,
      external_url: article.url,
      is_published: true,
      views_count: 0,
      tags: ['Lagos', 'Nigeria', 'GIDI'],
    })) || [];

    // Cache the news in our database
    const { error: insertError } = await supabase
      .from('news_feed')
      .upsert(processedNews, { 
        onConflict: 'title',
        ignoreDuplicates: true 
      });

    if (insertError) {
      console.error('Error caching news:', insertError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      data: processedNews,
      source: 'live_api',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-lagos-news:', error);
    
    // Fallback to cached data
    const { data: cachedNews } = await supabase
      .from('news_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return new Response(JSON.stringify({ 
      success: true,
      data: cachedNews || [],
      source: 'cached',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});