
import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project, CreateProjectData, UpdateProjectData, ProjectFilters, ProjectStats } from '../types/Project';
import toast from 'react-hot-toast';

export const useProjects = (filters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects(filters);
      setProjects(response.projects);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (data: CreateProjectData) => {
    try {
      const response = await projectService.createProject(data);
      setProjects(prev => [response.project, ...prev]);
      toast.success('Projeto criado com sucesso!');
      return response.project;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar projeto';
      toast.error(message);
      throw error;
    }
  };

  const updateProject = async (id: number, data: UpdateProjectData) => {
    try {
      const response = await projectService.updateProject(id, data);
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      toast.success('Projeto atualizado com sucesso!');
      return response.project;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar projeto';
      toast.error(message);
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Projeto excluído com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir projeto';
      toast.error(message);
      throw error;
    }
  };

  const submitProject = async (id: number) => {
    try {
      const response = await projectService.submitProject(id);
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      toast.success('Projeto enviado para avaliação!');
      return response.project;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao enviar projeto';
      toast.error(message);
      throw error;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await projectService.updateProjectStatus(id, status);
      setProjects(prev => prev.map(p => p.id === id ? response.project : p));
      toast.success('Status atualizado com sucesso!');
      return response.project;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar status';
      toast.error(message);
      throw error;
    }
  };

  const refetch = () => {
    fetchProjects();
  };

  return {
    projects,
    loading,
    pagination,
    createProject,
    updateProject,
    deleteProject,
    submitProject,
    updateStatus,
    refetch
  };
};

export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjectStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};