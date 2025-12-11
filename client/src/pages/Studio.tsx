import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationMenu } from '@/components/NavigationMenu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { APP_LOGO, APP_TITLE, getLoginUrl } from '@/const';
import { Link } from 'wouter';
import { Plus, Trash2, Edit, Download } from 'lucide-react';

export default function Studio() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedType, setSelectedType] = useState<'photo' | 'book' | 'calendar' | 'gift'>('photo');

  const projectsQuery = trpc.projects.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const createProjectMutation = trpc.projects.create.useMutation();
  const deleteProjectMutation = trpc.projects.delete.useMutation();

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      await createProjectMutation.mutateAsync({
        name: newProjectName,
        projectType: selectedType,
      });
      setNewProjectName('');
      projectsQuery.refetch();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProjectMutation.mutateAsync({ projectId });
      projectsQuery.refetch();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <span className="font-bold text-lg">{APP_TITLE}</span>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar />
              <LanguageSwitcher />
            <Button onClick={() => (window.location.href = getLoginUrl())}>
              Login
            </Button>
            </div>
          </div>
        </header>
      <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Studio</h1>
            <p className="mb-4">You must be logged in to access the studio</p>
            <Button onClick={() => (window.location.href = getLoginUrl())}>
              Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
            <span className="text-sm text-gray-600">{user?.name || 'User'}</span>
          </div>
        </div>
      </header>

      <NavigationMenu />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Studio</h1>

        {/* Create New Project Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="flex-1 min-w-[200px] px-3 py-2 border rounded-md"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="photo">Photos</option>
                <option value="book">Photo Books</option>
                <option value="calendar">Calendars</option>
                <option value="gift">Gifts</option>
              </select>
              <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Projects</h2>
          {projectsQuery.isLoading ? (
            <p>Loading...</p>
          ) : projectsQuery.data && projectsQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectsQuery.data.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      Type: {project.projectType}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/studio/editor/${project.id}`}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">No projects yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
