import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: '',
    sameAsBilling: true,
    billingAddress: '',
    billingCity: '',
    billingZip: '',
    billingCountry: '',
    paymentMethod: 'credit_card',
  });

  const { data: cartItems } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createOrderMutation = trpc.orders.create.useMutation();

  const total = cartItems?.reduce((sum, item) => sum + (item.quantity * 1000), 0) || 0;
  const shipping = 500; // CHF 5.00
  const grandTotal = total + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: "error", text: "Please log in to place an order." });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setMessage({ type: "error", text: "Your cart is empty." });
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        total: grandTotal,
        shippingAddress: `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingZip}, ${formData.shippingCountry}`,
        billingAddress: formData.sameAsBilling 
          ? `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingZip}, ${formData.shippingCountry}`
          : `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingZip}, ${formData.billingCountry}`,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: `Product ${item.productId}`,
          price: 1000,
          quantity: item.quantity,
        })),
      });

      setMessage({ type: "success", text: "Order placed successfully!" });
      setTimeout(() => {
        window.location.href = '/account';
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to place order. Please try again." });
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
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">Please log in to proceed with checkout.</p>
          <Button asChild>
            <Link href="/">
              <a>Back to Home</a>
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/cart">
            <a className="flex items-center gap-2 hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </a>
          </Link>
          <h1 className="text-xl font-bold">{t('checkout.title', language)}</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      {/* Checkout Form */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 border border-border rounded-lg"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.shipping_address', language)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    name="shippingAddress"
                    placeholder="Street Address"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="shippingCity"
                      placeholder="City"
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 border border-border rounded-lg"
                    />
                    <input
                      type="text"
                      name="shippingZip"
                      placeholder="ZIP Code"
                      value={formData.shippingZip}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    name="shippingCountry"
                    placeholder="Country"
                    value={formData.shippingCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.billing_address', language)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="sameAsBilling"
                      checked={formData.sameAsBilling}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{t('checkout.same_as_shipping', language)}</span>
                  </label>

                  {!formData.sameAsBilling && (
                    <>
                      <input
                        type="text"
                        name="billingAddress"
                        placeholder="Street Address"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="billingCity"
                          placeholder="City"
                          value={formData.billingCity}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-border rounded-lg"
                        />
                        <input
                          type="text"
                          name="billingZip"
                          placeholder="ZIP Code"
                          value={formData.billingZip}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-border rounded-lg"
                        />
                      </div>
                      <input
                        type="text"
                        name="billingCountry"
                        placeholder="Country"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      />
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.payment_method', language)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span>{t('checkout.credit_card', language)}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span>{t('checkout.paypal', language)}</span>
                  </label>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Processing..." : t('checkout.place_order', language)}
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/cart">
                    <a>{t('checkout.cancel', language)}</a>
                  </Link>
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>{t('checkout.order_summary', language)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>Product {item.productId} x {item.quantity}</span>
                      <span>CHF {((item.quantity * 1000) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal', language)}</span>
                    <span>CHF {(total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.shipping', language)}</span>
                    <span>CHF {(shipping / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                    <span>{t('cart.total', language)}</span>
                    <span>CHF {(grandTotal / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
