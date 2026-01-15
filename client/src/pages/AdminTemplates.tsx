import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  thumbnailUrl: string;
  previewUrl: string | null;
  templateData: string;
  tags: string | null;
  featured: number;
  sortOrder: number;
  isPublic: number;
  createdAt: Date;
  updatedAt: Date;
}

export const AdminTemplates: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'photo',
    subcategory: '',
    thumbnailUrl: '',
    previewUrl: '',
    templateData: '{}',
    tags: '',
    featured: false,
    sortOrder: 0,
  });

  const templatesQuery = trpc.admin.templates.getAll.useQuery();
  const createMutation = trpc.admin.templates.create.useMutation();
  const updateMutation = trpc.admin.templates.update.useMutation();
  const deleteMutation = trpc.admin.templates.delete.useMutation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Unauthorized. Admin access required.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await updateMutation.mutateAsync({
          templateId: editingTemplate.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setFormData({
        name: '',
        description: '',
        category: 'photo',
        subcategory: '',
        thumbnailUrl: '',
        previewUrl: '',
        templateData: '{}',
        tags: '',
        featured: false,
        sortOrder: 0,
      });
      setEditingTemplate(null);
      setShowForm(false);
      templatesQuery.refetch();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      category: template.category,
      subcategory: template.subcategory || '',
      thumbnailUrl: template.thumbnailUrl,
      previewUrl: template.previewUrl || '',
      templateData: template.templateData,
      tags: template.tags || '',
      featured: template.featured === 1,
      sortOrder: template.sortOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await deleteMutation.mutateAsync({ templateId });
      templatesQuery.refetch();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Template Management</h1>
          <Button onClick={() => { setShowForm(!showForm); setEditingTemplate(null); }} variant="default">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingTemplate ? 'Edit Template' : 'Create Template'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="photo">Photo</option>
                    <option value="book">Book</option>
                    <option value="calendar">Calendar</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preview URL</label>
                  <input
                    type="url"
                    value={formData.previewUrl}
                    onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Template Data (JSON)</label>
                <textarea
                  value={formData.templateData}
                  onChange={(e) => setFormData({ ...formData, templateData: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="tag1,tag2,tag3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="default">Save Template</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingTemplate(null); }}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Featured</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Sort Order</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templatesQuery.data?.map((template: Template) => (
                <tr key={template.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{template.name}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      {template.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {template.featured === 1 ? (
                      <span className="text-green-600">✓ Featured</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3">{template.sortOrder}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <Button
                      onClick={() => handleEdit(template)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(template.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTemplates;
