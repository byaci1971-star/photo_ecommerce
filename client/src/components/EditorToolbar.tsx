import { Button } from '@/components/ui/button';
import { Image, Type, Trash2, Copy, Undo2, Redo2, ArrowUp, ArrowDown } from 'lucide-react';

interface EditorToolbarProps {
  onAddImage?: () => void;
  onAddText?: () => void;
  onDeleteSelected?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  hasSelectedElement?: boolean;
}

export function EditorToolbar({
  onAddImage,
  onAddText,
  onDeleteSelected,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  hasSelectedElement,
}: EditorToolbarProps) {
  return (
    <div className="flex gap-2 p-4 bg-white border-b rounded-lg flex-wrap">
      <div className="flex gap-2 border-r pr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddImage}
          title="Add image"
        >
          <Image className="w-4 h-4 mr-2" />
          Add Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddText}
          title="Add text"
        >
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>
      </div>

      <div className="flex gap-2 border-r pr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicate}
          disabled={!hasSelectedElement}
          title="Duplicate selected element"
        >
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteSelected}
          disabled={!hasSelectedElement}
          title="Delete selected element"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBringToFront}
          disabled={!hasSelectedElement}
          title="Bring to front"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Front
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSendToBack}
          disabled={!hasSelectedElement}
          title="Send to back"
        >
          <ArrowDown className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
