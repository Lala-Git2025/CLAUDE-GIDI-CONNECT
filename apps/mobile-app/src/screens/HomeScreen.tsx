import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Linking, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';
import { TrafficAlert } from '../components/TrafficAlert';
import { VibeCheck } from '../components/VibeCheck';
import { TrendingVenues } from '../components/TrendingVenues';
import { StorySection } from '../components/StorySection';
import { useFonts, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const categories = [
  { emoji: '🍸', label: "Bars & Lounges", screen: "Explore" },
  { emoji: '🍽️', label: "Restaurants", screen: "Explore" },
  { emoji: '📰', label: "GIDI News", screen: "News" },
  { emoji: '🎵', label: "Nightlife", screen: "Explore" },
  { emoji: '☀️', label: "DayLife", screen: "Events" },
  { emoji: '📅', label: "Events", screen: "Events" },
  { emoji: '💬', label: "Social", screen: "Social" },
  { emoji: '➕', label: "See More", screen: "Explore" },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [liveNews, setLiveNews] = useState<Array<{
    title: string;
    summary: string;
    time: string;
    category: string;
    featured_image_url?: string;
    external_url?: string;
  }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [venueRefreshTrigger, setVenueRefreshTrigger] = useState(0);

  // Load Orbitron font
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const fetchLatestNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('title, summary, category, publish_date, featured_image_url, external_url')
        .not('external_url', 'is', null)  // Only fetch articles with URLs
        .order('publish_date', { ascending: false })
        .limit(5);  // Fetch 5 to account for filtering

      if (error) {
        console.error('Error fetching news:', error);
        setLiveNews([]);
        return;
      }

      if (data && data.length > 0) {
        // Filter out articles without valid URLs (safety check)
        const validNews = data.filter(item => {
          if (!item.external_url) return false;
          const urlLower = item.external_url.toLowerCase();
          // Exclude fake URLs
          if (urlLower.includes('example.com') ||
              urlLower.includes('localhost') ||
              urlLower.includes('test.com') ||
              urlLower.includes('placeholder')) {
            return false;
          }
          return item.external_url.startsWith('http');
        });

        const formattedNews = validNews.slice(0, 3).map(item => ({
          title: item.title,
          summary: item.summary,
          time: formatTimeAgo(item.publish_date),
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          featured_image_url: item.featured_image_url,
          external_url: item.external_url
        }));
        setLiveNews(formattedNews);
      } else {
        setLiveNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setLiveNews([]);  // Clear news on error
    }
  };

  // Fetch latest news from Supabase
  useEffect(() => {
    fetchLatestNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLatestNews();
    // Trigger venues refresh by incrementing the counter
    setVenueRefreshTrigger(prev => prev + 1);
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishDate = new Date(dateString);
    const diffInMs = now.getTime() - publishDate.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    if (hour < 12) return `${day} MORNING`;
    if (hour < 17) return `${day} AFTERNOON`;
    if (hour < 21) return `${day} EVENING`;
    return `${day} NIGHT`;
  };

  const handleCategoryPress = (category: any) => {
    if (category.url) {
      Linking.openURL(category.url);
    } else if (category.screen) {
      navigation.navigate(category.screen as never);
    } else if (category.alert) {
      alert(category.alert);
    }
  };

  const openNews = () => {
    navigation.navigate('News' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EAB308"
            colors={["#EAB308"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appName}>GIDI CONNECT</Text>
            <View style={styles.liveDot} />
          </View>
          <TouchableOpacity onPress={() => alert('Notifications coming soon!')}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Time-based Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTime}>{getCurrentTimeGreeting()}</Text>
        </View>

        {/* Search Section */}
        <TouchableOpacity
          style={styles.searchSection}
          onPress={() => navigation.navigate('Explore' as never)}
        >
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search your destination here...</Text>
          </View>
        </TouchableOpacity>

        {/* Explore the Area - Featured Card */}
        <TouchableOpacity
          style={styles.exploreAreaCard}
          onPress={() => navigation.navigate('ExploreArea' as never)}
        >
          <View style={styles.exploreAreaContent}>
            <Text style={styles.exploreAreaEmoji}>🗺️</Text>
            <View style={styles.exploreAreaText}>
              <Text style={styles.exploreAreaTitle}>Explore the Area</Text>
              <Text style={styles.exploreAreaSubtitle}>Discover venues by neighborhood</Text>
            </View>
            <Text style={styles.exploreAreaArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stories Section */}
        <StorySection />

        {/* Live News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔴 LIVE - GIDI News</Text>
            <TouchableOpacity onPress={openNews}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.newsScroll}>
            {liveNews.map((news, index) => (
              <TouchableOpacity
                key={index}
                style={styles.newsCard}
                onPress={() => {
                  if (news.external_url) {
                    Linking.openURL(news.external_url).catch(err => {
                      console.error('Failed to open URL:', err);
                      alert('Could not open article');
                    });
                  }
                }}
              >
                {news.featured_image_url ? (
                  <View style={styles.newsImageContainer}>
                    <Image
                      source={{ uri: news.featured_image_url }}
                      style={styles.newsImage}
                      resizeMode="cover"
                    />
                    <View style={styles.newsCategoryBadge}>
                      <Text style={styles.newsCategoryText}>{news.category}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.newsImagePlaceholder}>
                    <Text style={styles.newsIcon}>📰</Text>
                    <View style={styles.newsCategoryBadge}>
                      <Text style={styles.newsCategoryText}>{news.category}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.newsContent}>
                  <View style={styles.newsHeader}>
                    <Text style={styles.newsTime}>{news.time}</Text>
                  </View>
                  <Text style={styles.newsTitle}>{news.title}</Text>
                  <Text style={styles.newsDescription}>{news.summary}</Text>
                  <Text style={styles.newsLink}>Read More →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Traffic Update - Dynamic */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚦 Live Traffic Update</Text>
        </View>
        <TrafficAlert />

        {/* Vibe Check Section - Dynamic */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Vibe Check</Text>
        </View>
        <VibeCheck />

        {/* Trending Venues - Dynamic */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Venues</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore' as never)}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TrendingVenues refreshTrigger={venueRefreshTrigger} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Orbitron_900Black',
    color: '#EAB308',
    letterSpacing: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  headerIcon: {
    fontSize: 20,
  },
  // Greeting
  greetingSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greetingTime: {
    fontSize: 14,
    color: '#9ca3af',
    letterSpacing: 1,
    fontWeight: '500',
  },
  // Search
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  // Explore Area Card
  exploreAreaCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#18181b',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EAB308',
    padding: 16,
    shadowColor: '#EAB308',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  exploreAreaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exploreAreaEmoji: {
    fontSize: 32,
  },
  exploreAreaText: {
    flex: 1,
  },
  exploreAreaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EAB308',
    marginBottom: 2,
  },
  exploreAreaSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
  exploreAreaArrow: {
    fontSize: 24,
    color: '#EAB308',
    fontWeight: 'bold',
  },
  // Categories
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: cardWidth,
    height: 96,
    backgroundColor: '#18181b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#EAB308',
    fontWeight: '500',
  },
  // News
  newsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  newsCard: {
    width: 260,
    marginRight: 12,
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    overflow: 'hidden',
  },
  newsImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  newsImageContainer: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsIcon: {
    fontSize: 40,
  },
  newsCategoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EAB308',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newsCategoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  newsContent: {
    padding: 10,
  },
  newsHeader: {
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 18,
  },
  newsDescription: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    lineHeight: 16,
  },
  newsLink: {
    fontSize: 12,
    color: '#EAB308',
    fontWeight: '600',
  },
  // Traffic
  trafficCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
  },
  trafficAlert: {
    flexDirection: 'row',
    gap: 12,
  },
  trafficEmoji: {
    fontSize: 24,
  },
  trafficContent: {
    flex: 1,
  },
  trafficTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  trafficLocation: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  trafficTime: {
    fontSize: 10,
    color: '#6b7280',
  },
  // Vibe Check
  vibeCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
  },
  vibeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  vibeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  vibeStat: {
    alignItems: 'center',
  },
  vibeStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EAB308',
    marginBottom: 4,
  },
  vibeStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  // Venues
  venuesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  venueCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 10,
  },
  venueImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#27272a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  venueIcon: {
    fontSize: 32,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
