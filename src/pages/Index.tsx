import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { StorySection } from "@/components/StorySection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { LiveNewsSection } from "@/components/LiveNewsSection";
import { TrafficAlert } from "@/components/TrafficAlert";
import { VibeCheck } from "@/components/VibeCheck";
import { TrendingVenues } from "@/components/TrendingVenues";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    if (hour < 12) return `${day} MORNING`;
    if (hour < 17) return `${day} AFTERNOON`;
    if (hour < 21) return `${day} EVENING`;
    return `${day} NIGHT`;
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 dark">
      <Header />

      <main className="pt-16">
        {/* Time-based Greeting */}
        <div className="bg-background px-4 pt-6 pb-4">
          <div className="container mx-auto max-w-6xl">
            <p className="text-sm text-muted-foreground tracking-wider font-medium">
              {getCurrentTimeGreeting()}
            </p>
          </div>
        </div>

        <SearchSection />
        <StorySection />
        <CategoryGrid />
        <LiveNewsSection />
        <TrafficAlert />
        <VibeCheck />
        <TrendingVenues />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Index;
