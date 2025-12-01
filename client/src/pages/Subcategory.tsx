import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo } from "react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavigationMenu } from "@/components/NavigationMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ProductFilters, FilterState } from "@/components/ProductFilters";
import { SearchBar } from "@/components/SearchBar";

export default function Subcategory() {
  const params = useParams();
  const categoryId = parseInt(params.categoryId || "0");
  const subcategoryId = parseInt(params.subcategoryId || "0");
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
  });

  const { data: categories } = trpc.products.getCategories.useQuery();
  const { data: subcategories } = trpc.products.getSubcategories.useQuery({ categoryId });
  const { data: products } = trpc.products.getBySubcategory.useQuery({ subcategoryId });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const price = product.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      return true;
    });
  }, [products, filters]);

  const addToCartMutation = trpc.cart.addItem.useMutation();

  const category = categories?.find(c => c.id === categoryId);
  const subcategory = subcategories?.find(s => s.id === subcategoryId);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId,
        quantity: 1,
      });
      setMessage({ type: "success", text: t('message.added_to_cart', language) });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add to cart" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-2">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
              <span className="font-bold text-lg">{APP_TITLE}</span>
            </a>
          </Link>
          <NavigationMenu />
          <SearchBar />
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
            <Link href="/cart">
              <a className="relative">
                <ShoppingCart className="h-6 w-6" />
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/account">
                <a className="text-sm hover:text-primary">{user?.name || "Account"}</a>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="border-b border-border bg-gray-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link href="/">
            <a className="hover:text-primary">Home</a>
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/category/${categoryId}`}>
                <a className="hover:text-primary">{category.name}</a>
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-600">{subcategory?.name || 'Sous-catégorie'}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{subcategory?.name || 'Produits'}</h1>
          {subcategory?.description && (
            <p className="text-gray-600">{subcategory.description}</p>
          )}
          {/* Create Custom Product Button */}
          {categoryId === 1 && (
            <div className="mt-4">
              <Link href="/create/photo">
                <a className="inline-block">
                  <Button className="bg-purple-600 hover:bg-purple-700">Créer mes photos personnalisées</Button>
                </a>
              </Link>
            </div>
          )}
          {categoryId === 2 && (
            <div className="mt-4">
              <Link href="/create/book">
                <a className="inline-block">
                  <Button className="bg-purple-600 hover:bg-purple-700">Créer mon livre photo</Button>
                </a>
              </Link>
            </div>
          )}
        </div>

        {/* Products with Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              onFilterChange={setFilters}
              maxPrice={10000}
              availableSizes={['10x15 cm', '13x18 cm', '20x25 cm', '21x30 cm', '30x40 cm']}
              availableColors={['Red', 'Blue', 'Green', 'Black', 'White']}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link href={`/product/${product.id}`}>
                      <a className="block">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform"
                        />
                      </a>
                    </Link>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-purple-600">
                            CHF {(product.price / 100).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm line-through text-gray-500 ml-2">
                              CHF {(product.originalPrice / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addToCartMutation.isPending}
                      >
                        {addToCartMutation.isPending ? "Adding..." : t('products.add_to_cart', language)}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found matching your filters.</p>
                <Button asChild>
                  <Link href="/">
                    <a>Back to Home</a>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
