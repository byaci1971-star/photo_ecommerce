import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';

interface ExportPdfDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  fileName: string;
}

export interface ExportOptions {
  quality: 'standard' | 'high' | 'professional';
  format: 'A4' | 'A5' | 'custom';
  dpi: number;
}

export function ExportPdfDialog({
  isOpen,
  onClose,
  onExport,
  fileName,
}: ExportPdfDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [quality, setQuality] = useState<'standard' | 'high' | 'professional'>('high');
  const [error, setError] = useState<string | null>(null);

  const qualityOptions = {
    standard: { label: 'Standard (96 DPI)', dpi: 96, description: 'For screen viewing' },
    high: { label: 'High (150 DPI)', dpi: 150, description: 'For digital sharing' },
    professional: { label: 'Professional (300 DPI)', dpi: 300, description: 'For printing' },
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);

      const options: ExportOptions = {
        quality,
        format: 'custom',
        dpi: qualityOptions[quality].dpi,
      };

      await onExport(options);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Export to PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-3">Quality</label>
            <div className="space-y-2">
              {(Object.entries(qualityOptions) as Array<[string, any]>).map(([key, option]) => (
                <label key={key} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50" style={{
                  borderColor: quality === key ? '#2563eb' : '#e5e7eb',
                  backgroundColor: quality === key ? '#eff6ff' : 'transparent',
                }}>
                  <input
                    type="radio"
                    name="quality"
                    value={key}
                    checked={quality === key}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-900">
              <strong>File name:</strong> {fileName}.pdf
            </p>
            <p className="text-xs text-blue-800 mt-1">
              Quality: {qualityOptions[quality].dpi} DPI
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
