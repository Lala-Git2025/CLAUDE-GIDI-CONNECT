import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  external_url?: string;
  featured_image_url?: string;
  publish_date: string;
  source?: string;
}

// No fallback news - always use latest from Supabase

export default function NewsScreen() {
  const navigation = useNavigation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'traffic', 'events', 'nightlife', 'food', 'general'];

  // Fetch news from Supabase
  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .not('external_url', 'is', null)  // Only fetch articles with URLs
        .order('publish_date', { ascending: false })
        .limit(30);  // Fetch 30 to account for filtering

      if (error) {
        console.error('Error fetching news:', error);
        setNews([]);  // Clear news on error
      } else if (data && data.length > 0) {
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

        setNews(validNews.slice(0, 20));  // Take top 20 after filtering
      } else {
        setNews([]);  // Clear news if no data
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setNews([]);  // Clear news on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);


  const formatDate = (dateString: string) => {
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
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return publishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const openNewsArticle = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('Failed to open URL:', err);
        alert('Could not open article');
      });
    }
  };

  const filteredNews = news.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const onRefresh = () => {
    fetchNews(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EAB308"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>GIDI NEWS</Text>
          <Text style={styles.headerIcon}>📰</Text>
        </View>

        {/* Page Title */}
        <View style={styles.titleSection}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.title}>Latest Lagos News</Text>
          <Text style={styles.subtitle}>Stay updated with what's happening in Lagos</Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  activeCategory === category && styles.categoryButtonTextActive
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* News Feed */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>
            {filteredNews.length} articles found
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#EAB308" style={styles.loader} />
          ) : (
            filteredNews.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.newsCard}
                onPress={() => openNewsArticle(article.external_url)}
              >
                {article.featured_image_url && (
                  <Image
                    source={{ uri: article.featured_image_url }}
                    style={styles.newsImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.newsContent}>
                  <View style={styles.newsHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{article.category}</Text>
                    </View>
                    <Text style={styles.newsTime}>{formatDate(article.publish_date)}</Text>
                  </View>

                  <Text style={styles.newsTitle}>{article.title}</Text>
                  <Text style={styles.newsSummary}>{article.summary}</Text>

                  <View style={styles.newsFooter}>
                    {article.source && (
                      <Text style={styles.newsSource}>📰 {article.source}</Text>
                    )}
                    {article.external_url && (
                      <Text style={styles.readMore}>Read More →</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
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
  backButton: {
    fontSize: 24,
    color: '#EAB308',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EAB308',
    letterSpacing: 1.5,
  },
  headerIcon: {
    fontSize: 20,
  },
  // Title
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  // Categories
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#EAB308',
    borderColor: '#EAB308',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#000',
  },
  // News Section
  newsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  loader: {
    marginTop: 32,
  },
  // News Card
  newsCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 16,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#27272a',
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  newsTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 24,
  },
  newsSummary: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 12,
    color: '#6b7280',
  },
  readMore: {
    fontSize: 12,
    color: '#EAB308',
    fontWeight: '600',
  },
});
