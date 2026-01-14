import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { TrendingUp, Users, User as UserIcon, Camera, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
  is_joined?: boolean;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  community_id: string;
  likes_count: number;
  comments_count: number;
  profiles?: {
    full_name: string;
  };
  communities?: {
    name: string;
  };
}

const Social = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'communities' | 'people'>('feed');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch communities from database
  useEffect(() => {
    fetchCommunities();
    fetchFeedPosts();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_active', true)
        .order('member_count', { ascending: false });

      if (error) throw error;

      if (data) {
        // TODO: Check which communities the user has joined
        // For now, mark all as not joined
        const communitiesWithJoinStatus = data.map(community => ({
          ...community,
          is_joined: false
        }));
        setCommunities(communitiesWithJoinStatus);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles!social_posts_user_id_fkey(full_name),
          communities(name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        setFeedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Silently fail - feed will show empty
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to join communities",
          variant: "destructive",
        });
        return;
      }

      const community = communities.find(c => c.id === communityId);
      const isJoined = community?.is_joined;

      if (isJoined) {
        // Leave community
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('user_id', user.id)
          .eq('community_id', communityId);

        if (error) throw error;

        toast({
          title: "Left Community",
          description: `You've left ${community?.name}`,
        });
      } else {
        // Join community
        const { error } = await supabase
          .from('community_members')
          .insert({
            user_id: user.id,
            community_id: communityId,
            role: 'member'
          });

        if (error) throw error;

        toast({
          title: "Joined Community",
          description: `Welcome to ${community?.name}!`,
        });
      }

      // Update local state
      setCommunities(communities.map(c =>
        c.id === communityId ? { ...c, is_joined: !isJoined } : c
      ));

      // Refresh communities to get updated member count
      fetchCommunities();
    } catch (error) {
      console.error('Error joining/leaving community:', error);
      toast({
        title: "Error",
        description: "Failed to update community membership",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 dark">
      <Header />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Social Hub Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Social Hub</h1>
            <p className="text-muted-foreground">
              Connect with the GIDI community, join discussions, and share your experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
              <Input
                placeholder="Search communities, people, or posts..."
                className="pl-12 pr-4 py-3 text-base bg-card border-border rounded-xl"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <Button
              variant={activeTab === 'feed' ? 'default' : 'outline'}
              onClick={() => setActiveTab('feed')}
              className={`rounded-xl ${activeTab === 'feed' ? 'bg-primary text-black' : 'bg-card border-border'}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Feed
            </Button>
            <Button
              variant={activeTab === 'communities' ? 'default' : 'outline'}
              onClick={() => setActiveTab('communities')}
              className={`rounded-xl ${activeTab === 'communities' ? 'bg-primary text-black' : 'bg-card border-border'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Communities
            </Button>
            <Button
              variant={activeTab === 'people' ? 'default' : 'outline'}
              onClick={() => setActiveTab('people')}
              className={`rounded-xl ${activeTab === 'people' ? 'bg-primary text-black' : 'bg-card border-border'}`}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              People
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'feed' && (
                <>
                  {/* Create Post Button */}
                  <Button className="w-full mb-6 h-14 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl">
                    <Camera className="w-5 h-5 mr-2" />
                    Create Post
                  </Button>

                  {/* Feed Posts */}
                  <div className="space-y-4">
                    {feedPosts.length === 0 ? (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <MessageCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Be the first to share something with the community!
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      feedPosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            {/* Post Header */}
                            <div className="flex items-start gap-3 mb-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {getInitials(post.profiles?.full_name || 'Anonymous User')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">
                                  {post.profiles?.full_name || 'Anonymous User'}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{post.communities?.name || 'General'}</span>
                                  <span>•</span>
                                  <span>{formatTimeAgo(post.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Post Content */}
                            <div className="mb-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {post.content}
                              </p>
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center gap-6 pt-4 border-t border-border">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                <span>{post.likes_count || 0}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                <span>{post.comments_count || 0}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              )}

              {activeTab === 'communities' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">All Communities</h2>
                  {loading ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">Loading communities...</p>
                      </CardContent>
                    </Card>
                  ) : communities.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Communities Yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Be the first to create a community!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    communities.map((community) => (
                      <Card key={community.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                                {community.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{community.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {community.member_count.toLocaleString()} {community.member_count === 1 ? 'member' : 'members'}
                                </p>
                                {community.description && (
                                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                                    {community.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant={community.is_joined ? "outline" : "default"}
                              className={community.is_joined ? "" : "bg-primary hover:bg-primary/90 text-black"}
                              onClick={() => handleJoinCommunity(community.id)}
                            >
                              {community.is_joined ? "Joined" : "Join"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'people' && (
                <div className="text-center py-12">
                  <UserIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Find People</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Discover and connect with other members of the GIDI community
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Top Communities */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Top Communities</h3>
                    <div className="space-y-4">
                      {communities.slice(0, 5).map((community) => (
                        <div key={community.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-xl">
                              {community.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{community.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {community.member_count.toLocaleString()} members
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={community.is_joined ? "outline" : "default"}
                            className={`text-xs ${community.is_joined ? "" : "bg-primary hover:bg-primary/90 text-black"}`}
                            onClick={() => handleJoinCommunity(community.id)}
                          >
                            {community.is_joined ? "Joined" : "Join"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Social;
