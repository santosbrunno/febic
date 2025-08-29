
import React from 'react';
import { Calendar, User, Eye, Edit, Trash2, Send, CheckCircle, XCircle } from 'lucide-react';
import { Project, PROJECT_CATEGORIES, PROJECT_STATUS } from '../../types/Project';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onSubmit: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete,
  onSubmit,
  onUpdateStatus
}) => {
  const { user } = useAuth();
  const isAuthor = user?.id === project.authorId;
  const isAdmin = user?.role === 'ADMIN';

  const categoryLabel = PROJECT_CATEGORIES.find(cat => cat.value === project.category)?.label || project.category;
  const statusConfig = PROJECT_STATUS.find(s => s.value === project.status);

  const canEdit = isAuthor && project.status === 'DRAFT';
  const canDelete = isAuthor && project.status === 'DRAFT';
  const canSubmit = isAuthor && project.status === 'DRAFT';
  const canUpdateStatus = isAdmin && project.status === 'SUBMITTED';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {project.author.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(project.createdAt), 'dd/MM/yyyy')}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusConfig?.color === 'gray' ? 'bg-gray-100 text-gray-800' :
              statusConfig?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              statusConfig?.color === 'green' ? 'bg-green-100 text-green-800' :
              statusConfig?.color === 'red' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            {statusConfig?.label || project.status}
          </span>
          <span className="text-xs text-gray-500">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Abstract */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.abstract}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(project)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Ver detalhes
        </button>

        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar projeto"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {canSubmit && (
            <button
              onClick={() => onSubmit(project.id)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Enviar para avaliação"
            >
              <Send className="w-4 h-4" />
            </button>
          )}

          {canUpdateStatus && (
            <>
              <button
                onClick={() => onUpdateStatus(project.id, 'APPROVED')}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Aprovar projeto"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(project.id, 'REJECTED')}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Rejeitar projeto"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir projeto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;