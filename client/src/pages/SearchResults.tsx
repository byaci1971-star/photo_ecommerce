import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavigationMenu } from "@/components/NavigationMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";

export default function SearchResults() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const query = params.get("q") || "";
  
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: results } = trpc.products.search.useQuery({ query });
  const addToCartMutation = trpc.cart.addItem.useMutation();

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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <Link href="/">
            <a className="flex items-center gap-2 flex-shrink-0">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
              <span className="font-bold text-lg">{APP_TITLE}</span>
            </a>
          </Link>
          <NavigationMenu />
          <SearchBar />
          <div className="flex gap-4 items-center flex-shrink-0">
            <LanguageSwitcher />
            <Link href="/cart">
              <a className="relative">
                <ShoppingCart className="h-6 w-6" />
              </a>
            </Link>
            {isAuthenticated ? (
              <Link href="/account">
                <a className="text-sm hover:text-primary">{user?.name || "Account"}</a>
              </Link>
            ) : (
              <Button size="sm" asChild>
                <a href={getLoginUrl()}>{t('nav.login', language)}</a>
              </Button>
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Résultats de recherche pour "{query}"
          </h1>
          {results && (
            <p className="text-gray-600">
              {results.length} produit{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product) => (
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
            <p className="text-gray-500 mb-4">Aucun produit trouvé pour "{query}"</p>
            <Button asChild>
              <Link href="/">
                <a>Retour à l'accueil</a>
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
