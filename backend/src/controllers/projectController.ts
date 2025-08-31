import { Response } from 'express';
import { ProjectService } from '../services/projectService';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    const project = await ProjectService.createProject(req.body, userId);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(400).json({ success: false, message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId || !userRole) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    const projects = await ProjectService.getProjects(userRole, userId);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const projectId = req.params.id;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const project = await ProjectService.getProjectById(projectId, userRole, userId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const projectId = req.params.id;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const project = await ProjectService.updateProject(projectId, req.body, userRole, userId);
    res.json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    const statusCode = message.includes('não encontrado') ? 404 : 400;
    res.status(statusCode).json({ success: false, message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const projectId = req.params.id;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const result = await ProjectService.deleteProject(projectId, userRole, userId);
    res.json({ success: true, message: result.message });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    const statusCode = message.includes('não encontrado') ? 404 : 400;
    res.status(statusCode).json({ success: false, message });
  }
};

export const submitProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const project = await ProjectService.submitProject(projectId, userId);
    res.json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(400).json({ success: false, message });
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    const projectId = req.params.id;
    const { status } = req.body;

    if (!userRole) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const project = await ProjectService.updateStatus(projectId, status, userRole);
    res.json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    const statusCode = message.includes('administradores') ? 403 : 400;
    res.status(statusCode).json({ success: false, message });
  }
};

export const getAreasConhecimento = async (req: any, res: Response) => {
  try {
    const nivel = req.query.nivel ? parseInt(req.query.nivel) : undefined;
    const areas = await ProjectService.getAreas(nivel);
    res.json({ success: true, data: areas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

export const getProjectStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId || !userRole) {
      return res.status(401).json({ success: false, message: 'Não autenticado' });
    }

    const stats = await ProjectService.getProjectStats(userRole, userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
};