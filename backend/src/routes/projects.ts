import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  submitProject,
  updateProjectStatus,
  getProjectStats,
  getAreasConhecimento
} from '../controllers/projectController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest, validateQuery } from '../middleware/validation';
import { 
  createProjectSchema, 
  updateProjectSchema, 
  updateStatusSchema,
  projectFiltersSchema 
} from '../utils/validators';

const router = Router();
router.use((req, res, next) => {
  console.log(`🔍 ROTA PROJECTS: ${req.method} ${req.path}`);
  next();
});

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas gerais
router.get('/', validateQuery(projectFiltersSchema), getProjects);
router.post('/', validateRequest(createProjectSchema), createProject);
router.get('/stats', getProjectStats);

// Rota para áreas do conhecimento
router.get('/areas', getAreasConhecimento);
// Rotas para áreas hierárquicas CNPq
router.get('/areas/principais', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const areas = await prisma.areaConhecimento.findMany({
      where: {
        nivel: 1,
        isActive: true
      },
      orderBy: { nome: 'asc' }
    });
    
    res.json({ success: true, data: areas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar áreas principais' });
  }
});

router.get('/areas/subareas/:paiId', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const { paiId } = req.params;
    
    const subareas = await prisma.areaConhecimento.findMany({
      where: {
        paiId,
        isActive: true
      },
      orderBy: { nome: 'asc' }
    });
    
    res.json({ success: true, data: subareas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar subáreas' });
  }
});

// Rotas específicas de projetos
router.get('/:id', getProjectById);
router.put('/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

// Ações específicas
router.post('/:id/submit', submitProject);

// Rotas admin apenas - usando role correto
router.put('/:id/status', requireRole(['ADMINISTRADOR']), validateRequest(updateStatusSchema), updateProjectStatus);

export default router;