import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';

export default function ProfileScreen() {
  // Load Orbitron font
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  const isGuest = true;
  const userName = isGuest ? "Guest User" : "Femi Moritiwon";
  const location = "Lagos, Nigeria";

  const stats = [
    { icon: "📍", label: "Venues Visited", value: 0 },
    { icon: "📅", label: "Events Attended", value: 0 },
    { icon: "⭐", label: "Reviews Written", value: 0 },
    { icon: "📷", label: "Photos Uploaded", value: 0 },
  ];

  const currentLevel = 1;
  const currentXP = 0;
  const maxXP = 100;
  const xpPercentage = (currentXP / maxXP) * 100;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.appName}>PROFILE</Text>
          <Text style={styles.headerIcon}>🔔</Text>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userLocation}>{location}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInButtonText}>🔑 Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Your Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Level & Progress */}
        <View style={styles.section}>
          <View style={styles.levelHeader}>
            <Text style={styles.sectionTitle}>Level & Progress</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>LEVEL {currentLevel}</Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>{currentXP} / {maxXP} XP</Text>
              <Text style={styles.progressText}>{xpPercentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${xpPercentage}%` }]} />
            </View>
            {isGuest && (
              <Text style={styles.progressMessage}>Sign in to start earning XP</Text>
            )}
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesCard}>
            <View style={styles.badgeIconContainer}>
              <Text style={styles.badgeIcon}>🏆</Text>
            </View>
            <Text style={styles.badgeTitle}>No Badges Yet</Text>
            <Text style={styles.badgeMessage}>
              {isGuest
                ? "Sign in and start exploring to earn badges"
                : "Visit venues, write reviews, and attend events to earn badges"}
            </Text>
          </View>
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
  appName: {
    fontSize: 20,
    fontFamily: 'Orbitron_900Black',
    color: '#EAB308',
    letterSpacing: 2,
  },
  headerIcon: {
    fontSize: 20,
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderWidth: 4,
    borderColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 64,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 400,
    marginBottom: 12,
  },
  signInButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#EAB308',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  settingsButton: {
    width: 56,
    height: 56,
    backgroundColor: '#27272a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    fontSize: 20,
    color: '#9ca3af',
  },
  signUpButton: {
    width: '100%',
    maxWidth: 400,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 24,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    flex: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Level & Progress
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  progressCard: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 24,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#27272a',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EAB308',
  },
  progressMessage: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Badges
  badgesCard: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 32,
    alignItems: 'center',
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  badgeMessage: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 300,
  },
});
