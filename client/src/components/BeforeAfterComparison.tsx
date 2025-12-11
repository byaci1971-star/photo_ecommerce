import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface BeforeAfterComparisonProps {
  originalImage: string;
  filteredImage: string;
  title?: string;
}

export function BeforeAfterComparison({
  originalImage,
  filteredImage,
  title = 'Before / After Comparison',
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Comparison Container */}
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100 cursor-col-resize"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            style={{ paddingBottom: '66.67%' }} // 3:2 aspect ratio
          >
            {/* Before Image (Original) */}
            <div className="absolute inset-0">
              <img
                src={originalImage}
                alt="Before"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-semibold">
                Before
              </div>
            </div>

            {/* After Image (Filtered) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={filteredImage}
                alt="After"
                className="w-full h-full object-cover"
                style={{ width: `${(100 / sliderPosition) * 100}%` }}
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-semibold">
                After
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2">
                <div className="flex gap-1">
                  <div className="w-0.5 h-6 bg-gray-400"></div>
                  <div className="w-0.5 h-6 bg-gray-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Before</span>
              <span>{Math.round(sliderPosition)}%</span>
              <span>After</span>
            </div>
            <Slider
              value={[sliderPosition]}
              onValueChange={(value) => setSliderPosition(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-900">
            <p className="font-semibold mb-1">💡 Tip:</p>
            <p>Drag the slider or use the slider below to compare the before and after versions of your image with applied filters.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
