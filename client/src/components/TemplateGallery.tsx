import React, { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

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

interface TemplateGalleryProps {
  category?: 'photo' | 'book' | 'calendar' | 'gift';
  featured?: boolean;
  onSelectTemplate?: (template: Template) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  category,
  featured = false,
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, error: queryError } = trpc.templates.getAll.useQuery({
    category: category as any,
    featured,
  });

  useEffect(() => {
    if (data) {
      setTemplates(data as Template[]);
      setLoading(false);
    }
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    }
  }, [data, queryError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des modèles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">Erreur lors du chargement: {error}</div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Aucun modèle disponible</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectTemplate?.(template)}
        >
          <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
            <img
              src={template.thumbnailUrl}
              alt={template.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
            {template.featured === 1 && (
              <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ En vedette
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">{template.name}</h3>
            {template.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {template.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate?.(template);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Utiliser
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
