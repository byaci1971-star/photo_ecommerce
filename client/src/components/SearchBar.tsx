import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Get search results
  const { data: results } = trpc.products.search.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length > 0 }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher des produits..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          className="w-full px-4 py-2 pl-10 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg max-h-96 overflow-y-auto">
          {results && results.length > 0 ? (
            <div className="divide-y">
              {results.slice(0, 10).map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a
                    onClick={handleResultClick}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate">{product.description}</p>
                      <p className="text-sm font-bold text-purple-600">CHF {(product.price / 100).toFixed(2)}</p>
                    </div>
                  </a>
                </Link>
              ))}
              {results.length > 10 && (
                <Link href={`/search?q=${encodeURIComponent(query)}`}>
                  <a
                    onClick={handleResultClick}
                    className="block p-3 text-center text-sm text-purple-600 hover:bg-gray-50 font-medium"
                  >
                    Voir tous les résultats ({results.length})
                  </a>
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Aucun produit trouvé pour "{query}"
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
