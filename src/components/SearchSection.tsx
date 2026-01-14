import { Input } from "@/components/ui/input";

export const SearchSection = () => {
  return (
    <section className="bg-background py-6 px-4">
      <div className="container mx-auto max-w-md">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          <Input
            placeholder="Search your destination here..."
            className="pl-12 pr-4 py-3 text-base bg-card border-border rounded-3xl focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </section>
  );
};