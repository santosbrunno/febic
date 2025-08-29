export interface Project {
  id: number;
  title: string;
  abstract: string;
  category: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateProjectData {
  title: string;
  abstract: string;
  category: string;
}

export interface UpdateProjectData {
  title?: string;
  abstract?: string;
  category?: string;
}

export interface ProjectFilters {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProjectStats {
  total: number;
  byStatus: {
    DRAFT: number;
    SUBMITTED: number;
    APPROVED: number;
    REJECTED: number;
  };
}

// 10 CATEGORIAS REAIS DO FEBIC (9 + RELATO)
export const PROJECT_CATEGORIES = [
  { 
    value: 'CATEGORIA_I', 
    label: 'I - Educação Infantil (3-6 anos)', 
    maxParticipants: 6,
    ageRange: '3-6 anos'
  },
  { 
    value: 'CATEGORIA_II', 
    label: 'II - Ensino Fundamental 1º-3º ano', 
    maxParticipants: 5,
    ageRange: '1º-3º ano'
  },
  { 
    value: 'CATEGORIA_III', 
    label: 'III - Ensino Fundamental 4º-6º ano', 
    maxParticipants: 5,
    ageRange: '4º-6º ano'
  },
  { 
    value: 'CATEGORIA_IV', 
    label: 'IV - Ensino Fundamental 7º-9º ano', 
    maxParticipants: 3,
    ageRange: '7º-9º ano'
  },
  { 
    value: 'CATEGORIA_V', 
    label: 'V - Ensino Médio', 
    maxParticipants: 3,
    ageRange: 'Ensino Médio'
  },
  { 
    value: 'CATEGORIA_VI', 
    label: 'VI - Educação de Jovens e Adultos (EJA)', 
    maxParticipants: 3,
    ageRange: 'EJA'
  },
  { 
    value: 'CATEGORIA_VII', 
    label: 'VII - Técnico', 
    maxParticipants: 3,
    ageRange: 'Técnico'
  },
  { 
    value: 'CATEGORIA_VIII', 
    label: 'VIII - Ensino Superior', 
    maxParticipants: 3,
    ageRange: 'Superior'
  },
  { 
    value: 'CATEGORIA_IX', 
    label: 'IX - Pós-graduação', 
    maxParticipants: 3,
    ageRange: 'Pós-graduação'
  },
  { 
    value: 'RELATO', 
    label: 'RELATO - Experiência Científico-Pedagógica', 
    maxParticipants: null, // Sem limite específico mencionado
    ageRange: 'Educadores'
  }
];

export const PROJECT_STATUS = [
  { value: 'DRAFT', label: 'Rascunho', color: 'gray' },
  { value: 'SUBMITTED', label: 'Enviado', color: 'blue' },
  { value: 'APPROVED', label: 'Aprovado', color: 'green' },
  { value: 'REJECTED', label: 'Rejeitado', color: 'red' }
];