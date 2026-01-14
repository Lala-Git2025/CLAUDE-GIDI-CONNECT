import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';

const events = [
  { id: 1, title: "Lagos Fashion Week", date: "2025-01-15", time: "18:00", location: "Eko Atlantic", category: "Fashion", price: "₦5,000 - ₦20,000" },
  { id: 2, title: "Afrobeat Night", date: "2025-01-20", time: "21:00", location: "Hard Rock Cafe", category: "Music", price: "₦3,000" },
  { id: 3, title: "Art Exhibition", date: "2025-01-25", time: "14:00", location: "Terra Kulture", category: "Art", price: "Free" },
  { id: 4, title: "Rooftop Sunset Party", date: "2025-01-28", time: "17:00", location: "Quilox", category: "Party", price: "₦10,000" },
  { id: 5, title: "Food Festival", date: "2025-02-05", time: "12:00", location: "Victoria Island", category: "Food", price: "₦2,500" },
];

export default function EventsScreen() {
  const [activeFilter, setActiveFilter] = useState("All Events");

  // Load Orbitron font
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  const filters = ["All Events", "Music", "Party", "Art", "Food", "Fashion"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEvents = events.filter(event => {
    if (activeFilter === "All Events") return true;
    return event.category === activeFilter;
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appName}>EVENTS</Text>
          </View>
          <Text style={styles.headerIcon}>🔔</Text>
        </View>

        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Events in Lagos</Text>
          <Text style={styles.subtitle}>Discover upcoming experiences</Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.filterButtonActive
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.filterButtonTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            {filteredEvents.length} events found
          </Text>

          {filteredEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventImagePlaceholder}>
                <Text style={styles.eventIcon}>📅</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{event.category}</Text>
                </View>
              </View>

              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>{formatDate(event.date)}</Text>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.detailIcon}>🕐</Text>
                    <Text style={styles.detailText}>{event.time}</Text>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.detailIcon}>💰</Text>
                    <Text style={styles.detailText}>{event.price}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.ticketButton}
                  onPress={() => alert(`${event.title}\n\n📅 ${formatDate(event.date)}\n🕐 ${event.time}\n📍 ${event.location}\n💰 ${event.price}\n\nTicket booking feature coming soon!`)}
                >
                  <Text style={styles.ticketButtonText}>Get Tickets</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
  // Title
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
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
  // Filters
  filtersSection: {
    marginBottom: 24,
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#EAB308',
    borderColor: '#EAB308',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#000',
  },
  // Events
  eventsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  eventIcon: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#EAB308',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  eventDetails: {
    gap: 12,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  ticketButton: {
    backgroundColor: '#EAB308',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ticketButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
