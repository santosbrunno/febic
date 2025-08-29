
import api from './api';
import { Project, CreateProjectData, UpdateProjectData, ProjectFilters, ProjectStats } from '../types/Project';

export const projectService = {
  async createProject(data: CreateProjectData): Promise<{ project: Project }> {
    const response = await api.post('/projects', data);
    return response.data.data;
  },

  async getProjects(filters?: ProjectFilters): Promise<{ projects: Project[]; pagination: any }> {
    const response = await api.get('/projects', { params: filters });
    return response.data.data;
  },

  async getProjectById(id: number): Promise<{ project: Project }> {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },

  async updateProject(id: number, data: UpdateProjectData): Promise<{ project: Project }> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async submitProject(id: number): Promise<{ project: Project }> {
    const response = await api.post(`/projects/${id}/submit`);
    return response.data.data;
  },

  async updateProjectStatus(id: number, status: string): Promise<{ project: Project }> {
    const response = await api.put(`/projects/${id}/status`, { status });
    return response.data.data;
  },

  async getProjectStats(): Promise<{ stats: ProjectStats }> {
    const response = await api.get('/projects/stats');
    return response.data.data;
  }
};