
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { 
  CreateProjectRequest, 
  UpdateProjectRequest,
  ProjectFilters,
  ProjectsListResponse,
  UpdateProjectStatusRequest 
} from '../types/Project';

const prisma = new PrismaClient();

export class ProjectService {
  
  static async createProject(data: CreateProjectRequest, authorId: number) {
    const project = await prisma.project.create({
      data: {
        ...data,
        authorId,
        status: ProjectStatus.DRAFT
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return project;
  }

  static async getProjects(filters: ProjectFilters, userRole: string, userId?: number) {
    const {
      status,
      category,
      authorId,
      search,
      page = 1,
      limit = 10
    } = filters;

    const where: any = {};

    // Se não é admin, só vê seus próprios projetos
    if (userRole !== 'ADMIN' && userId) {
      where.authorId = userId;
    }

    // Filtros opcionais
    if (status && status.trim()) where.status = status;
    if (category && category.trim()) where.category = category;
    if (authorId && userRole === 'ADMIN') where.authorId = authorId;
    
    // Busca por texto
    if (search && search.trim()) {
        where.OR = [
          { title: { contains: search.trim(), mode: 'insensitive' } },
          { abstract: { contains: search.trim(), mode: 'insensitive' } }
        ];
      }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ]);

    const response: ProjectsListResponse = {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return response;
  }

  static async getProjectById(id: number, userRole: string, userId?: number) {
    const where: any = { id };

    if (userRole !== 'ADMIN' && userId) {
      where.authorId = userId;
    }

    const project = await prisma.project.findUnique({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return project;
  }

  static async updateProject(
    id: number, 
    data: UpdateProjectRequest, 
    userRole: string, 
    userId: number
  ) {
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });

    if (!existingProject) {
      throw new Error('Projeto não encontrado');
    }

    // Autor só pode editar seus próprios projetos em status DRAFT
    if (userRole !== 'ADMIN') {
      if (existingProject.authorId !== userId) {
        throw new Error('Você só pode editar seus próprios projetos');
      }
      
      if (existingProject.status !== ProjectStatus.DRAFT) {
        throw new Error('Só é possível editar projetos em rascunho');
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedProject;
  }

  static async deleteProject(id: number, userRole: string, userId: number) {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    // Autor só pode excluir seus próprios projetos em status DRAFT
    if (userRole !== 'ADMIN') {
      if (project.authorId !== userId) {
        throw new Error('Você só pode excluir seus próprios projetos');
      }
      
      if (project.status !== ProjectStatus.DRAFT) {
        throw new Error('Só é possível excluir projetos em rascunho');
      }
    }

    await prisma.project.delete({
      where: { id }
    });

    return { message: 'Projeto excluído com sucesso' };
  }

  static async submitProject(id: number, userId: number) {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    if (project.authorId !== userId) {
      throw new Error('Você só pode enviar seus próprios projetos');
    }

    if (project.status !== ProjectStatus.DRAFT) {
      throw new Error('Apenas projetos em rascunho podem ser enviados');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.SUBMITTED,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedProject;
  }

  static async updateProjectStatus(
    id: number,
    data: UpdateProjectStatusRequest,
    userRole: string
  ) {
    if (userRole !== 'ADMIN') {
      throw new Error('Apenas administradores podem alterar status');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        status: data.status,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedProject;
  }

  static async getProjectStats(userRole: string, userId?: number) {
    const where: any = {};
    
    if (userRole !== 'ADMIN' && userId) {
      where.authorId = userId;
    }

    const [totalProjects, draftProjects, submittedProjects, approvedProjects, rejectedProjects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.count({ where: { ...where, status: ProjectStatus.DRAFT } }),
      prisma.project.count({ where: { ...where, status: ProjectStatus.SUBMITTED } }),
      prisma.project.count({ where: { ...where, status: ProjectStatus.APPROVED } }),
      prisma.project.count({ where: { ...where, status: ProjectStatus.REJECTED } })
    ]);

    return {
      total: totalProjects,
      byStatus: {
        DRAFT: draftProjects,
        SUBMITTED: submittedProjects,
        APPROVED: approvedProjects,
        REJECTED: rejectedProjects
      }
    };
  }
}