import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';

type Tab = 'feed' | 'communities' | 'people';

const COMMUNITIES = [
  { id: 1, name: "Nightlife Lagos", members: "12,453 members", icon: "🌙", joined: true },
  { id: 2, name: "Restaurant Reviews", members: "8,932 members", icon: "🍽️", joined: true },
  { id: 3, name: "Events & Concerts", members: "15,672 members", icon: "🎵", joined: false },
  { id: 4, name: "Island Vibes", members: "6,234 members", icon: "🏝️", joined: false },
  { id: 5, name: "Mainland Connect", members: "5,891 members", icon: "🏙️", joined: true },
];

const FEED_POSTS = [
  {
    id: 1,
    author: "Sarah Johnson",
    community: "Nightlife Lagos",
    time: "2 hours ago",
    avatar: "SJ",
    content: "Just discovered this amazing rooftop bar in VI! 🏙️",
    fullText: "The view is absolutely breathtaking. They have live DJ sets on Fridays. Highly recommend checking out SkyLounge!",
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    author: "Michael Ade",
    community: "Restaurant Reviews",
    time: "5 hours ago",
    avatar: "MA",
    content: "Best jollof rice I've had in months! 🍚",
    fullText: "Visited Terra Kulture's restaurant today and the food was exceptional. The ambiance is also perfect for a date night.",
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    author: "Chioma Okafor",
    community: "Events & Concerts",
    time: "1 day ago",
    avatar: "CO",
    content: "Who else is going to the Afrobeats Festival this weekend? 🎶",
    fullText: "Just got my tickets! Can't wait to see Burna Boy and Wizkid perform. DM me if you want to meet up!",
    likes: 412,
    comments: 67,
  },
];

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');

  // Load Orbitron font
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appName}>SOCIAL</Text>
        </View>
        <Text style={styles.headerIcon}>🔔</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities, people, or posts..."
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
            📈 Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'communities' && styles.tabActive]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[styles.tabText, activeTab === 'communities' && styles.tabTextActive]}>
            👥 Communities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'people' && styles.tabActive]}
          onPress={() => setActiveTab('people')}
        >
          <Text style={[styles.tabText, activeTab === 'people' && styles.tabTextActive]}>
            👤 People
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <>
            {/* Create Post Button */}
            <TouchableOpacity style={styles.createPostButton}>
              <Text style={styles.createPostIcon}>📷</Text>
              <Text style={styles.createPostText}>Create Post</Text>
            </TouchableOpacity>

            {/* Feed Posts */}
            {FEED_POSTS.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.avatar}</Text>
                  </View>
                  <View style={styles.postAuthorInfo}>
                    <Text style={styles.postAuthor}>{post.author}</Text>
                    <View style={styles.postMeta}>
                      <Text style={styles.postMetaText}>{post.community}</Text>
                      <Text style={styles.postMetaText}> • </Text>
                      <Text style={styles.postMetaText}>{post.time}</Text>
                    </View>
                  </View>
                </View>

                {/* Post Content */}
                <View style={styles.postContent}>
                  <Text style={styles.postContentTitle}>{post.content}</Text>
                  <Text style={styles.postContentText}>{post.fullText}</Text>
                </View>

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>👍</Text>
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Communities Tab */}
        {activeTab === 'communities' && (
          <>
            <Text style={styles.sectionTitle}>All Communities</Text>
            {COMMUNITIES.map((community) => (
              <View key={community.id} style={styles.communityCard}>
                <View style={styles.communityInfo}>
                  <View style={styles.communityIcon}>
                    <Text style={styles.communityIconText}>{community.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.communityMembers}>{community.members}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.joinButton, community.joined && styles.joinedButton]}
                >
                  <Text style={[styles.joinButtonText, community.joined && styles.joinedButtonText]}>
                    {community.joined ? 'Joined' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* People Tab */}
        {activeTab === 'people' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👤</Text>
            <Text style={styles.emptyStateTitle}>Find People</Text>
            <Text style={styles.emptyStateText}>
              Discover and connect with other members of the GIDI community
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Orbitron_900Black',
    color: '#EAB308',
    letterSpacing: 2,
  },
  headerIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#EAB308',
    borderColor: '#EAB308',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAB308',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  createPostIcon: {
    fontSize: 20,
  },
  createPostText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  postCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postMetaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  postContent: {
    marginBottom: 12,
  },
  postContentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  postContentText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
    marginBottom: 12,
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityIconText: {
    fontSize: 24,
  },
  communityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 13,
    color: '#6b7280',
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#EAB308',
  },
  joinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  joinedButtonText: {
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
});
