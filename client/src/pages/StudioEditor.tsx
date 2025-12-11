import { useState, useCallback } from 'react';
import { useParams } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useCanvasEditor } from '@/hooks/useCanvasEditor';
import { Canvas } from '@/components/Canvas';
import { EditorToolbar } from '@/components/EditorToolbar';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { FilterPanel } from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from '@/components/NavigationMenu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { APP_LOGO, APP_TITLE } from '@/const';
import { Save, Download } from 'lucide-react';

export default function StudioEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [fileName, setFileName] = useState('');

  const projectQuery = trpc.projects.getById.useQuery(
    { projectId: Number(projectId) },
    { enabled: isAuthenticated && !!projectId }
  );

  const updateProjectMutation = trpc.projects.update.useMutation();
  const addImageMutation = trpc.projects.addImage.useMutation();

  const editor = useCanvasEditor();

  const handleAddImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // For now, create a local data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          editor.addElement({
            type: 'image',
            x: 50,
            y: 50,
            width: 200,
            height: 200,
            rotation: 0,
            opacity: 1,
            src,
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error adding image:', error);
      }
    };
    input.click();
  }, [editor]);

  const handleAddText = useCallback(() => {
    editor.addElement({
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      text: 'Edit me',
      fontSize: 24,
      fontFamily: 'Arial',
      fontColor: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
    });
  }, [editor]);

  const handleDeleteSelected = useCallback(() => {
    if (editor.selectedElementId) {
      editor.deleteElement(editor.selectedElementId);
    }
  }, [editor]);

  const handleDuplicate = useCallback(() => {
    const selected = editor.getSelectedElement();
    if (!selected) return;

    const { id, zIndex, ...rest } = selected;
    editor.addElement({
      ...rest,
      x: selected.x + 20,
      y: selected.y + 20,
    });
  }, [editor]);

  const handleSave = useCallback(async () => {
    if (!projectId) return;

    try {
      await updateProjectMutation.mutateAsync({
        projectId: Number(projectId),
        data: JSON.stringify(editor.canvasState),
      });
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  }, [projectId, editor.canvasState, updateProjectMutation]);

  const handleExportImage = useCallback(() => {
    const canvas = editor.canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `project-${Date.now()}.png`;
    link.click();
  }, [editor.canvasRef]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access the editor</p>
      </div>
    );
  }

  if (projectQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  if (!projectQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  const selectedElement = editor.getSelectedElement();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <span className="font-bold text-lg">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">{user?.name}</span>
          </div>
        </div>
      </header>

      <NavigationMenu />

      <main className="flex-1 flex flex-col container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{projectQuery.data.name}</h1>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleExportImage} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <EditorToolbar
          onAddImage={handleAddImage}
          onAddText={handleAddText}
          onDeleteSelected={handleDeleteSelected}
          onDuplicate={handleDuplicate}
          onBringToFront={() => {
            if (editor.selectedElementId) {
              editor.bringToFront(editor.selectedElementId);
            }
          }}
          onSendToBack={() => {
            if (editor.selectedElementId) {
              editor.sendToBack(editor.selectedElementId);
            }
          }}
          hasSelectedElement={!!editor.selectedElementId}
        />

        <div className="flex gap-4 flex-1 mt-4">
          <div className="flex-1 flex flex-col">
            <Canvas
              state={editor.canvasState}
              selectedElementId={editor.selectedElementId}
              onElementSelect={editor.setSelectedElementId}
              onElementDragStart={editor.startDrag}
              onElementDragMove={editor.moveDrag}
              onElementDragEnd={editor.endDrag}
              canvasRef={editor.canvasRef as React.RefObject<HTMLCanvasElement>}
            />
          </div>

          <div className="w-80 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            <PropertiesPanel
              element={selectedElement}
              onUpdate={(updates) => {
                if (editor.selectedElementId) {
                  editor.updateElement(editor.selectedElementId, updates);
                }
              }}
            />
            <FilterPanel
              element={selectedElement}
              onUpdate={(updates) => {
                if (editor.selectedElementId) {
                  editor.updateElement(editor.selectedElementId, updates);
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
