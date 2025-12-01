import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FitMateHeader from "@/components/FitMateHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ExternalLink, TrendingUp, Award, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  short_description: string;
  description: string;
  category: string;
  subcategory: string;
  price_cents: number;
  original_price_cents: number | null;
  currency: string;
  affiliate_url: string;
  image_url: string;
  brand: string;
  rating: number;
  review_count: number;
  features: any;
  tags: string[];
  is_featured: boolean;
}

const CoachPicks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate_products")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
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

  const categories = [
    { value: "all", label: "All Products" },
    { value: "equipment", label: "Equipment" },
    { value: "nutrition", label: "Nutrition" },
    { value: "wearables", label: "Wearables" },
    { value: "recovery", label: "Recovery" },
    { value: "accessories", label: "Accessories" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const featuredProducts = products.filter((p) => p.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FitMateHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-4">
            <Award className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">Coach's Picks</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gear That <span className="text-primary">Gets Results</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked fitness equipment and nutrition products trusted by the FitMate community.
            Every purchase helps support your fitness journey.
          </p>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Featured This Week</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {product.short_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price_cents, product.currency)}
                      </span>
                      {product.original_price_cents && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.original_price_cents, product.currency)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.features?.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        trackClick(product.id, product.name);
                        window.open(product.affiliate_url, "_blank");
                      }}
                    >
                      View on Amazon <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                {product.original_price_cents && (
                  <Badge className="absolute top-3 right-3 bg-accent">
                    {Math.round(
                      ((product.original_price_cents - product.price_cents) /
                        product.original_price_cents) *
                        100
                    )}
                    % Off
                  </Badge>
                )}
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {product.short_description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(product.price_cents, product.currency)}
                  </span>
                  {product.original_price_cents && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.original_price_cents, product.currency)}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    trackClick(product.id, product.name);
                    window.open(product.affiliate_url, "_blank");
                  }}
                >
                  View Product <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}

        {/* Disclosure */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
          <p>
            <strong>Disclosure:</strong> FitMatePro may earn a commission on purchases made through these links.
            This helps us continue providing free fitness guidance to our community. We only recommend products
            that align with our mission to support your wellness journey.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoachPicks;
