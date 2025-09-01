import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects, useProjectStats } from '../../hooks/useProjects';
import { Plus, FileText, Clock, CheckCircle, LogOut, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../../components/projects/ProjectForm';
import { CreateProjectData } from '../../types/Project';

const AuthorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats, loading: statsLoading } = useProjectStats();
  const { createProject } = useProjects();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateProject = async (data: CreateProjectData) => {
    await createProject(data);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Meus Projetos
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Autor</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Olá, {user?.name}! 👩‍💻
            </h2>
            <p className="text-gray-600">
              Bem-vindo ao FEBIC! Aqui você pode criar e gerenciar seus projetos de iniciação científica.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Meus Projetos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? '...' : stats?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Em Avaliação
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? '...' : stats?.byStatus.SUBMETIDO || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aprovados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? '...' : stats?.byStatus.APROVADO_CIAS || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Project Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Novo Projeto
          </button>
        </div>

        {/* Projects Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Meus Projetos Recentes
              </h3>
              <button
                onClick={() => navigate('/projects')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                Ver todos
              </button>
            </div>

            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {(stats?.total || 0) === 0 ? 'Nenhum projeto ainda' : 'Gerencie seus projetos'}
              </h3>
              <p className="text-gray-600 mb-6">
                {(stats?.total || 0) === 0 
                  ? 'Comece criando seu primeiro projeto de iniciação científica!'
                  : 'Clique em "Ver todos" para gerenciar seus projetos.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {(stats?.total || 0) === 0 ? 'Criar Primeiro Projeto' : 'Criar Novo Projeto'}
                </button>
                {(stats?.total || 0) > 0 && (
                  <button
                    onClick={() => navigate('/projects')}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Ver Projetos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-blue-800 font-medium">✅ Sistema conectado!</p>
              <p className="text-blue-700 text-sm">
                Você tem {stats?.total || 0} projeto{(stats?.total || 0) !== 1 ? 's' : ''} cadastrado{(stats?.total || 0) !== 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Create Form Modal */}
      {showCreateForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default AuthorDashboard;