import { CanvasElement } from '@/hooks/useCanvasEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  element?: CanvasElement | null;
  onUpdate?: (updates: Partial<CanvasElement>) => void;
  editor?: any;
}

export function FilterPanel({ element, onUpdate }: FilterPanelProps) {
  if (!element || element.type !== 'image') {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select an image to apply filters</p>
        </CardContent>
      </Card>
    );
  }

  const resetFilters = () => {
    onUpdate({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      blur: 0,
      grayscale: 0,
      sepia: 0,
    });
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'grayscale':
        onUpdate({ grayscale: 100, saturation: -100 });
        break;
      case 'sepia':
        onUpdate({ sepia: 100 });
        break;
      case 'vintage':
        onUpdate({ brightness: -10, contrast: 20, saturation: -30, sepia: 30 });
        break;
      case 'vibrant':
        onUpdate({ saturation: 50, contrast: 20 });
        break;
      case 'cool':
        onUpdate({ hue: 200, saturation: 20 });
        break;
      case 'warm':
        onUpdate({ hue: 30, saturation: 20 });
        break;
    }
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-sm">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Presets */}
        <div>
          <label className="text-xs font-semibold block mb-2">Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset('grayscale')}
              className="text-xs"
            >
              B&W
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset('sepia')}
              className="text-xs"
            >
              Sepia
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset('vintage')}
              className="text-xs"
            >
              Vintage
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset('vibrant')}
              className="text-xs"
            >
              Vibrant
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset('cool')}
              className="text-xs"
            >
              Cool
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset('warm')}
              className="text-xs"
            >
              Warm
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="text-xs font-semibold">Brightness</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.brightness || 0}
            onChange={(e) => onUpdate({ brightness: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.brightness || 0}%</span>
        </div>

        <div>
          <label className="text-xs font-semibold">Contrast</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.contrast || 0}
            onChange={(e) => onUpdate({ contrast: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.contrast || 0}%</span>
        </div>

        <div>
          <label className="text-xs font-semibold">Saturation</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.saturation || 0}
            onChange={(e) => onUpdate({ saturation: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.saturation || 0}%</span>
        </div>

        <div>
          <label className="text-xs font-semibold">Hue</label>
          <input
            type="range"
            min="0"
            max="360"
            value={element.hue || 0}
            onChange={(e) => onUpdate({ hue: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.hue || 0}°</span>
        </div>

        <div>
          <label className="text-xs font-semibold">Blur</label>
          <input
            type="range"
            min="0"
            max="20"
            value={element.blur || 0}
            onChange={(e) => onUpdate({ blur: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.blur || 0}px</span>
        </div>

        <div>
          <label className="text-xs font-semibold">Grayscale</label>
          <input
            type="range"
            min="0"
            max="100"
            value={element.grayscale || 0}
            onChange={(e) => onUpdate({ grayscale: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.grayscale || 0}%</span>
        </div>

        <div>
          <label className="text-xs font-semibold">Sepia</label>
          <input
            type="range"
            min="0"
            max="100"
            value={element.sepia || 0}
            onChange={(e) => onUpdate({ sepia: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.sepia || 0}%</span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={resetFilters}
          className="w-full"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
