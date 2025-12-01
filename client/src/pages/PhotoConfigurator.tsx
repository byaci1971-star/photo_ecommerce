import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { ChevronLeft, Upload, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavigationMenu } from '@/components/NavigationMenu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { APP_LOGO, APP_TITLE, getLoginUrl } from '@/const';
import { trpc } from '@/lib/trpc';

export default function PhotoConfigurator() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState('10x15');
  const [selectedFinish, setSelectedFinish] = useState('glossy');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sizes = ['10x15 cm', '13x18 cm', '20x25 cm', '21x30 cm (A4)', '30x40 cm'];
  const finishes = ['Glossy', 'Matte', 'Satin'];
  const pricePerUnit = 299; // CHF 2.99

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages([...uploadedImages, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (uploadedImages.length === 0) {
      setMessage({ type: 'error', text: 'Veuillez télécharger au moins une image' });
      return;
    }

    try {
      // For now, we'll add a placeholder product to cart
      setMessage({ type: 'success', text: 'Produit ajouté au panier!' });
      setTimeout(() => {
        window.location.href = '/cart';
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'ajout au panier' });
    }
  };

  const totalPrice = quantity * pricePerUnit * uploadedImages.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
            <Link href="/">
              <a className="flex items-center gap-2 flex-shrink-0">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
                <span className="font-bold text-lg">{APP_TITLE}</span>
              </a>
            </Link>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">Veuillez vous connecter pour créer des photos personnalisées.</p>
          <Button asChild>
            <a href={getLoginUrl()}>Se connecter</a>
          </Button>
        </main>
      </div>
    );
  }

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
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/category/1/subcategory/1">
            <a className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
              <ChevronLeft className="h-5 w-5" />
              Retour aux photos
            </a>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Créer vos photos personnalisées</h1>
          <p className="text-gray-600">Téléchargez vos images et personnalisez vos impressions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Télécharger vos images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                  <p className="font-medium mb-1">Cliquez pour télécharger</p>
                  <p className="text-sm text-gray-500">ou glissez-déposez vos images</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div>
                    <p className="font-medium mb-3">Images téléchargées ({uploadedImages.length})</p>
                    <div className="grid grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Print Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options d'impression</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Size Selection */}
                <div>
                  <label className="block font-medium mb-3">Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 border rounded-lg transition-colors ${
                          selectedSize === size
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finish Selection */}
                <div>
                  <label className="block font-medium mb-3">Finition</label>
                  <div className="grid grid-cols-3 gap-2">
                    {finishes.map(finish => (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish.toLowerCase())}
                        className={`p-3 border rounded-lg transition-colors ${
                          selectedFinish === finish.toLowerCase()
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block font-medium mb-3">Quantité par image</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Images:</span>
                    <span className="font-medium">{uploadedImages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finition:</span>
                    <span className="font-medium capitalize">{selectedFinish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantité/image:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix/unité:</span>
                    <span className="font-medium">CHF {(pricePerUnit / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="text-2xl font-bold text-purple-600">
                      CHF {(totalPrice / 100).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={uploadedImages.length === 0}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
