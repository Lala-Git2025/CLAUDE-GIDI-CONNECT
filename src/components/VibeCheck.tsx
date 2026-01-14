import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

interface VibeData {
  area: string;
  count: number;
  status: string;
}

export const VibeCheck = () => {
  const [vibeData, setVibeData] = useState<VibeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVibeData();
  }, []);

  const fetchVibeData = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('location, rating')
        .order('rating', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Calculate which area is most active
      const areaCounts: Record<string, number> = {};
      (data || []).forEach(venue => {
        const area = venue.location.split(',')[0].trim();
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      });

      let maxArea = 'Victoria Island';
      let maxCount = 0;
      Object.entries(areaCounts).forEach(([area, count]) => {
        if (count > maxCount) {
          maxCount = count;
          maxArea = area;
        }
      });

      const status = maxCount >= 20 ? 'Electric ⚡️' : maxCount >= 10 ? 'Buzzing 🔥' : maxCount >= 5 ? 'Vibing ✨' : 'Chill 🎵';

      setVibeData({ area: maxArea, count: maxCount, status });
    } catch (error) {
      console.error('Error fetching vibe data:', error);
      // Fallback to default data
      setVibeData({ area: 'Victoria Island', count: 24, status: 'Electric ⚡️' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 mb-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const area = vibeData?.area || 'Victoria Island';
  const count = vibeData?.count || 24;
  const status = vibeData?.status || 'Electric ⚡️';

  return (
    <div className="px-4 mb-6">
      <div className="rounded-3xl p-1 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.8)]">
        <div className="h-48 rounded-[21px] overflow-hidden relative">
          {/* Lagos Map Background */}
          <img
            src="https://images.unsplash.com/photo-1578041237426-2a5c5f90c31e?w=1200&q=80"
            alt="Lagos Map"
            className="absolute w-full h-full object-cover opacity-80"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute w-full h-full bg-black/60" />

          {/* Map Grid Lines */}
          <div className="absolute w-full h-full">
            <div className="absolute w-full h-px bg-amber-400/15 top-0" />
            <div className="absolute w-full h-px bg-amber-400/15 top-1/3" />
            <div className="absolute w-full h-px bg-amber-400/15 top-2/3" />
            <div className="absolute w-px h-full bg-amber-400/15 left-1/3" />
            <div className="absolute w-px h-full bg-amber-400/15 left-2/3" />
          </div>

          {/* Pulsing Dots - Victoria Island */}
          <div className="absolute top-[45%] left-[55%]">
            <div className="animate-pulse">
              <div className="absolute w-10 h-10 rounded-full bg-amber-400 opacity-40" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-400 opacity-70" />
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-amber-400" />
              <span className="absolute top-11 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded whitespace-nowrap">VI</span>
            </div>
          </div>

          {/* Pulsing Dots - Lekki */}
          <div className="absolute top-[52%] left-[75%]">
            <div className="animate-pulse">
              <div className="absolute w-10 h-10 rounded-full bg-amber-400 opacity-40" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-400 opacity-70" />
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-amber-400" />
              <span className="absolute top-11 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded whitespace-nowrap">Lekki</span>
            </div>
          </div>

          {/* Pulsing Dots - Ikeja */}
          <div className="absolute top-[35%] left-[25%]">
            <div className="animate-pulse">
              <div className="absolute w-10 h-10 rounded-full bg-emerald-400 opacity-40" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-400 opacity-70" />
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-emerald-400" />
              <span className="absolute top-11 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded whitespace-nowrap">Ikeja</span>
            </div>
          </div>

          {/* Pulsing Dots - Ikoyi */}
          <div className="absolute top-[50%] left-[48%]">
            <div className="animate-pulse">
              <div className="absolute w-10 h-10 rounded-full bg-blue-400 opacity-40" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-blue-400 opacity-70" />
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-blue-400" />
              <span className="absolute top-11 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded whitespace-nowrap">Ikoyi</span>
            </div>
          </div>

          {/* Pulsing Dots - Surulere */}
          <div className="absolute top-[28%] left-[42%]">
            <div className="animate-pulse">
              <div className="absolute w-10 h-10 rounded-full bg-purple-400 opacity-40" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-purple-400 opacity-70" />
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-purple-400" />
              <span className="absolute top-11 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded whitespace-nowrap">Surulere</span>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="animate-pulse inline-flex items-center gap-1.5 bg-yellow-500 border-2 border-amber-300 px-3 py-1.5 rounded-2xl mb-3 shadow-[0_0_8px_rgba(234,179,8,0.8)]">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span className="text-[11px] font-bold text-black tracking-widest">LIVE VIBE CHECK</span>
            </div>
            <h2 className="text-[22px] font-bold text-white mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
              {area} is <span className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">{status}</span>
            </h2>
            <p className="text-[15px] text-amber-300 font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
              {count} Venues active right now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
