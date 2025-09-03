import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SearchSection } from "@/components/SearchSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { RecommendationSection } from "@/components/RecommendationSection";
import { LiveNewsSection } from "@/components/LiveNewsSection";
import { LiveVenueSection } from "@/components/LiveVenueSection";
import { PopularDestinations } from "@/components/PopularDestinations";
import { FeaturesSection } from "@/components/FeaturesSection";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <CategoryGrid />
        <LiveNewsSection />
        <LiveVenueSection />
        <RecommendationSection />
        <PopularDestinations />
        <FeaturesSection />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Index;
