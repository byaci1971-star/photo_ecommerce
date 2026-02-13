import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useCanvasEditor } from '@/hooks/useCanvasEditor';
import { usePdfExport } from '@/hooks/usePdfExport';
import { Canvas } from '@/components/Canvas';
import { EditorToolbar } from '@/components/EditorToolbar';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { FilterPanel } from '@/components/FilterPanel';
import { ExportPdfDialog } from '@/components/ExportPdfDialog';
import { HighResolutionPreview } from '@/components/HighResolutionPreview';
import { BeforeAfterComparison } from '@/components/BeforeAfterComparison';
import { PreviewModal } from '@/components/PreviewModal';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from '@/components/NavigationMenu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { APP_LOGO, APP_TITLE } from '@/const';
import { Save, Download, Zap, Eye } from 'lucide-react';

export default function StudioEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [fileName, setFileName] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [originalCanvasImage, setOriginalCanvasImage] = useState<string | null>(null);
  const [showTemplateLoader, setShowTemplateLoader] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [productType, setProductType] = useState<'book' | 'calendar' | 'poster'>('book');

  const projectQuery = trpc.projects.getById.useQuery(
    { projectId: Number(projectId) },
    { enabled: isAuthenticated && !!projectId }
  );

  const updateProjectMutation = trpc.projects.update.useMutation();
  const addImageMutation = trpc.projects.addImage.useMutation();
  const templateQuery = trpc.templates.getAll.useQuery({ featured: true });

  const editor = useCanvasEditor();
  const { exportCanvasToHighResolutionPdf } = usePdfExport();

  useEffect(() => {
    const storedTemplate = sessionStorage.getItem('selectedTemplate');
    if (storedTemplate) {
      try {
        const template = JSON.parse(storedTemplate);
        setSelectedTemplate(template);
        loadTemplateElements(template);
        sessionStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Error loading template:', error);
      }
    }
  }, []);

  const loadTemplateElements = useCallback((template: any) => {
    try {
      const templateData = JSON.parse(template.templateData);
      if (templateData.elements && Array.isArray(templateData.elements)) {
        templateData.elements.forEach((element: any) => {
          editor.addElement(element);
        });
      }
    } catch (error) {
      console.error('Error loading template elements:', error);
    }
  }, [editor]);

  const handleLoadTemplate = useCallback((template: any) => {
    setSelectedTemplate(template);
    loadTemplateElements(template);
    setShowTemplateLoader(false);
  }, [loadTemplateElements]);

  const handleAddImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
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

  const handleExportPdf = useCallback(async (options: any) => {
    const projectName = projectQuery.data?.name || 'creation';
    await exportCanvasToHighResolutionPdf(
      editor.canvasRef as React.RefObject<HTMLCanvasElement>,
      editor.canvasState,
      projectName,
      options.dpi
    );
  }, [editor.canvasRef, editor.canvasState, exportCanvasToHighResolutionPdf, projectQuery.data]);

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
            <Button onClick={() => setShowTemplateLoader(!showTemplateLoader)} variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Button onClick={handleSave} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleExportImage} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
            <Button onClick={() => setShowExportDialog(true)} variant="outline">
              Export PDF
            </Button>
          </div>
        </div>

        {showTemplateLoader && (
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h3 className="font-semibold mb-3">Featured Templates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateQuery.data?.map((template: any) => (
                <div
                  key={template.id}
                  className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs font-semibold truncate">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <EditorToolbar
          onAddImage={handleAddImage}
          onAddText={handleAddText}
          onDelete={handleDeleteSelected}
          onDuplicate={handleDuplicate}
        />

        <div className="flex flex-1 gap-4">
          <Canvas
            state={editor.state}
            selectedElementId={editor.selectedElementId}
            onElementSelect={(id) => editor.selectElement(id)}
            onElementDragStart={(element, x, y) => editor.startDragging(element, x, y)}
            onElementDragMove={(x, y) => editor.drag(x, y)}
            onElementDragEnd={() => editor.stopDragging()}
            canvasRef={editor.canvasRef}
          />
          <div className="w-64 flex flex-col gap-4">
            {selectedElement && <PropertiesPanel element={selectedElement} editor={editor} />}
            <FilterPanel editor={editor} />
          </div>
        </div>

        {showExportDialog && (
          <ExportPdfDialog onExport={handleExportPdf} onClose={() => setShowExportDialog(false)} />
        )}

        {showPreview && (
          <HighResolutionPreview
            canvasRef={editor.canvasRef}
            onClose={() => setShowPreview(false)}
          />
        )}

        {showComparison && originalCanvasImage && (
          <BeforeAfterComparison
            originalImage={originalCanvasImage}
            filteredImage={editor.canvasRef.current?.toDataURL() || ''}
            title="Avant / Après Comparaison"
          />
        )}
      </main>
    </div>
  );
}
