import { CanvasElement } from '@/hooks/useCanvasEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (updates: Partial<CanvasElement>) => void;
}

export function PropertiesPanel({ element, onUpdate }: PropertiesPanelProps) {
  if (!element) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select an element to edit properties</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-sm">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position */}
        <div>
          <label className="text-xs font-semibold">Position</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <label className="text-xs">X</label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>
            <div>
              <label className="text-xs">Y</label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="text-xs font-semibold">Size</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <label className="text-xs">Width</label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>
            <div>
              <label className="text-xs">Height</label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="text-xs font-semibold">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={element.rotation}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{element.rotation}°</span>
        </div>

        {/* Opacity */}
        <div>
          <label className="text-xs font-semibold">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity}
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{Math.round(element.opacity * 100)}%</span>
        </div>

        {/* Text Properties */}
        {element.type === 'text' && (
          <>
            <div className="border-t pt-4">
              <label className="text-xs font-semibold">Text</label>
              <textarea
                value={element.text || ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="w-full px-2 py-1 border rounded text-xs mt-1"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Font Size</label>
              <input
                type="number"
                value={element.fontSize || 16}
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Font Family</label>
              <select
                value={element.fontFamily || 'Arial'}
                onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                className="w-full px-2 py-1 border rounded text-xs"
              >
                <option>Arial</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
                <option>Courier New</option>
                <option>Verdana</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Font Weight</label>
              <select
                value={element.fontWeight || 'normal'}
                onChange={(e) => onUpdate({ fontWeight: e.target.value as 'normal' | 'bold' })}
                className="w-full px-2 py-1 border rounded text-xs"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Text Align</label>
              <select
                value={element.textAlign || 'left'}
                onChange={(e) => onUpdate({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
                className="w-full px-2 py-1 border rounded text-xs"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Font Color</label>
              <input
                type="color"
                value={element.fontColor || '#000000'}
                onChange={(e) => onUpdate({ fontColor: e.target.value })}
                className="w-full h-8 border rounded"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
