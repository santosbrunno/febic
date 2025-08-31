// ===== ENUMS E CONSTANTES =====

export type ProjectCategory = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'RELATO';

export type ProjectStatus = 
  | 'RASCUNHO' 
  | 'SUBMETIDO' 
  | 'SELECIONADO' 
  | 'CONFIRMADO_VIRTUAL' 
  | 'FINALISTA' 
  | 'CONFIRMADO_PRESENCIAL' 
  | 'AVALIADO' 
  | 'PREMIADO' 
  | 'DESCLASSIFICADO';

export type MemberRole = 'AUTOR_PRINCIPAL' | 'AUTOR';
export type OrientadorTipo = 'ORIENTADOR' | 'COORIENTADOR';

// ===== INTERFACES PRINCIPAIS =====

export interface Project {
  id: number;
  titulo: string;
  categoria: ProjectCategory;
  areaConhecimentoId: string;
  resumo?: string;
  palavrasChave?: string;
  status: ProjectStatus;
  isCredenciado: boolean;
  tokenFeira?: string;
  institutionName?: string;
  institutionState?: string;
  institutionCity?: string;
  isPublicInstitution: boolean;
  isFullTimeInstitution: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  areaConhecimento?: {
    codigo: string;
    nome: string;
    nivel: number;
  };
  members?: ProjectMemberWithUser[];
  orientadores?: ProjectOrientadorWithUser[];
  documents?: ProjectDocumentInfo[];
  _count?: {
    members: number;
    orientadores: number;
    documents: number;
  };
}

