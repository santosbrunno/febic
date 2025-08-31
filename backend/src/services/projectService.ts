import { PrismaClient } from '@prisma/client';
import { CreateProjectRequest, UpdateProjectRequest } from '../types/Project';

const prisma = new PrismaClient();

export class ProjectService {

  // ===== CRIAR PROJETO =====
  static async createProject(data: CreateProjectRequest, userId: string) {
    // Validar área do conhecimento
    const area = await prisma.areaConhecimento.findUnique({
      where: { id: data.areaConhecimentoId }
    });
    
    if (!area) {
      throw new Error('Área do conhecimento não encontrada');
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        summary: data.summary,
        objective: data.objective,
        methodology: data.methodology,
        results: data.results,
        conclusion: data.conclusion,
        bibliography: data.bibliography,
        category: data.category,
        areaConhecimentoId: data.areaConhecimentoId,
        keywords: data.keywords || [],
        researchLine: data.researchLine,
        institution: data.institution,
        institutionCity: data.institutionCity,
        institutionState: data.institutionState,
        institutionCountry: data.institutionCountry || 'Brasil',
        isPublicSchool: data.isPublicSchool || false,
        isRuralSchool: data.isRuralSchool || false,
        isIndigenous: data.isIndigenous || false,
        hasDisability: data.hasDisability || false,
        socialVulnerability: data.socialVulnerability || false,
        ownerId: userId,
        status: 'RASCUNHO'
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true }
        },
        areaConhecimento: {
          select: { id: true, sigla: true, nome: true, nivel: true }
        },
        members: {
          select: { 
            id: true, name: true, email: true, cpf: true, 
            birthDate: true, gender: true, schoolLevel: true, schoolYear: true 
          }
        },
        orientadores: {
          select: { 
            id: true, name: true, email: true, formation: true, 
            area: true, institution: true, position: true 
          }
        }
      }
    });

    return project;
  }

  // ===== LISTAR PROJETOS =====
  static async getProjects(userRole: string, userId?: string) {
    const where: any = {};

    // Se não for admin, só mostra projetos próprios
    if (userRole !== 'ADMINISTRADOR') {
      where.ownerId = userId;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true }
        },
        areaConhecimento: {
          select: { id: true, sigla: true, nome: true, nivel: true }
        },
        members: {
          select: { 
            id: true, name: true, email: true, schoolLevel: true, schoolYear: true 
          }
        },
        orientadores: {
          select: { 
            id: true, name: true, email: true, formation: true, institution: true 
          }
        },
        _count: {
          select: { members: true, orientadores: true, documents: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return projects;
  }

  // ===== BUSCAR POR ID =====
  static async getProjectById(id: string, userRole: string, userId?: string) {
    const where: any = { id };

    if (userRole !== 'ADMINISTRADOR') {
      where.ownerId = userId;
    }

    const project = await prisma.project.findFirst({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true, phone: true }
        },
        areaConhecimento: {
          select: { id: true, sigla: true, nome: true, nivel: true }
        },
        members: {
          select: { 
            id: true, name: true, email: true, cpf: true, rg: true,
            birthDate: true, gender: true, phone: true, address: true,
            city: true, state: true, schoolLevel: true, schoolYear: true,
            institution: true, isIndigenous: true, hasDisability: true, isRural: true
          }
        },
        orientadores: {
          select: { 
            id: true, name: true, email: true, cpf: true, phone: true,
            formation: true, area: true, institution: true, position: true,
            city: true, state: true, yearsExperience: true, lattesUrl: true
          }
        },
        documents: {
          select: {
            id: true, name: true, description: true, version: true,
            isRequired: true, isApproved: true, isPublic: true,
            uploadedAt: true, fileSize: true, mimeType: true
          }
        },
        feiraAfiliada: {
          select: { id: true, name: true, city: true, state: true, year: true }
        }
      }
    });

    return project;
  }

  // ===== ATUALIZAR PROJETO =====
  static async updateProject(id: string, data: UpdateProjectRequest, userRole: string, userId: string) {
    // Verificar se projeto existe
    const project = await prisma.project.findFirst({
      where: userRole === 'ADMINISTRADOR' ? { id } : { id, ownerId: userId }
    });

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    // Verificar se pode editar
    if (userRole !== 'ADMINISTRADOR' && project.status !== 'RASCUNHO') {
      throw new Error('Apenas projetos em rascunho podem ser editados');
    }

    // Validar área se fornecida
    if (data.areaConhecimentoId) {
      const area = await prisma.areaConhecimento.findUnique({
        where: { id: data.areaConhecimentoId }
      });
      
      if (!area) {
        throw new Error('Área do conhecimento não encontrada');
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true }
        },
        areaConhecimento: {
          select: { id: true, sigla: true, nome: true, nivel: true }
        },
        members: {
          select: { 
            id: true, name: true, email: true, schoolLevel: true, schoolYear: true 
          }
        },
        orientadores: {
          select: { 
            id: true, name: true, email: true, formation: true, institution: true 
          }
        }
      }
    });

    return updatedProject;
  }

  // ===== DELETAR PROJETO =====
  static async deleteProject(id: string, userRole: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: userRole === 'ADMINISTRADOR' ? { id } : { id, ownerId: userId }
    });

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    if (project.status !== 'RASCUNHO') {
      throw new Error('Apenas projetos em rascunho podem ser excluídos');
    }

    await prisma.project.delete({ where: { id } });
    return { message: 'Projeto excluído com sucesso' };
  }

  // ===== ENVIAR PROJETO =====
  static async submitProject(id: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: { id, ownerId: userId }
    });

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    if (project.status !== 'RASCUNHO') {
      throw new Error('Apenas projetos em rascunho podem ser enviados');
    }

    // Validar se tem dados obrigatórios
    if (!project.title || !project.summary || !project.objective || !project.methodology) {
      throw new Error('Projeto precisa ter título, resumo, objetivo e metodologia preenchidos');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { 
        status: 'SUBMETIDO',
        submissionDate: new Date()
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true }
        },
        areaConhecimento: {
          select: { id: true, sigla: true, nome: true, nivel: true }
        },
        members: {
          select: { 
            id: true, name: true, email: true, schoolLevel: true, schoolYear: true 
          }
        },
        orientadores: {
          select: { 
            id: true, name: true, email: true, formation: true, institution: true 
          }
        }
      }
    });

    return updatedProject;
  }

  // ===== ALTERAR STATUS (ADMIN) =====
  static async updateStatus(id: string, status: string, userRole: string) {
    if (userRole !== 'ADMINISTRADOR') {
      throw new Error('Apenas administradores podem alterar status');
    }

    // Validar status
    const validStatuses = [
      'RASCUNHO', 'SUBMETIDO', 'EM_ANALISE_CIAS', 'APROVADO_CIAS', 'REPROVADO_CIAS',
      'AGUARDANDO_PAGAMENTO', 'CONFIRMADO_VIRTUAL', 'FINALISTA_PRESENCIAL', 
      'PREMIADO', 'ARQUIVADO'
    ];

    if (!validStatuses.includes(status)) {
      throw new Error('Status inválido');
    }

    // Lógica para datas baseadas no status
    const updateData: any = { status };
    
    if (status === 'APROVADO_CIAS') {
      updateData.ciasResultDate = new Date();
      updateData.passedCias = true;
    } else if (status === 'CONFIRMADO_VIRTUAL') {
      updateData.virtualStartDate = new Date();
      updateData.passedVirtual = true;
      updateData.isPaid = true;
    } else if (status === 'FINALISTA_PRESENCIAL') {
      updateData.isFinalist = true;
    } else if (status === 'PREMIADO') {
      updateData.isAwarded = true;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true }
        },
        areaConhecimento: {
          select: { id: true, sigla: true, nome: true, nivel: true }
        },
        members: {
          select: { 
            id: true, name: true, email: true, schoolLevel: true, schoolYear: true 
          }
        },
        orientadores: {
          select: { 
            id: true, name: true, email: true, formation: true, institution: true 
          }
        }
      }
    });

    return updatedProject;
  }

  // ===== ÁREAS DO CONHECIMENTO =====
  static async getAreas(nivel?: number) {
    const where: any = { isActive: true };
    if (nivel) where.nivel = nivel;

    return await prisma.areaConhecimento.findMany({
      where,
      orderBy: [
        { nivel: 'asc' },
        { nome: 'asc' }
      ],
      select: {
        id: true,
        sigla: true,
        nome: true,
        nivel: true,
        paiId: true,
        pai: {
          select: { sigla: true, nome: true }
        },
        _count: {
          select: { projects: true }
        }
      }
    });
  }

  // ===== ESTATÍSTICAS (NOVO) =====
  static async getProjectStats(userRole: string, userId?: string) {
    const where: any = {};
    if (userRole !== 'ADMINISTRADOR') {
      where.ownerId = userId;
    }

    const [
      total,
      rascunho,
      submetidos,
      aprovados,
      reprovados,
      finalistasPresencial,
      premiados
    ] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.count({ where: { ...where, status: 'RASCUNHO' } }),
      prisma.project.count({ where: { ...where, status: 'SUBMETIDO' } }),
      prisma.project.count({ where: { ...where, status: 'APROVADO_CIAS' } }),
      prisma.project.count({ where: { ...where, status: 'REPROVADO_CIAS' } }),
      prisma.project.count({ where: { ...where, status: 'FINALISTA_PRESENCIAL' } }),
      prisma.project.count({ where: { ...where, status: 'PREMIADO' } })
    ]);

    return {
      total,
      rascunho,
      submetidos,
      aprovados,
      reprovados,
      finalistasPresencial,
      premiados
    };
  }
}