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
    const { query, category, location = 'Lagos, Nigeria' } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ 
        error: 'Search query is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Search in our database first
    let searchQuery = supabase
      .from('venues')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, location.ilike.%${query}%`);

    if (category) {
      searchQuery = searchQuery.eq('category', category);
    }

    const { data: localResults, error } = await searchQuery.limit(10);

    if (error) {
      console.error('Database search error:', error);
    }

    // Combine with live search results
    const combinedResults = {
      local: localResults || [],
      live: await searchLiveVenues(query, category, location),
      query: query,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify({ 
      success: true,
      data: combinedResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-places:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchLiveVenues(query: string, category?: string, location?: string) {
  // Mock live search results - in production, this would integrate with Google Places API
  const mockResults = [
    {
      name: 'Sky Restaurant & Lounge',
      description: 'Rooftop dining with panoramic Lagos views',
      location: 'Victoria Island, Lagos',
      category: 'Restaurant',
      rating: 4.4,
      price_range: '₦₦₦',
      source: 'live_search'
    },
    {
      name: 'The Jazz Hole',
      description: 'Intimate jazz club with live performances',
      location: 'Surulere, Lagos',
      category: 'Lounge',
      rating: 4.2,
      price_range: '₦₦',
      source: 'live_search'
    }
  ].filter(venue => 
    venue.name.toLowerCase().includes(query.toLowerCase()) ||
    venue.description.toLowerCase().includes(query.toLowerCase()) ||
    (category ? venue.category.toLowerCase() === category.toLowerCase() : true)
  );

  return mockResults;
}