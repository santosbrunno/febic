import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const project = await ProjectService.createProject(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Projeto criado com sucesso',
      data: { project }
    });

  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const filters = req.query as any;
    const result = await ProjectService.getProjects(filters, userRole, userId);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const project = await ProjectService.getProjectById(parseInt(id), userRole, userId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    res.json({
      success: true,
      data: { project }
    });

  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const project = await ProjectService.updateProject(
      parseInt(id), 
      req.body, 
      userRole, 
      userId
    );

    res.json({
      success: true,
      message: 'Projeto atualizado com sucesso',
      data: { project }
    });

  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    const statusCode = message.includes('não encontrado') ? 404 :
                      message.includes('não pode') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const result = await ProjectService.deleteProject(parseInt(id), userRole, userId);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Erro ao excluir projeto:', error);
    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    const statusCode = message.includes('não encontrado') ? 404 :
                      message.includes('não pode') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const submitProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const project = await ProjectService.submitProject(parseInt(id), userId);

    res.json({
      success: true,
      message: 'Projeto enviado para avaliação com sucesso',
      data: { project }
    });

  } catch (error) {
    console.error('Erro ao enviar projeto:', error);
    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    const statusCode = message.includes('não encontrado') ? 404 :
                      message.includes('não pode') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const project = await ProjectService.updateProjectStatus(
      parseInt(id), 
      req.body, 
      userRole
    );

    res.json({
      success: true,
      message: 'Status do projeto atualizado com sucesso',
      data: { project }
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    const statusCode = message.includes('Apenas administradores') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getProjectStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const stats = await ProjectService.getProjectStats(userRole, userId);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};