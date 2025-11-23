import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: cartItems, refetch } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const removeFromCartMutation = trpc.cart.removeItem.useMutation();
  const clearCartMutation = trpc.cart.clear.useMutation();

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeFromCartMutation.mutateAsync({ cartItemId });
      refetch();
      setMessage({ type: "success", text: "Item removed from cart." });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove item." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCartMutation.mutateAsync();
        refetch();
        setMessage({ type: "success", text: "Cart cleared." });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to clear cart." });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  if (!isAuthenticated) {
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
            <h1 className="text-xl font-bold">Shopping Cart</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">Please log in to view your cart.</p>
          <Button asChild>
            <Link href="/">
              <a>Back to Home</a>
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  const total = cartItems?.reduce((sum, item) => sum + (item.quantity * 1000), 0) || 0; // Placeholder calculation

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
          <h1 className="text-xl font-bold">Shopping Cart</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      {/* Cart Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Product ID: {item.productId}</h3>
                          <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeFromCartMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-6"
                onClick={handleClearCart}
                disabled={clearCartMutation.isPending}
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>CHF {(total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>CHF 5.00</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>CHF {((total + 500) / 100).toFixed(2)}</span>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">
                      <a>Proceed to Checkout</a>
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">
                      <a>Continue Shopping</a>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/">
                <a>Start Shopping</a>
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
