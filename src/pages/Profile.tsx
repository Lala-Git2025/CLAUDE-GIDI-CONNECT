import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  // Auth state
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Check authentication status
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsGuest(!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setIsGuest(!user);
  };

  const userName = isGuest ? "Guest User" : (user?.user_metadata?.full_name || user?.email || "User");
  const location = "Lagos, Nigeria";

  // User stats
  const stats = [
    { icon: "📍", label: "Venues Visited", value: 0 },
    { icon: "📅", label: "Events Attended", value: 0 },
    { icon: "⭐", label: "Reviews Written", value: 0 },
    { icon: "📷", label: "Photos Uploaded", value: 0 },
  ];

  // Level & Progress
  const currentLevel = 1;
  const currentXP = 0;
  const maxXP = 100;
  const xpPercentage = (currentXP / maxXP) * 100;

  // Auth handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      setAuthDialogOpen(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });

      setAuthDialogOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const openAuthDialog = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-black pb-16 md:pb-0">
      <Header />

      <main className="pt-16 bg-black">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            {/* Avatar */}
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
              <AvatarFallback className="bg-primary/20 text-primary">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <h1 className="text-2xl font-bold text-white mb-1">{userName}</h1>
            <p className="text-gray-400 mb-6">{location}</p>

            {/* Sign In / Sign Up / Edit Profile Buttons */}
            <div className="w-full max-w-md">
              {isGuest ? (
                <>
                  <div className="flex gap-3 mb-3">
                    <Button
                      onClick={() => openAuthDialog('signin')}
                      className="flex-1 h-14 bg-primary hover:bg-primary/90 text-black font-semibold text-base"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Button>
                    <Button variant="outline" size="icon" className="h-14 w-14 border-gray-700 bg-zinc-900 hover:bg-zinc-800">
                      <Settings className="w-5 h-5 text-gray-400" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => openAuthDialog('signup')}
                    variant="outline"
                    className="w-full h-14 border-gray-700 bg-transparent hover:bg-zinc-900 text-white font-semibold text-base"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="flex-1 h-14 border-gray-700 bg-transparent hover:bg-zinc-900 text-white font-semibold text-base"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14 border-gray-700 bg-zinc-900 hover:bg-zinc-800">
                    <Settings className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Auth Dialog */}
          <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  {authMode === 'signin' ? 'Welcome Back!' : 'Create Account'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {authMode === 'signin'
                    ? 'Sign in to your account to continue'
                    : 'Join Gidi Vibe Connect and start exploring Lagos'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4 mt-4">
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-semibold"
                >
                  {loading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  {authMode === 'signin' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="text-primary hover:underline font-semibold"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className="text-primary hover:underline font-semibold"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Your Stats */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                  <div className="text-4xl font-bold text-white">{stat.value}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Level & Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Level & Progress</h2>
              <Badge className="bg-primary text-black font-bold px-4 py-1.5 text-sm">
                LEVEL {currentLevel}
              </Badge>
            </div>

            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                <span>{currentXP} / {maxXP} XP</span>
                <span>{xpPercentage}%</span>
              </div>
              <Progress value={xpPercentage} className="h-3 mb-4" />
              {isGuest && (
                <p className="text-center text-gray-400 text-sm">
                  Sign in to start earning XP
                </p>
              )}
            </Card>
          </div>

          {/* Badges Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Badges</h2>
            <Card className="p-8 bg-zinc-900 border-zinc-800">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Badges Yet</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  {isGuest
                    ? "Sign in and start exploring to earn badges"
                    : "Visit venues, write reviews, and attend events to earn badges"}
                </p>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          {!isGuest && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
              <Card className="p-8 bg-zinc-900 border-zinc-800">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-3xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Your check-ins, reviews, and event attendance will appear here
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Settings & Preferences (for signed-in users) */}
          {!isGuest && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <div className="space-y-3">
                <Card className="p-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔔</span>
                      <span className="font-medium text-white">Notifications</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Card>
                <Card className="p-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔒</span>
                      <span className="font-medium text-white">Privacy</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Card>
                <Card className="p-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">ℹ️</span>
                      <span className="font-medium text-white">About</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
