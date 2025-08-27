import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Explore = () => {
  const featuredVenues = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "BORDELLE CITY",
      category: "Club",
      rating: 4.8,
      location: "Victoria Island",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800"
    },
    {
      id: "22222222-2222-2222-2222-222222222222", 
      name: "FLAVOUR HOUSE",
      category: "Restaurant",
      rating: 4.6,
      location: "Lekki Phase 1",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Explore Lagos</h1>
            <p className="text-muted-foreground">Discover the best venues in the city</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search venues, events, or locations..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Categories</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["All", "Clubs", "Restaurants", "Bars", "Lounges", "Rooftops"].map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Venues */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Featured Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredVenues.map((venue) => (
                <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3" variant="secondary">
                      {venue.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-foreground mb-2">{venue.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{venue.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{venue.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Explore;