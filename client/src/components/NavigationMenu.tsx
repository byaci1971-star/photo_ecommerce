import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

interface MenuItemProps {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
}

function MenuItemWithSubcategories({ categoryId, categoryName, categorySlug }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { data: subcategories } = trpc.products.getSubcategories.useQuery({ categoryId });

  return (
    <div className="relative group">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-purple-600 transition-colors"
      >
        {categoryName}
        {subcategories && subcategories.length > 0 && (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && subcategories && subcategories.length > 0 && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 mt-0 w-48 bg-white border border-border rounded-lg shadow-lg z-50 py-2"
        >
          {subcategories.map((subcat) => (
            <Link key={subcat.id} href={`/category/${categoryId}/subcategory/${subcat.id}`}>
              <a className="block px-4 py-2 text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors">
                {subcat.name}
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function NavigationMenu() {
  const { language } = useLanguage();
  const { data: categories } = trpc.products.getCategories.useQuery();

  return (
    <nav className="hidden md:flex items-center gap-2">
      {categories?.map((cat) => (
        <MenuItemWithSubcategories
          key={cat.id}
          categoryId={cat.id}
          categoryName={cat.name}
          categorySlug={cat.slug}
        />
      ))}
    </nav>
  );
}
