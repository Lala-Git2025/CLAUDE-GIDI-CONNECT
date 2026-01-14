import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  { emoji: '🍸', label: "Bars & Lounges", path: "/explore" },
  { emoji: '🍽️', label: "Restaurants", path: "/explore" },
  { emoji: '📰', label: "GIDI News", path: "/explore" },
  { emoji: '🎵', label: "Nightlife", path: "/explore" },
  { emoji: '☀️', label: "DayLife", path: "/events" },
  { emoji: '📅', label: "Events", path: "/events" },
  { emoji: '🏢', label: "Social", path: "/social" },
  { emoji: '➕', label: "See More", path: "/explore" },
];

export const CategoryGrid = () => {
  return (
    <section className="bg-background py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <Link key={index} to={category.path}>
              <Button
                variant="ghost"
                className="h-24 w-full flex flex-col items-center justify-center gap-3 bg-card hover:bg-card/80 rounded-2xl border border-border transition-all duration-200"
              >
                <span className="text-3xl">{category.emoji}</span>
                <span className="text-sm font-semibold text-foreground text-center">
                  {category.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};