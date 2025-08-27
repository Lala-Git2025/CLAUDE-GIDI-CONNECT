import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Rocket, Users, Zap, Shield, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GetStarted = () => {
  const features = [
    {
      icon: Globe,
      title: "Discover Lagos",
      description: "Find the hottest venues, clubs, and restaurants in the city"
    },
    {
      icon: Users,
      title: "Connect with Night Owls",
      description: "Meet like-minded people who love Lagos nightlife"
    },
    {
      icon: Zap,
      title: "Live Updates",
      description: "Get real-time updates on events and venue activities"
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Bookmark your favorite spots and never miss out"
    },
    {
      icon: Shield,
      title: "Verified Venues",
      description: "Only the best, verified establishments on our platform"
    },
    {
      icon: Rocket,
      title: "Exclusive Access",
      description: "Get access to VIP events and special offers"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Rocket className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                GIDI CONNECT
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your gateway to Lagos's vibrant nightlife. Connect, discover, and experience the city like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Create Account
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Why Choose GIDI CONNECT?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to explore Lagos?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of night owls already using GIDI CONNECT to discover the best of Lagos nightlife.
              </p>
              <Button size="lg" className="text-lg px-8">
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default GetStarted;