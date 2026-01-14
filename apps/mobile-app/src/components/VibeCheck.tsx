import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { supabase } from '../config/supabase';

interface VibeData {
  area: string;
  count: number;
  status: string;
}

export const VibeCheck = () => {
  const [vibeData, setVibeData] = useState<VibeData | null>(null);
  const [loading, setLoading] = useState(true);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    fetchVibeData();

    // Pulsing animation for live badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#EAB308" />
      </View>
    );
  }

  const area = vibeData?.area || 'Victoria Island';
  const count = vibeData?.count || 24;
  const status = vibeData?.status || 'Electric ⚡️';

  return (
    <View style={styles.container}>
      {/* Glowing Border Container */}
      <View style={styles.glowContainer}>
        <View style={styles.card}>
          {/* Lagos Map Background */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1578041237426-2a5c5f90c31e?w=1200&q=80' }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          {/* Dark Gradient Overlay for Readability */}
          <View style={styles.gradient} />

          {/* Map Grid Lines Effect */}
          <View style={styles.mapOverlay}>
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, { top: '33%' }]} />
            <View style={[styles.gridLine, { top: '66%' }]} />
            <View style={[styles.gridLineVertical, { left: '33%' }]} />
            <View style={[styles.gridLineVertical, { left: '66%' }]} />
          </View>

          {/* Animated Pulsing Dots - Victoria Island (Center-Right) */}
          <Animated.View style={[styles.pulsingDot, { top: '45%', left: '55%', transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.dotOuter, styles.primaryDot]} />
            <View style={[styles.dotMiddle, styles.primaryDot]} />
            <View style={[styles.dotInner, styles.primaryDot]} />
            <Text style={styles.areaLabel}>VI</Text>
          </Animated.View>

          {/* Animated Pulsing Dots - Lekki (Far Right) */}
          <Animated.View style={[styles.pulsingDot, { top: '52%', left: '75%', transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.dotOuter, styles.primaryDot]} />
            <View style={[styles.dotMiddle, styles.primaryDot]} />
            <View style={[styles.dotInner, styles.primaryDot]} />
            <Text style={styles.areaLabel}>Lekki</Text>
          </Animated.View>

          {/* Animated Pulsing Dots - Ikeja (Left-Center, Mainland) */}
          <Animated.View style={[styles.pulsingDot, { top: '35%', left: '25%', transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.dotOuter, styles.greenDot]} />
            <View style={[styles.dotMiddle, styles.greenDot]} />
            <View style={[styles.dotInner, styles.greenDot]} />
            <Text style={styles.areaLabel}>Ikeja</Text>
          </Animated.View>

          {/* Animated Pulsing Dots - Ikoyi (Near VI) */}
          <Animated.View style={[styles.pulsingDot, { top: '50%', left: '48%', transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.dotOuter, styles.blueDot]} />
            <View style={[styles.dotMiddle, styles.blueDot]} />
            <View style={[styles.dotInner, styles.blueDot]} />
            <Text style={styles.areaLabel}>Ikoyi</Text>
          </Animated.View>

          {/* Animated Pulsing Dots - Surulere (Upper Center) */}
          <Animated.View style={[styles.pulsingDot, { top: '28%', left: '42%', transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.dotOuter, styles.purpleDot]} />
            <View style={[styles.dotMiddle, styles.purpleDot]} />
            <View style={[styles.dotInner, styles.purpleDot]} />
            <Text style={styles.areaLabel}>Surulere</Text>
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            <Animated.View style={[styles.liveBadge, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE VIBE CHECK</Text>
            </Animated.View>
            <Text style={styles.title}>
              {area} is <Text style={styles.statusText}>{status}</Text>
            </Text>
            <Text style={styles.subtitle}>{count} Venues active right now</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  glowContainer: {
    borderRadius: 24,
    padding: 3,
    backgroundColor: '#EAB308',
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    height: 192,
    borderRadius: 21,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mapOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    top: 0,
  },
  gridLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    left: 0,
  },
  pulsingDot: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
  },
  areaLabel: {
    position: 'absolute',
    top: 42,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dotOuter: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.4,
  },
  dotMiddle: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.7,
  },
  dotInner: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 1,
  },
  primaryDot: {
    backgroundColor: '#fbbf24',
  },
  greenDot: {
    backgroundColor: '#34d399',
  },
  blueDot: {
    backgroundColor: '#60a5fa',
  },
  purpleDot: {
    backgroundColor: '#c084fc',
  },
  content: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EAB308',
    borderWidth: 2,
    borderColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
    gap: 6,
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statusText: {
    color: '#fbbf24',
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#fbbf24',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
