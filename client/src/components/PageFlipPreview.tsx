import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './PageFlipPreview.css';

interface Page {
  id: string;
  number: number;
  content: string;
  elements?: any[];
}

interface PageFlipPreviewProps {
  pages: Page[];
  productType: 'book' | 'calendar' | 'poster';
  onPageChange?: (pageNumber: number) => void;
  isLoading?: boolean;
}

export const PageFlipPreview: React.FC<PageFlipPreviewProps> = ({
  pages,
  productType,
  onPageChange,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');

  const totalPages = pages.length;
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const handleNextPage = useCallback(() => {
    if (!canGoNext || isFlipping) return;

    setFlipDirection('right');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      setIsFlipping(false);
      onPageChange?.(currentPage + 2);
    }, 300);
  }, [canGoNext, isFlipping, totalPages, currentPage, onPageChange]);

  const handlePrevPage = useCallback(() => {
    if (!canGoPrev || isFlipping) return;

    setFlipDirection('left');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
      setIsFlipping(false);
      onPageChange?.(currentPage);
    }, 300);
  }, [canGoPrev, isFlipping, currentPage, onPageChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    },
    [handleNextPage, handlePrevPage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentPageData = pages[currentPage];
  const nextPageData = pages[currentPage + 1];

  return (
    <div className="page-flip-preview">
      <div className="preview-header">
        <div className="preview-title">
          <BookOpen className="w-5 h-5" />
          <span>
            {productType === 'book' && 'Aperçu du Livre Photo'}
            {productType === 'calendar' && 'Aperçu du Calendrier'}
            {productType === 'poster' && "Aperçu de l'Affiche"}
          </span>
        </div>
        <div className="page-counter">
          Page {currentPage + 1} / {totalPages}
        </div>
      </div>

      <div className="preview-container">
        <div className="book-spine">
          <div className={`page-wrapper ${isFlipping ? `flip-${flipDirection}` : ''}`}>
            <div className="page left-page">
              {currentPageData && (
                <div className="page-content">
                  {currentPageData.content ? (
                    <img
                      src={currentPageData.content}
                      alt={`Page ${currentPageData.number}`}
                      className="page-image"
                    />
                  ) : (
                    <div className="page-placeholder">
                      <span>Page {currentPageData.number}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="page right-page">
              {nextPageData && (
                <div className="page-content">
                  {nextPageData.content ? (
                    <img
                      src={nextPageData.content}
                      alt={`Page ${nextPageData.number}`}
                      className="page-image"
                    />
                  ) : (
                    <div className="page-placeholder">
                      <span>Page {nextPageData.number}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="preview-controls">
        <Button
          onClick={handlePrevPage}
          disabled={!canGoPrev || isFlipping || isLoading}
          variant="outline"
          size="lg"
          className="nav-button"
        >
          <ChevronLeft className="w-5 h-5" />
          Précédent
        </Button>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentPage + 1) / totalPages) * 100}%`,
            }}
          />
        </div>

        <Button
          onClick={handleNextPage}
          disabled={!canGoNext || isFlipping || isLoading}
          variant="outline"
          size="lg"
          className="nav-button"
        >
          Suivant
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="preview-info">
        <p className="text-sm text-gray-600">
          💡 Utilisez les flèches du clavier (← →) pour naviguer entre les pages
        </p>
      </div>
    </div>
  );
};

export default PageFlipPreview;
