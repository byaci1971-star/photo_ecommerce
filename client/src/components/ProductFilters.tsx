import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  maxPrice?: number;
  availableSizes?: string[];
  availableColors?: string[];
}

export function ProductFilters({
  onFilterChange,
  maxPrice = 10000,
  availableSizes = ['10x15 cm', '13x18 cm', '20x25 cm', '21x30 cm', '30x40 cm'],
  availableColors = ['Red', 'Blue', 'Green', 'Black', 'White'],
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, maxPrice],
    sizes: [],
    colors: [],
  });
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    size: true,
    color: true,
  });

  const handlePriceChange = (min: number, max: number) => {
    const newFilters: FilterState = { ...filters, priceRange: [min, max] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    const newFilters: FilterState = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    const newFilters: FilterState = { ...filters, colors: newColors };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, maxPrice],
      sizes: [],
      colors: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Filter */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between py-2 font-semibold hover:text-purple-600"
            >
              Price Range
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.price ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.price && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm">
                    Min: CHF {(filters.priceRange[0] / 100).toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(
                        parseInt(e.target.value),
                        filters.priceRange[1]
                      )
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Max: CHF {(filters.priceRange[1] / 100).toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(
                        filters.priceRange[0],
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div>
            <button
              onClick={() => toggleSection('size')}
              className="w-full flex items-center justify-between py-2 font-semibold hover:text-purple-600"
            >
              Size/Format
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.size ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.size && (
              <div className="mt-4 space-y-2">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div>
            <button
              onClick={() => toggleSection('color')}
              className="w-full flex items-center justify-between py-2 font-semibold hover:text-purple-600"
            >
              Color
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.color ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.color && (
              <div className="mt-4 space-y-2">
                {availableColors.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
