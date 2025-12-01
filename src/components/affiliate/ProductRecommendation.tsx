import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  short_description: string;
  price_cents: number;
  original_price_cents: number | null;
  currency: string;
  affiliate_url: string;
  image_url: string;
  brand: string;
  rating: number;
  tags: string[];
}

interface ProductRecommendationProps {
  context: "workout" | "nutrition" | "wellness" | "recovery";
  title?: string;
  description?: string;
  limit?: number;
}

const contextToTags: Record<string, string[]> = {
  workout: ["strength", "dumbbells", "resistance-bands", "home-gym"],
  nutrition: ["meal-prep", "protein", "supplements", "nutrition"],
  wellness: ["yoga", "meditation", "recovery", "mental-wellness"],
  recovery: ["foam-roller", "recovery", "massage", "muscle-relief"],
};

const ProductRecommendation = ({
  context,
  title = "Recommended for You",
  description = "Products that can help enhance your fitness journey",
  limit = 3,
}: ProductRecommendationProps) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [context]);

  const fetchProducts = async () => {
    try {
      const tags = contextToTags[context] || [];
      const { data, error } = await supabase
        .from("affiliate_products")
        .select("*")
        .eq("is_active", true)
        .overlaps("tags", tags)
        .order("rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (productId: string, productName: string) => {
    try {
      await supabase.from("affiliate_clicks").insert({
        user_id: user?.id || null,
        product_id: productId,
        referrer_page: window.location.pathname,
        user_agent: navigator.userAgent,
      });

      toast.success(`Opening ${productName}...`);
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-32">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.original_price_cents && (
                <Badge className="absolute top-2 right-2 bg-accent">
                  {Math.round(
                    ((product.original_price_cents - product.price_cents) /
                      product.original_price_cents) *
                      100
                  )}
                  % Off
                </Badge>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span>{product.rating}</span>
                </div>
              </div>
              <CardDescription className="text-xs line-clamp-2">
                {product.short_description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price_cents, product.currency)}
                </span>
                {product.original_price_cents && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.original_price_cents, product.currency)}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => {
                  trackClick(product.id, product.name);
                  window.open(product.affiliate_url, "_blank");
                }}
              >
                View Product <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        <p>
          💡 <strong>Community picks</strong> - These products are trusted by FitMate users. We may earn a commission on purchases.
        </p>
      </div>
    </div>
  );
};

export default ProductRecommendation;
