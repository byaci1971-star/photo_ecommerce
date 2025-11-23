import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingCart, Heart, Award, Truck } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: categories } = trpc.products.getCategories.useQuery();
  const { data: featuredProducts } = trpc.products.getFeatured.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-2">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
              <span className="font-bold text-lg">{APP_TITLE}</span>
            </a>
          </Link>
          <nav className="hidden md:flex gap-6">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <a className="text-sm hover:text-primary transition-colors">{cat.name}</a>
              </Link>
            ))}
          </nav>
          <div className="flex gap-4 items-center">
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
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Beautiful Photo Products</h1>
          <p className="text-lg mb-8 opacity-90">Transform your memories into stunning photo books, calendars, and more</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">
              <a>Start Creating</a>
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Award-winning print quality</p>
            </div>
            <div className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Quick delivery to your door</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-sm text-gray-600">100% satisfaction promise</p>
            </div>
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600">Simple design tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <a className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-2xl font-bold text-purple-600">
                            CHF {(product.price / 100).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm line-through text-gray-500">
                              CHF {(product.originalPrice / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-gray-50 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Sustainability</a></li>
                <li><a href="#" className="hover:text-primary">Awards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Facebook</a></li>
                <li><a href="#" className="hover:text-primary">Instagram</a></li>
                <li><a href="#" className="hover:text-primary">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
