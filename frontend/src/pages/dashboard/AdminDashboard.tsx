import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProjectStats } from '../../hooks/useProjects';
import { Users, FileText, CheckCircle, Clock, LogOut, Plus, Eye, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats, loading } = useProjectStats();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard Administrativo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
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
              Bem-vindo, {user?.name}! 👨‍💼
            </h2>
            <p className="text-gray-600">
              Este é o dashboard administrativo do FEBIC. Aqui você pode gerenciar todos os projetos e usuários.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Usuários
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">2</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Projetos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? '...' : stats?.total || 0}
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
                      Aguardando Avaliação
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? '...' : stats?.byStatus.SUBMETIDO|| 0}
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
                      Projetos Aprovados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? '...' : stats?.byStatus.APROVADO_CIAS || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/projects')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <Eye className="w-6 h-6 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium text-gray-900">Ver Projetos</h4>
                <p className="text-sm text-gray-600">Visualizar todos os projetos submetidos</p>
              </button>
              
              <button 
                onClick={() => navigate('/projects')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <CheckCircle className="w-6 h-6 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium text-gray-900">Revisar Projetos</h4>
                <p className="text-sm text-gray-600">Avaliar projetos submetidos</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                <BarChart3 className="w-6 h-6 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium text-gray-900">Relatórios</h4>
                <p className="text-sm text-gray-600">Gerar relatórios do sistema</p>
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-green-800 font-medium">🎉 Sistema funcionando!</p>
              <p className="text-green-700 text-sm">
                Backend conectado com {stats?.total || 0} projetos cadastrados.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;