export interface ProjectMemberWithUser {
  id: number;
  projectId: number;
  userId: number;
  role: MemberRole;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProjectOrientadorWithUser {
  id: number;
  projectId: number;
  userId: number;
  tipo: OrientadorTipo;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProjectDocumentInfo {
  id: number;
  projectId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy: number;
  createdAt: string;
}

export interface AreaConhecimento {
  codigo: string;
  nome: string;
  nivel: number;
  codigoPai?: string;
}

// ===== FORMULÁRIOS =====

export interface CreateProjectData {
  titulo: string;
  categoria: ProjectCategory;
  areaConhecimentoId: string;
  resumo?: string;
  palavrasChave?: string;
  institutionName?: string;
  institutionState?: string;
  institutionCity?: string;
  isPublicInstitution?: boolean;
  isFullTimeInstitution?: boolean;
  tokenFeira?: string;
}

export interface UpdateProjectData {
  titulo?: string;
  categoria?: ProjectCategory;
  areaConhecimentoId?: string;
  resumo?: string;
  palavrasChave?: string;
  institutionName?: string;
  institutionState?: string;
  institutionCity?: string;
  isPublicInstitution?: boolean;
  isFullTimeInstitution?: boolean;
}

// ===== FILTROS =====

export interface ProjectFilters {
  search?: string;
  categoria?: ProjectCategory;
  status?: ProjectStatus;
  areaConhecimentoId?: string;
  isCredenciado?: boolean;
  institutionState?: string;
  createdBy?: number;
  page?: number;
  limit?: number;
}

// ===== RESPOSTAS DA API =====

export interface ProjectsListResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectStats {
  total: number;
  byStatus: Record<ProjectStatus, number>;
  byCategory: Record<ProjectCategory, number>;
  credenciados: number;
  publicInstitutions: number;
  fullTimeInstitutions: number;
  pendingPayments: number;
}

// ===== CONFIGURAÇÕES POR CATEGORIA =====

export const PROJECT_CATEGORIES = [
  {
    value: 'I' as ProjectCategory,
    label: 'I - Educação Infantil (3-6 anos)',
    maxParticipants: 6,
    ageRange: '3-6 anos'
  },
  {
    value: 'II' as ProjectCategory,
    label: 'II - Ensino Fundamental 1º-3º ano',
    maxParticipants: 5,
    ageRange: '1º-3º ano'
  },
  {
    value: 'III' as ProjectCategory,
    label: 'III - Ensino Fundamental 4º-6º ano',
    maxParticipants: 5,
    ageRange: '4º-6º ano'
  },
  {
    value: 'IV' as ProjectCategory,
    label: 'IV - Ensino Fundamental 7º-9º ano',
    maxParticipants: 3,
    ageRange: '7º-9º ano'
  },
  {
    value: 'V' as ProjectCategory,
    label: 'V - Ensino Médio',
    maxParticipants: 3,
    ageRange: 'Ensino Médio'
  },
  {
    value: 'VI' as ProjectCategory,
    label: 'VI - Educação de Jovens e Adultos (EJA)',
    maxParticipants: 3,
    ageRange: 'EJA'
  },
  {
    value: 'VII' as ProjectCategory,
    label: 'VII - Técnico',
    maxParticipants: 3,
    ageRange: 'Técnico'
  },
  {
    value: 'VIII' as ProjectCategory,
    label: 'VIII - Ensino Superior',
    maxParticipants: 3,
    ageRange: 'Superior'
  },
  {
    value: 'IX' as ProjectCategory,
    label: 'IX - Pós-graduação',
    maxParticipants: 3,
    ageRange: 'Pós-graduação'
  },
  {
    value: 'RELATO' as ProjectCategory,
    label: 'RELATO - Experiência Científico-Pedagógica',
    maxParticipants: 5,
    ageRange: 'Educadores'
  }
];

export const PROJECT_STATUS = [
  { value: 'RASCUNHO', label: 'Rascunho', color: 'gray' },
  { value: 'SUBMETIDO', label: 'Submetido', color: 'blue' },
  { value: 'SELECIONADO', label: 'Selecionado', color: 'green' },
  { value: 'CONFIRMADO_VIRTUAL', label: 'Confirmado Virtual', color: 'blue' },
  { value: 'FINALISTA', label: 'Finalista', color: 'green' },
  { value: 'CONFIRMADO_PRESENCIAL', label: 'Confirmado Presencial', color: 'purple' },
  { value: 'AVALIADO', label: 'Avaliado', color: 'blue' },
  { value: 'PREMIADO', label: 'Premiado', color: 'yellow' },
  { value: 'DESCLASSIFICADO', label: 'Desclassificado', color: 'red' }
] as const;

export const PROJECT_STATUS_INFO: Record<ProjectStatus, {
  label: string;
  description: string;
  color: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}> = {
  'RASCUNHO': {
    label: 'Rascunho',
    description: 'Projeto em elaboração',
    color: 'gray'
  },
  'SUBMETIDO': {
    label: 'Submetido',
    description: 'Enviado para avaliação do CIAS',
    color: 'blue'
  },
  'SELECIONADO': {
    label: 'Selecionado',
    description: 'Aprovado pelo CIAS para fase virtual',
    color: 'green'
  },
  'CONFIRMADO_VIRTUAL': {
    label: 'Confirmado Virtual',
    description: 'Participação virtual confirmada e paga',
    color: 'blue'
  },
  'FINALISTA': {
    label: 'Finalista',
    description: 'Classificado para fase presencial',
    color: 'green'
  },
  'CONFIRMADO_PRESENCIAL': {
    label: 'Confirmado Presencial',
    description: 'Participação presencial confirmada e paga',
    color: 'purple'
  },
  'AVALIADO': {
    label: 'Avaliado',
    description: 'Avaliação concluída',
    color: 'blue'
  },
  'PREMIADO': {
    label: 'Premiado',
    description: 'Projeto premiado',
    color: 'yellow'
  },
  'DESCLASSIFICADO': {
    label: 'Desclassificado',
    description: 'Não atendeu aos critérios',
    color: 'red'
  }
};

// ===== UTILITÁRIOS =====

export const getProjectCategoryInfo = (category: ProjectCategory) => {
  return PROJECT_CATEGORIES.find(c => c.value === category);
};

export const getProjectStatusInfo = (status: ProjectStatus) => {
  return PROJECT_STATUS_INFO[status];
};

export const canEditProject = (project: Project, userId?: number) => {
  const isOwner = project.createdBy === userId;
  const isAuthorPrincipal = project.members?.some(
    m => m.userId === userId && m.role === 'AUTOR_PRINCIPAL'
  );
  
  return (isOwner || isAuthorPrincipal) && 
         ['RASCUNHO', 'SUBMETIDO'].includes(project.status);
};

export const canDeleteProject = (project: Project, userId?: number) => {
  return project.createdBy === userId && project.status === 'RASCUNHO';
};

export const canSubmitProject = (project: Project, userId?: number) => {
  const isOwner = project.createdBy === userId;
  const isAuthorPrincipal = project.members?.some(
    m => m.userId === userId && m.role === 'AUTOR_PRINCIPAL'
  );
  
  return (isOwner || isAuthorPrincipal) && project.status === 'RASCUNHO';
};