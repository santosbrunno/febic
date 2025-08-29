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

export const PROJECT_CATEGORIES = [
  { value: 'CIENCIAS_EXATAS', label: 'Ciências Exatas' },
  { value: 'CIENCIAS_BIOLOGICAS', label: 'Ciências Biológicas' },
  { value: 'CIENCIAS_HUMANAS', label: 'Ciências Humanas' },
  { value: 'CIENCIAS_SOCIAIS', label: 'Ciências Sociais' },
  { value: 'ENGENHARIAS', label: 'Engenharias' },
  { value: 'CIENCIAS_AGRARIAS', label: 'Ciências Agrárias' },
  { value: 'CIENCIAS_SAUDE', label: 'Ciências da Saúde' },
  { value: 'LINGUISTICA_LETRAS', label: 'Linguística e Letras' }
];

export const PROJECT_STATUS = [
  { value: 'DRAFT', label: 'Rascunho', color: 'gray' },
  { value: 'SUBMITTED', label: 'Enviado', color: 'blue' },
  { value: 'APPROVED', label: 'Aprovado', color: 'green' },
  { value: 'REJECTED', label: 'Rejeitado', color: 'red' }
];