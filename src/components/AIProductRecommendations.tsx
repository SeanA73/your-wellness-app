import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductRecommendations } from "@/hooks/useProductRecommendations";
import { Sparkles, ExternalLink, Star, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const AIProductRecommendations = () => {
  const { recommendations, reasoning, loading, error, refetch } = useProductRecommendations();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleProductClick = async (product: any) => {
    try {
      await supabase.from("affiliate_clicks").insert({
        user_id: user?.id || null,
        product_id: product.id,
        session_id: crypto.randomUUID(),
        referrer_page: window.location.pathname
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    window.open(product.affiliate_url, "_blank");
    
    toast({
      title: "Opening product page",
      description: `Redirecting to ${product.brand || "store"}...`
    });
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (!user) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>AI Recommendations for You</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {reasoning && (
          <p className="text-sm text-muted-foreground mt-2">{reasoning}</p>
        )}
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{error}</p>
            <Button variant="outline" onClick={refetch} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Complete your profile and log workouts to get personalized recommendations</p>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group cursor-pointer space-y-2"
              >
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  {product.original_price_cents && (
                    <Badge className="absolute top-2 right-2 bg-destructive text-xs">
                      -{Math.round((1 - product.price_cents / product.original_price_cents) * 100)}%
                    </Badge>
                  )}
                </div>
                
                {product.brand && (
                  <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
                )}
                
                <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">
                    {formatPrice(product.price_cents)}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
