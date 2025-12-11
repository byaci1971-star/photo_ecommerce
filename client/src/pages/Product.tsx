import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { ChevronLeft, ShoppingCart, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: product } = trpc.products.getById.useQuery({ id: productId });
  const addToCartMutation = trpc.cart.addItem.useMutation();

  const handleAddToCart = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Please log in to add items to your cart." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ productId, quantity });
      setMessage({ type: "success", text: `Added ${quantity} item(s) to cart!` });
      setTimeout(() => setMessage(null), 3000);
      setQuantity(1);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add product to cart." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">
              <a className="flex items-center gap-2 hover:text-primary">
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </a>
            </Link>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Product not found.</p>
        </main>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Product Details</h1>
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

      {/* Product Details */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-purple-600">
                  CHF {(product.price / 100).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl line-through text-gray-500">
                    CHF {(product.originalPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Stock: <span className="font-semibold">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                </p>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-l border-r border-border">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <Link href={`/studio?productId=${productId}`}>
                <a className="block">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    ✨ Create Custom Product
                  </Button>
                </a>
              </Link>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock === 0}
              >
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-bold mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Award-winning print quality with vibrant colors and sharp details.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-sm text-gray-600">Sustainably produced with environmentally conscious materials.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-sm text-gray-600">100% satisfaction guarantee or your money back.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
