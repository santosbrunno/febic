import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {  // ✅ camelCase correto
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);  // ✅ campo correto

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Atualizar dados de login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        loginCount: user.loginCount + 1
      }
    });

    const token = generateToken({
      userId: user.id,  // string agora
      email: user.email,
      role: user.role
    });

    const { passwordHash, ...userWithoutPassword } = user;  // ✅ nome correto do campo

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, cpf, name, phone, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email }, 
          ...(cpf ? [{ cpf }] : [])
        ] 
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email ou CPF já cadastrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        cpf,
        name,
        phone,
        passwordHash: hashedPassword,  // ✅ campo correto
        role: 'AUTOR'  // enum correto
      },
      select: {
        id: true,
        email: true,
        cpf: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,     // ✅ camelCase correto
        createdAt: true,    // ✅ camelCase correto
        updatedAt: true     // ✅ camelCase correto
      }
    });

    const token = generateToken({
      userId: user.id,  // string
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: { user, token }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;  // ainda vem como number do middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },  // ✅ converter para string temporariamente
      select: {
        id: true,
        email: true,
        cpf: true,
        name: true,
        phone: true,
        birthDate: true,
        gender: true,
        nationality: true,
        address: true,
        neighborhood: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        institution: true,
        position: true,
        formation: true,
        role: true,
        isActive: true,       // ✅ camelCase correto
        emailVerified: true,
        lastLogin: true,
        loginCount: true,
        createdAt: true,      // ✅ camelCase correto
        updatedAt: true       // ✅ camelCase correto
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};