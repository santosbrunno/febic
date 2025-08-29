
import { Category, ProjectStatus, User } from '@prisma/client';

export interface ProjectResponse {
  id: number;
  title: string;
  abstract: string;
  category: Category;
  status: ProjectStatus;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateProjectRequest {
  title: string;
  abstract: string;
  category: Category;
}

export interface UpdateProjectRequest {
  title?: string;
  abstract?: string;
  category?: Category;
}

export interface UpdateProjectStatusRequest {
  status: ProjectStatus;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  category?: Category;
  authorId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProjectsListResponse {
  projects: ProjectResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}