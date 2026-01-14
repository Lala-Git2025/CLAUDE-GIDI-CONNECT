import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Section - Back Button or Logo */}
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-orbitron tracking-wider">
              <span className="text-primary">GIDI CONNECT</span>
            </span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </Link>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-2xl">
            🔍
          </Button>

          <Button variant="ghost" size="icon" className="relative text-2xl">
            🔔
            {/* Notification dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
};