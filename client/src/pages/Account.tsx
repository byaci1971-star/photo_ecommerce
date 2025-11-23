import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ChevronLeft, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');

  const { data: orders } = trpc.orders.getUserOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
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
            <h1 className="text-xl font-bold">{t('account.title', language)}</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">Please log in to view your account.</p>
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
          <Link href="/">
            <a className="flex items-center gap-2 hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </a>
          </Link>
          <h1 className="text-xl font-bold">{t('account.title', language)}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {t('account.logout', language)}
          </Button>
        </div>
      </header>

      {/* Account Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{user?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-600">{user?.email}</p>
                <div className="border-t border-border pt-4 space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeTab === 'profile'
                        ? 'bg-purple-50 text-purple-600 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {t('account.profile', language)}
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeTab === 'orders'
                        ? 'bg-purple-50 text-purple-600 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {t('account.orders', language)}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('account.profile', language)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Name</label>
                    <p className="text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Member Since</label>
                    <p className="text-lg">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(language) : 'N/A'}
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">{t('account.order_history', language)}</h2>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-600">Order ID</label>
                              <p className="text-lg font-semibold">#{order.id}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600">
                                {t('account.order_date', language)}
                              </label>
                              <p className="text-lg">
                                {new Date(order.createdAt).toLocaleDateString(language)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600">
                                {t('account.order_status', language)}
                              </label>
                              <p className="text-lg capitalize">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {order.status}
                                </span>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600">
                                {t('account.order_total', language)}
                              </label>
                              <p className="text-lg font-bold text-purple-600">
                                CHF {(order.total / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="border-t border-border mt-4 pt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/order/${order.id}`}>
                                <a>{t('account.view_details', language)}</a>
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 mb-4">No orders yet.</p>
                      <Button asChild>
                        <Link href="/">
                          <a>Start Shopping</a>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
