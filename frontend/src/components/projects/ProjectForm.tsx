import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { CreateProjectData, UpdateProjectData, PROJECT_CATEGORIES, Project } from '../../types/Project';

interface ProjectFormProps {
  project?: Project; // Para modo de edição
  onSubmit: (data: CreateProjectData | UpdateProjectData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const isEditing = !!project;
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateProjectData>({
    defaultValues: isEditing ? {
      title: project.title,
      category: project.category,
      abstract: project.abstract
    } : {
      title: '',
      category: '',
      abstract: ''
    }
  });

  const watchedAbstract = watch('abstract', '');

  const onFormSubmit = async (data: CreateProjectData) => {
    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Projeto *
              </label>
              <input
                type="text"
                {...register('title', {
                  required: 'Título é obrigatório',
                  minLength: { value: 10, message: 'Título deve ter pelo menos 10 caracteres' },
                  maxLength: { value: 500, message: 'Título deve ter no máximo 500 caracteres' }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o título do seu projeto"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                {...register('category', { required: 'Categoria é obrigatória' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {PROJECT_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Resumo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumo do Projeto *
              </label>
              <textarea
                {...register('abstract', {
                  required: 'Resumo é obrigatório',
                  minLength: { value: 50, message: 'Resumo deve ter pelo menos 50 caracteres' },
                  maxLength: { value: 3000, message: 'Resumo deve ter no máximo 3000 caracteres' }
                })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Descreva seu projeto de forma detalhada..."
              />
              <div className="flex justify-between items-center mt-2">
                {errors.abstract && (
                  <p className="text-red-600 text-sm">{errors.abstract.message}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {watchedAbstract?.length || 0}/3000
                </p>
              </div>
            </div>

            {/* Aviso para edição */}
            {isEditing && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Atenção:</strong> Apenas projetos em rascunho podem ser editados. 
                      {project?.status !== 'DRAFT' && ' Este projeto não pode mais ser modificado.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (isEditing && project?.status !== 'DRAFT')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading 
                  ? (isEditing ? 'Atualizando...' : 'Salvando...')
                  : (isEditing ? 'Atualizar Projeto' : 'Criar Projeto')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;