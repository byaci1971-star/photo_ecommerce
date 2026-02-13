import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn, ZoomOut, Download, Maximize2, X } from 'lucide-react';

interface HighResolutionPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  projectName?: string;
  onDownload?: () => void;
  onClose?: () => void;
}

export function HighResolutionPreview({
  canvasRef,
  projectName,
  onDownload,
}: HighResolutionPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png', 1.0);
      setPreviewImage(imageData);
    }
  }, [canvasRef]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleDownloadPreview = () => {
    if (!previewImage) return;

    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `${projectName}-preview.png`;
    link.click();
  };

  const PreviewContent = () => (
    <div className="flex flex-col gap-4">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetZoom}
          >
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPreview}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {!isFullscreen && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Preview Canvas */}
      <div
        ref={previewContainerRef}
        className="border border-gray-300 rounded-lg overflow-auto bg-gray-50 flex items-center justify-center"
        style={{
          height: isFullscreen ? '100vh' : '600px',
          maxHeight: isFullscreen ? '100vh' : '600px',
        }}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt={projectName}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center',
              maxWidth: '100%',
              height: 'auto',
            }}
            className="shadow-lg"
          />
        ) : (
          <p className="text-gray-400">Loading preview...</p>
        )}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded">
          <p className="font-semibold text-blue-900">Current Zoom</p>
          <p className="text-blue-700">{zoom}% - {zoom < 100 ? 'Zoomed out' : zoom > 100 ? 'Zoomed in' : 'Actual size'}</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="font-semibold text-green-900">Export Quality</p>
          <p className="text-green-700">300 DPI - Professional</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-sm font-semibold text-yellow-900 mb-2">💡 Tips:</p>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use zoom to inspect details before exporting</li>
          <li>• Check text clarity and image sharpness at 100% zoom</li>
          <li>• Download preview to verify colors and layout</li>
          <li>• Export as PDF for professional printing</li>
        </ul>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">{projectName} - Full Preview</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(false)}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <PreviewContent />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>High Resolution Preview</span>
          <span className="text-sm font-normal text-gray-600">
            {projectName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PreviewContent />
      </CardContent>
    </Card>
  );
}
