import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;  // ✅ Corrigido para string (CUID)
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('🔐 MIDDLEWARE AUTH: Verificando token...');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }

    req.user = {
      userId: String(decoded.userId),  // ✅ Garantir que seja string
      email: decoded.email,
      role: decoded.role
    };

    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Não autenticado'
    });
  }

  if (req.user.role !== 'ADMINISTRADOR') {  // ✅ Usar enum correto
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }

  next();
};

// ✅ NOVA FUNÇÃO: requireRole para múltiplos roles
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    // Mapear roles antigos para novos se necessário
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'ADMINISTRADOR',
      'AUTHOR': 'AUTOR',
      'EVALUATOR': 'AVALIADOR'
    };

    const userRole = req.user.role;
    const mappedAllowedRoles = allowedRoles.map(role => roleMap[role] || role);

    if (!mappedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado. Roles permitidos: ${mappedAllowedRoles.join(', ')}`
      });
    }

    next();
  };
};

// ✅ Middleware específico para administradores (usando requireRole)
export const requireAdministrator = requireRole(['ADMINISTRADOR']);

// ✅ Middleware para autor ou admin
export const requireAuthorOrAdmin = requireRole(['AUTOR', 'ADMINISTRADOR']);

// ✅ Middleware para avaliador ou admin  
export const requireEvaluatorOrAdmin = requireRole(['AVALIADOR', 'ADMINISTRADOR']);