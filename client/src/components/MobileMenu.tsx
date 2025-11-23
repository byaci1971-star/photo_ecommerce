import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileMenuProps {
  isAuthenticated: boolean;
  userName?: string;
}

export function MobileMenu({ isAuthenticated, userName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const { language } = useLanguage();
  const { data: categories } = trpc.products.getCategories.useQuery();

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg z-40">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Categories */}
            {categories?.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between py-2 font-medium hover:text-purple-600"
                >
                  {cat.name}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedCategory === cat.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedCategory === cat.id && (
                  <SubcategoryList categoryId={cat.id} onClose={() => setIsOpen(false)} />
                )}
              </div>
            ))}

            <hr className="my-4" />

            {/* User Links */}
            {isAuthenticated ? (
              <>
                <Link href="/account">
                  <a className="block py-2 hover:text-purple-600" onClick={() => setIsOpen(false)}>
                    {userName || 'Account'}
                  </a>
                </Link>
              </>
            ) : (
              <Link href="/">
                <a className="block py-2 hover:text-purple-600" onClick={() => setIsOpen(false)}>
                  {t('nav.login', language)}
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SubcategoryList({
  categoryId,
  onClose,
}: {
  categoryId: number;
  onClose: () => void;
}) {
  const { data: subcategories } = trpc.products.getSubcategories.useQuery({ categoryId });

  return (
    <div className="pl-4 space-y-2 py-2 bg-gray-50">
      {subcategories?.map((subcat) => (
        <Link key={subcat.id} href={`/category/${categoryId}/subcategory/${subcat.id}`}>
          <a
            className="block py-1 text-sm text-gray-600 hover:text-purple-600"
            onClick={onClose}
          >
            {subcat.name}
          </a>
        </Link>
      ))}
    </div>
  );
}
