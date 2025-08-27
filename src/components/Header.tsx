import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-sm">GC</span>
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            GIDI CONNECT
          </span>
        </Link>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/explore" 
            className={`transition-colors font-medium ${
              location.pathname === '/explore' ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Explore
          </Link>
          <Link 
            to="/events" 
            className={`transition-colors font-medium ${
              location.pathname === '/events' ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Events
          </Link>
          <Link 
            to="/#community" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Community
          </Link>
          <Link 
            to="/#about" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/get-started">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};