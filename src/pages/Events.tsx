import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Calendar, MapPin, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Lagos Night Fever",
      venue: "BORDELLE CITY",
      date: "2024-01-15",
      time: "10:00 PM",
      attendees: 245,
      category: "Nightlife",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
    },
    {
      id: 2,
      title: "Afrobeat Live Session",
      venue: "FLAVOUR HOUSE", 
      date: "2024-01-18",
      time: "8:00 PM",
      attendees: 120,
      category: "Live Music",
      image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
            <p className="text-muted-foreground">Don't miss out on the hottest events in Lagos</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["All Events", "Tonight", "This Week", "Nightlife", "Live Music", "Comedy"].map((filter) => (
                <Button
                  key={filter}
                  variant={filter === "All Events" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-64">
                      <img 
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {event.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6 flex-1">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h3 className="font-bold text-xl text-foreground mb-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-4">at {event.venue}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 text-secondary" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4 text-accent" />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1">
                            Get Tickets
                          </Button>
                          <Button variant="outline">
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
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

export default Events;