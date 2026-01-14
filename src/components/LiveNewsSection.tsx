import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  featured_image_url?: string;
  publish_date: string;
  source?: string;
  external_url?: string;
  category: string;
  tags: string[];
}

export const LiveNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchNews = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Fetch directly from the news table
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .not('external_url', 'is', null)  // Only fetch articles with valid URLs
        .order('publish_date', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Filter out articles with fake/placeholder URLs
        const validNews = data.filter(item => {
          if (!item.external_url) return false;
          const urlLower = item.external_url.toLowerCase();
          // Exclude fake URLs
          if (urlLower.includes('example.com') ||
              urlLower.includes('localhost') ||
              urlLower.includes('test.com') ||
              urlLower.includes('placeholder')) {
            return false;
          }
          return item.external_url.startsWith('http');
        });

        setNews(validNews);

        if (refresh) {
          toast({
            title: "News Updated",
            description: `Loaded ${validNews.length} latest articles`,
          });
        }
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load latest news",
        variant: "destructive",
      });
      setNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const publishDate = new Date(dateString);
    const diffInMs = now.getTime() - publishDate.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return publishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <section className="bg-background py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Latest GIDI News</h2>
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-2xl font-bold text-foreground">Latest GIDI News 📰</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="text-primary hover:text-primary/80"
          >
            See All →
          </Button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {news.map((article) => (
              <Card
                key={article.id}
                className="flex-none w-60 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => article.external_url && window.open(article.external_url, '_blank')}
              >
                {article.featured_image_url && (
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(article.publish_date)}
                    </span>
                    {article.external_url && (
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">↗</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-2">
                    {article.title}
                  </h3>

                  {article.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};