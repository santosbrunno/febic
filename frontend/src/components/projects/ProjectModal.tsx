
import React from 'react';
import { X, User, Calendar, Tag, FileText, CheckCircle, Clock, XCircle, Edit } from 'lucide-react';
import { Project, PROJECT_CATEGORIES, PROJECT_STATUS } from '../../types/Project';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onSubmit?: (id: number) => void;
  onUpdateStatus?: (id: number, status: string) => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onEdit,
  onSubmit,
  onUpdateStatus
}) => {
  const { user } = useAuth();
  const isAuthor = user?.id === project.authorId;
  const isAdmin = user?.role === 'ADMIN';

  const categoryLabel = PROJECT_CATEGORIES.find(cat => cat.value === project.category)?.label || project.category;
  const statusConfig = PROJECT_STATUS.find(s => s.value === project.status);

  const canEdit = isAuthor && project.status === 'DRAFT';
  const canSubmit = isAuthor && project.status === 'DRAFT';
  const canUpdateStatus = isAdmin && project.status === 'SUBMITTED';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {project.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{project.author.name}</span>
                  <span className="text-gray-400">({project.author.email})</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusConfig?.color === 'gray' ? 'bg-gray-100 text-gray-800' :
                  statusConfig?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  statusConfig?.color === 'green' ? 'bg-green-100 text-green-800' :
                  statusConfig?.color === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {statusConfig?.label || project.status}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Categoria
                </div>
                <p className="text-gray-900">{categoryLabel}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Data de Criação
                </div>
                <p className="text-gray-900">
                  {format(new Date(project.createdAt), 'dd/MM/yyyy \'às\' HH:mm')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Última Atualização
                </div>
                <p className="text-gray-900">
                  {format(new Date(project.updatedAt), 'dd/MM/yyyy \'às\' HH:mm')}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  ID do Projeto
                </div>
                <p className="text-gray-900">#{project.id}</p>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumo do Projeto</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.abstract}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Projeto
              </button>
            )}

            {canSubmit && onSubmit && (
              <button
                onClick={() => onSubmit(project.id)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Enviar para Avaliação
              </button>
            )}

            {canUpdateStatus && onUpdateStatus && (
              <>
                <button
                  onClick={() => onUpdateStatus(project.id, 'APPROVED')}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprovar
                </button>
                <button
                  onClick={() => onUpdateStatus(project.id, 'REJECTED')}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeitar
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors ml-auto"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;