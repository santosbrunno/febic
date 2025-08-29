
import Joi from 'joi';
import { Category, ProjectStatus } from '@prisma/client';

const validCategories = Object.values(Category);
const validStatuses = Object.values(ProjectStatus);

export const createProjectSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Título deve ter pelo menos 10 caracteres',
      'string.max': 'Título deve ter no máximo 500 caracteres',
      'any.required': 'Título é obrigatório'
    }),
  
  abstract: Joi.string()
    .min(50)
    .max(3000)
    .required()
    .messages({
      'string.min': 'Resumo deve ter pelo menos 50 caracteres',
      'string.max': 'Resumo deve ter no máximo 3000 caracteres',
      'any.required': 'Resumo é obrigatório'
    }),
    
  category: Joi.string()
    .valid(...validCategories)
    .required()
    .messages({
      'any.only': 'Categoria inválida',
      'any.required': 'Categoria é obrigatória'
    })
});

export const updateProjectSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(500)
    .messages({
      'string.min': 'Título deve ter pelo menos 10 caracteres',
      'string.max': 'Título deve ter no máximo 500 caracteres'
    }),
    
  abstract: Joi.string()
    .min(50)
    .max(3000)
    .messages({
      'string.min': 'Resumo deve ter pelo menos 50 caracteres',
      'string.max': 'Resumo deve ter no máximo 3000 caracteres'
    }),
    
  category: Joi.string()
    .valid(...validCategories)
    .messages({
      'any.only': 'Categoria inválida'
    })
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...validStatuses)
    .required()
    .messages({
      'any.only': 'Status inválido',
      'any.required': 'Status é obrigatório'
    })
});

export const projectFiltersSchema = Joi.object({
  status: Joi.string().valid(...validStatuses),
  category: Joi.string().valid(...validCategories),
  authorId: Joi.number().integer().positive(),
  search: Joi.string().max(100),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});