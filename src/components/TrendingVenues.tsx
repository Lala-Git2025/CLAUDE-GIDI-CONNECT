import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  location: string;
  rating: number;
  professional_media_urls?: string[];
}

const getVibeStatus = (rating: number) => {
  if (rating >= 4.5) return 'Electric ⚡️';
  if (rating >= 4.0) return 'Buzzing 🔥';
  if (rating >= 3.5) return 'Vibing ✨';
  return 'Chill 🎵';
};

const getVisitorCount = () => {
  return Math.floor(Math.random() * 1000) + 100;
};

export const TrendingVenues = () => {
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['trending-venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name, location, rating, professional_media_urls')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      return (data as Venue[]) || [];
    },
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Trending Tonight 🚀</h2>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold text-foreground mb-4 px-4">Trending Tonight 🚀</h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 px-4 pb-2">
            {venues.map((venue) => (
              <Card
                key={venue.id}
                className="flex-none w-80 h-80 overflow-hidden cursor-pointer group relative border-0"
              >
                {/* Background Image */}
                <img
                  src={venue.professional_media_urls?.[0] || 'https://images.unsplash.com/photo-1576442655380-1e828d09852f?q=80&w=1000'}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-xs font-bold text-white">
                        {getVibeStatus(venue.rating)}
                      </span>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <span className="text-lg">🔖</span>
                    </button>
                  </div>

                  {/* Bottom Content */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white line-clamp-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-200">
                      <span className="text-sm">📍</span>
                      <span className="text-sm line-clamp-1">{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gray-400 border-2 border-black"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {getVisitorCount()} here
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
