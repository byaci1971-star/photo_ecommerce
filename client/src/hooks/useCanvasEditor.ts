import { useState, useCallback, useRef } from 'react';

export interface CanvasElement {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  // Image specific
  src?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
}

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
}

export function useCanvasEditor(initialState?: CanvasState) {
  const [canvasState, setCanvasState] = useState<CanvasState>(
    initialState || {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      elements: [],
    }
  );

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addElement = useCallback((element: Omit<CanvasElement, 'id' | 'zIndex'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random()}`,
      zIndex: canvasState.elements.length,
    };
    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    return newElement.id;
  }, [canvasState.elements.length]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el => (el.id === id ? { ...el, ...updates } : el)),
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const getElementAtPoint = useCallback((x: number, y: number): CanvasElement | null => {
    const elements = [...canvasState.elements].reverse();
    for (const element of elements) {
      if (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      ) {
        return element;
      }
    }
    return null;
  }, [canvasState.elements]);

  const startDrag = useCallback((element: CanvasElement, offsetX: number, offsetY: number) => {
    setIsDragging(true);
    setDragOffset({
      x: offsetX - element.x,
      y: offsetY - element.y,
    });
  }, []);

  const moveDrag = useCallback((x: number, y: number) => {
    if (!isDragging || !selectedElementId) return;
    updateElement(selectedElementId, {
      x: Math.max(0, Math.min(x - dragOffset.x, canvasState.width - 50)),
      y: Math.max(0, Math.min(y - dragOffset.y, canvasState.height - 50)),
    });
  }, [isDragging, selectedElementId, dragOffset, canvasState.width, canvasState.height, updateElement]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setCanvasState(prev => {
      const maxZ = Math.max(...prev.elements.map(el => el.zIndex), 0);
      return {
        ...prev,
        elements: prev.elements.map(el => (el.id === id ? { ...el, zIndex: maxZ + 1 } : el)),
      };
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setCanvasState(prev => {
      const minZ = Math.min(...prev.elements.map(el => el.zIndex), 0);
      return {
        ...prev,
        elements: prev.elements.map(el => (el.id === id ? { ...el, zIndex: minZ - 1 } : el)),
      };
    });
  }, []);

  const getSelectedElement = useCallback(() => {
    return canvasState.elements.find(el => el.id === selectedElementId) || null;
  }, [canvasState.elements, selectedElementId]);

  return {
    canvasState,
    setCanvasState,
    selectedElementId,
    setSelectedElementId,
    isDragging,
    canvasRef,
    addElement,
    updateElement,
    deleteElement,
    getElementAtPoint,
    startDrag,
    moveDrag,
    endDrag,
    bringToFront,
    sendToBack,
    getSelectedElement,
  };
}
