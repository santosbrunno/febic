import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  submitProject,
  updateProjectStatus,
  getProjectStats
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

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas gerais
router.get('/', validateQuery(projectFiltersSchema), getProjects);
router.post('/', validateRequest(createProjectSchema), createProject);
router.get('/stats', getProjectStats);

// Rotas específicas de projetos
router.get('/:id', getProjectById);
router.put('/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

// Ações específicas
router.post('/:id/submit', submitProject);

// Rotas admin apenas
router.put('/:id/status', requireRole(['ADMIN']), validateRequest(updateStatusSchema), updateProjectStatus);

export default router;