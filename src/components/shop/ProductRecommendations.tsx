import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  short_description: string;
  price_cents: number;
  original_price_cents: number | null;
  affiliate_url: string;
  image_url: string | null;
  brand: string | null;
  rating: number | null;
  review_count: number;
  is_featured: boolean;
}

interface ProductRecommendationsProps {
  category?: string;
  tags?: string[];
  limit?: number;
  title?: string;
  context?: string;
}

export const ProductRecommendations = ({
  category,
  tags = [],
  limit = 4,
  title = "Recommended Products",
  context = "general"
}: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [category, tags]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("affiliate_products")
        .select("*")
        .eq("is_active", true);

      if (category) {
        query = query.eq("category", category);
      }

      if (tags.length > 0) {
        query = query.overlaps("tags", tags);
      }

      query = query.order("is_featured", { ascending: false })
        .order("rating", { ascending: false })
        .limit(limit);

      const { data } = await query;
      if (data) setProducts(data);
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (product: Product) => {
    try {
      await supabase.from("affiliate_clicks").insert({
        user_id: user?.id || null,
        product_id: product.id,
        session_id: crypto.randomUUID(),
        referrer_page: window.location.pathname
      });
    } catch (error) {
      // Silent fail
    }

    window.open(product.affiliate_url, "_blank");
    
    toast({
      title: "Opening product",
      description: `Redirecting to ${product.brand || "store"}...`
    });
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/shop")}>
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
            onClick={() => handleProductClick(product)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted overflow-hidden">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                {product.original_price_cents && (
                  <Badge className="absolute top-2 right-2 bg-destructive">
                    Save {Math.round((1 - product.price_cents / product.original_price_cents) * 100)}%
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="p-4 space-y-2">
                {product.brand && (
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                )}
                <h4 className="font-semibold line-clamp-2 min-h-[2.5rem] text-sm">
                  {product.name}
                </h4>

                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.review_count})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-primary">
                      {formatPrice(product.price_cents)}
                    </span>
                    {product.original_price_cents && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.original_price_cents)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
