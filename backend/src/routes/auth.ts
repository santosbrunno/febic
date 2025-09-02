import { Router } from 'express';
import { register, login, getMe, searchUserByCPF } from '../controllers/authController'; // Adicionar searchUserByCPF
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/me', authenticateToken, getMe);
router.get('/search-cpf/:cpf', authenticateToken, searchUserByCPF); // Nova rota

export default router;