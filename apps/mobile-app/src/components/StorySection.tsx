import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

interface Story {
  id: string;
  user: string;
  image: string;
  isCreator: boolean;
}

const STORIES: Story[] = [
  { id: 's1', user: 'Zilla', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200', isCreator: true },
  { id: 's2', user: 'LagosEats', image: 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=200', isCreator: true },
  { id: 's3', user: 'David', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200', isCreator: false },
  { id: 's4', user: 'Sarah', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', isCreator: false },
  { id: 's5', user: 'Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', isCreator: false },
  { id: 's6', user: 'Linda', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', isCreator: false },
];

export const StorySection = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Your Story */}
        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.addStoryCircle}>
            <Text style={styles.addIcon}>➕</Text>
          </View>
          <Text style={styles.storyUsername}>My Vibe</Text>
        </TouchableOpacity>

        {/* Stories */}
        {STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View style={[
              styles.storyCircle,
              story.isCreator ? styles.creatorGradient : styles.userGradient
            ]}>
              <View style={styles.innerCircle}>
                <Image
                  source={{ uri: story.image }}
                  style={styles.storyImage}
                  resizeMode="cover"
                />
              </View>
              {story.isCreator && (
                <View style={styles.creatorBadge}>
                  <Text style={styles.starIcon}>⭐</Text>
                </View>
              )}
            </View>
            <Text style={styles.storyUsername} numberOfLines={1}>
              {story.user}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  addStoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#27272a',
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
  },
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    position: 'relative',
  },
  creatorGradient: {
    backgroundColor: '#EAB308', // Primary yellow
  },
  userGradient: {
    backgroundColor: '#a855f7', // Purple
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  creatorBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EAB308',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    fontSize: 10,
  },
  storyUsername: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    maxWidth: 64,
    textAlign: 'center',
  },
});
