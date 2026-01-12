import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { TemplateGallery } from '../components/TemplateGallery';

interface Template {
  id: number;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  thumbnailUrl: string;
  previewUrl: string | null;
  templateData: string;
  tags: string | null;
  featured: number;
  sortOrder: number;
  isPublic: number;
  createdAt: Date;
  updatedAt: Date;
}

export const Templates: React.FC = () => {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<'photo' | 'book' | 'calendar' | 'gift' | undefined>(undefined);

  const handleSelectTemplate = (template: Template) => {
    // Store template data in session storage
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    
    // Navigate to studio editor
    navigate('/studio/editor/new', { state: { template } });
  };

  const categories = [
    { id: 'photo', label: 'Photos' },
    { id: 'book', label: 'Livres Photo' },
    { id: 'calendar', label: 'Calendriers' },
    { id: 'gift', label: 'Cadeaux' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Galerie de Modèles</h1>
          <p className="text-lg opacity-90">Choisissez un modèle pré-conçu pour commencer votre création</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === undefined
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous les modèles
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <TemplateGallery
          category={selectedCategory}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </div>
  );
};

export default Templates;
