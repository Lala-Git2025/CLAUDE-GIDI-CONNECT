import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { User, Settings, Heart, Bookmark, Calendar, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const userStats = [
    { label: "Posts", value: "24" },
    { label: "Following", value: "186" },
    { label: "Followers", value: "342" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "post",
      venue: "BORDELLE CITY",
      action: "shared a post",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "like",
      venue: "FLAVOUR HOUSE",
      action: "liked a venue",
      time: "1 day ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back!</h1>
                  <p className="text-muted-foreground mb-4">Lagos Night Explorer</p>
                  
                  <div className="flex justify-center md:justify-start gap-8 mb-4">
                    {userStats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="font-bold text-lg text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button>Edit Profile</Button>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Heart className="w-6 h-6" />
                  <span className="text-sm">Favorites</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Bookmark className="w-6 h-6" />
                  <span className="text-sm">Saved</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">My Events</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">My Posts</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/20">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {activity.type === "post" ? (
                        <Camera className="w-5 h-5 text-primary" />
                      ) : (
                        <Heart className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">
                        You {activity.action} at <span className="font-semibold">{activity.venue}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Profile;