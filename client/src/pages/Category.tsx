import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || "0");
  const { user } = useAuth();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: products } = trpc.products.getByCategory.useQuery({ categoryId });
  const addToCartMutation = trpc.cart.addItem.useMutation();

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      setMessage({ type: "error", text: "Please log in to add items to your cart." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      setMessage({ type: "success", text: "Product added to cart!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add product to cart." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-2 hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </a>
          </Link>
          <h1 className="text-xl font-bold">Products</h1>
          <Link href="/cart">
            <a className="relative">
              <ShoppingCart className="h-6 w-6" />
            </a>
          </Link>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      {/* Products Grid */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/product/${product.id}`}>
                <a>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                  />
                </a>
              </Link>
              <CardHeader>
                <Link href={`/product/${product.id}`}>
                  <a className="hover:text-primary">
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  </a>
                </Link>
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
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found in this category.</p>
            <Button asChild>
              <Link href="/">
                <a>Back to Home</a>
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
