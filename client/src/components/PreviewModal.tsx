import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';
import PageFlipPreview from './PageFlipPreview';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  productType: 'book' | 'calendar' | 'poster';
  projectName?: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  productType,
  projectName = 'My Project',
}) => {
  const [pages, setPages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generatePages();
    }
  }, [isOpen]);

  const generatePages = () => {
    setIsGenerating(true);
    try {
      // Get canvas image
      const canvasImage = canvasRef.current?.toDataURL('image/png');

      if (!canvasImage) {
        console.error('Canvas reference not available');
        setIsGenerating(false);
        return;
      }

      // Generate pages based on product type
      const generatedPages = [];

      if (productType === 'book') {
        // For books, create 4 pages with the same content (can be customized)
        for (let i = 1; i <= 4; i++) {
          generatedPages.push({
            id: `page-${i}`,
            number: i,
            content: canvasImage,
            elements: [],
          });
        }
      } else if (productType === 'calendar') {
        // For calendars, create 12 pages (one per month)
        for (let i = 1; i <= 12; i++) {
          generatedPages.push({
            id: `page-${i}`,
            number: i,
            content: canvasImage,
            elements: [],
          });
        }
      } else {
        // For posters, create 1 page
        generatedPages.push({
          id: 'page-1',
          number: 1,
          content: canvasImage,
          elements: [],
        });
      }

      setPages(generatedPages);
    } catch (error) {
      console.error('Error generating pages:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <DialogTitle>
              {productType === 'book' && 'Aperçu du Livre Photo'}
              {productType === 'calendar' && 'Aperçu du Calendrier'}
              {productType === 'poster' && "Aperçu de l'Affiche"}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Génération de l'aperçu...</p>
              </div>
            </div>
          ) : pages.length > 0 ? (
            <PageFlipPreview
              pages={pages}
              productType={productType}
              onPageChange={(pageNumber) => {
                console.log(`Viewing page ${pageNumber}`);
              }}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">Aucune page à afficher</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={generatePages} disabled={isGenerating}>
            Régénérer l'aperçu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
