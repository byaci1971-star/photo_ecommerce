import { useEffect, useRef } from 'react';
import { CanvasElement, CanvasState } from '@/hooks/useCanvasEditor';

interface CanvasProps {
  state: CanvasState;
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementDragStart: (element: CanvasElement, x: number, y: number) => void;
  onElementDragMove: (x: number, y: number) => void;
  onElementDragEnd: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function Canvas({
  state,
  selectedElementId,
  onElementSelect,
  onElementDragStart,
  onElementDragMove,
  onElementDragEnd,
  canvasRef,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = state.width;
    canvas.height = state.height;

    // Clear canvas
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, state.width, state.height);

    // Sort elements by zIndex
    const sortedElements = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);

    // Draw elements
    sortedElements.forEach((element) => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(element.x + element.width / 2), -(element.y + element.height / 2));

      if (element.type === 'image' && element.src) {
        const img = new Image();
        img.onload = () => {
          // Apply filters using canvas filter property
          const filterString = getFilterString(element);
          ctx.filter = filterString;
          ctx.drawImage(img, element.x, element.y, element.width, element.height);
          ctx.filter = 'none';
          drawSelectionBox(ctx, element, selectedElementId);
        };
        img.src = element.src;
      } else if (element.type === 'text' && element.text) {
        ctx.fillStyle = element.fontColor || '#000000';
        ctx.font = `${element.fontWeight === 'bold' ? 'bold ' : ''}${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
        ctx.textAlign = (element.textAlign as CanvasTextAlign) || 'left';
        ctx.fillText(element.text, element.x, element.y + (element.fontSize || 16));
        drawSelectionBox(ctx, element, selectedElementId);
      }

      ctx.restore();
    });
  }, [state, selectedElementId, canvasRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find element at click position
    const clickedElement = [...state.elements]
      .reverse()
      .find(el => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height);

    if (clickedElement) {
      onElementSelect(clickedElement.id);
      onElementDragStart(clickedElement, x, y);
    } else {
      onElementSelect(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onElementDragMove(x, y);

    // Change cursor based on hover
    const hoveredElement = [...state.elements]
      .reverse()
      .find(el => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height);

    canvas.style.cursor = hoveredElement ? 'move' : 'default';
  };

  const handleMouseUp = () => {
    onElementDragEnd();
  };

  return (
    <div ref={containerRef} className="flex justify-center items-center bg-gray-100 p-4 rounded-lg overflow-auto">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="bg-white shadow-lg cursor-default"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
}

function getFilterString(element: CanvasElement): string {
  const filters: string[] = [];

  if (element.brightness !== undefined && element.brightness !== 0) {
    filters.push(`brightness(${100 + element.brightness}%)`);
  }
  if (element.contrast !== undefined && element.contrast !== 0) {
    filters.push(`contrast(${100 + element.contrast}%)`);
  }
  if (element.saturation !== undefined && element.saturation !== 0) {
    filters.push(`saturate(${100 + element.saturation}%)`);
  }
  if (element.hue !== undefined && element.hue !== 0) {
    filters.push(`hue-rotate(${element.hue}deg)`);
  }
  if (element.blur !== undefined && element.blur !== 0) {
    filters.push(`blur(${element.blur}px)`);
  }
  if (element.grayscale !== undefined && element.grayscale !== 0) {
    filters.push(`grayscale(${element.grayscale}%)`);
  }
  if (element.sepia !== undefined && element.sepia !== 0) {
    filters.push(`sepia(${element.sepia}%)`);
  }

  return filters.length > 0 ? filters.join(' ') : 'none';
}

function drawSelectionBox(ctx: CanvasRenderingContext2D, element: CanvasElement, selectedId: string | null) {
  if (element.id === selectedId) {
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(element.x, element.y, element.width, element.height);

    // Draw resize handles
    const handleSize = 8;
    ctx.fillStyle = '#2563eb';
    const corners = [
      [element.x, element.y],
      [element.x + element.width, element.y],
      [element.x + element.width, element.y + element.height],
      [element.x, element.y + element.height],
    ];
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    });
  }
}
