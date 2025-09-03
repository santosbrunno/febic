import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, User, MapPin, GraduationCap, CheckCircle } from "lucide-react";
import api from '@/services/api';
import toast from 'react-hot-toast';

type FebicRole = 'AUTOR' | 'ORIENTADOR';

const roleOptions = [
  { value: 'AUTOR', label: 'Autor/Estudante' },
  { value: 'ORIENTADOR', label: 'Orientador/Professor' },
];

const nivelEscolarOptions = [
  { value: 'Educação Infantil', label: 'Educação Infantil' },
  { value: 'Ensino Fundamental 1º-3º', label: 'Ensino Fundamental 1º-3º' },
  { value: 'Ensino Fundamental 4º-6º', label: 'Ensino Fundamental 4º-6º' },
  { value: 'Ensino Fundamental 7º-9º', label: 'Ensino Fundamental 7º-9º' },
  { value: 'Ensino Médio', label: 'Ensino Médio' },
  { value: 'Ensino Técnico', label: 'Ensino Técnico' },
  { value: 'EJA - Educação de Jovens e Adultos', label: 'EJA - Educação de Jovens e Adultos' },
  { value: 'Ensino Superior', label: 'Ensino Superior' },
  { value: 'Pós-graduação', label: 'Pós-graduação' },
];

const genderOptions = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Outro', label: 'Outro' },
  { value: 'Prefiro não informar', label: 'Prefiro não informar' },
];

interface FormData {
  // Dados básicos
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  phone: string;
  role: FebicRole | "";
  
  // Dados pessoais
  birthDate: string;
  gender: string;
  nationality: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Dados acadêmicos
  institution: string;
  position: string;
  formation: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    // Dados básicos
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
    role: "",
    
    // Dados pessoais
    birthDate: "",
    gender: "",
    nationality: "Brasileiro",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
    
    // Dados acadêmicos
    institution: "",
    position: "",
    formation: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formatação de campos
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{1,3})/, '$1-$2')
      .slice(0, 9);
  };

  // Validações
  const validateStep1 = useCallback(() => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome completo é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido";
    
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    else if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = "CPF deve ter 11 dígitos";
    
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório";
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = "Telefone inválido";
    
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem";
    if (!formData.role) newErrors.role = "Tipo de usuário é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateStep2 = useCallback(() => {
    const newErrors: FormErrors = {};
    
    if (!formData.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória";
    if (!formData.gender) newErrors.gender = "Gênero é obrigatório";
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!formData.neighborhood.trim()) newErrors.neighborhood = "Bairro é obrigatório";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.state.trim()) newErrors.state = "Estado é obrigatório";
    if (!formData.zipCode.trim()) newErrors.zipCode = "CEP é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateStep3 = useCallback(() => {
    const newErrors: FormErrors = {};
    
    if (!formData.institution.trim()) newErrors.institution = "Instituição é obrigatória";
    if (!formData.position) newErrors.position = "Nível escolar é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') formattedValue = formatCPF(value);
    else if (name === 'phone') formattedValue = formatPhone(value);
    else if (name === 'zipCode') formattedValue = formatZipCode(value);
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  const nextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Preencha todos os campos obrigatórios antes de continuar');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) return;
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf.replace(/\D/g, ''), // Remover formatação
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        nationality: formData.nationality,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode.replace(/\D/g, ''), // Remover formatação
        country: formData.country,
        institution: formData.institution,
        position: formData.position,
        formation: formData.formation || null,
        role: formData.role,
      };

      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        setShowSuccess(true);
        toast.success('Cadastro realizado com sucesso!');
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      const message = error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = useMemo(() => (currentStep / 3) * 100, [currentStep]);

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Dados Básicos</h3>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo *</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF *</label>
        <input
          id="cpf"
          name="cpf"
          type="text"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cpf ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.cpf && <p className="text-sm text-red-500">{errors.cpf}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone *</label>
        <input
          id="phone"
          name="phone"
          type="text"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha *</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha *</label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Tipo de Usuário *</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Selecione seu tipo de usuário</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
      </div>

      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Data de Nascimento *</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.birthDate ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gênero *</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Selecione seu gênero</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço (Rua, Número) *</label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Rua Exemplo, 123"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro *</label>
        <input
          id="neighborhood"
          name="neighborhood"
          type="text"
          placeholder="Bairro Exemplo"
          value={formData.neighborhood}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.neighborhood ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.neighborhood && <p className="text-sm text-red-500">{errors.neighborhood}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade *</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Cidade Exemplo"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado *</label>
          <input
            id="state"
            name="state"
            type="text"
            placeholder="SP"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? "border-red-500" : "border-gray-300"}`}
            maxLength={2}
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP *</label>
        <input
          id="zipCode"
          name="zipCode"
          type="text"
          placeholder="12345-678"
          value={formData.zipCode}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zipCode ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informações Acadêmicas</h3>
      </div>

      <div className="space-y-2">
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Instituição *</label>
        <input
          id="institution"
          name="institution"
          type="text"
          placeholder="Nome da escola, universidade ou instituição"
          value={formData.institution}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.institution ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Nível Escolar *</label>
        <select
          id="position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.position ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Selecione seu nível</option>
          {nivelEscolarOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="formation" className="block text-sm font-medium text-gray-700">Formação Acadêmica</label>
        <input
          id="formation"
          name="formation"
          type="text"
          placeholder="Ex: Licenciatura em Biologia (opcional)"
          value={formData.formation}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="container max-w-md bg-white rounded-xl shadow-elegant p-8">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Cadastro Realizado!</h1>
            <p className="text-gray-600">
              Sua conta foi criada com sucesso. Redirecionando para o login...
            </p>
            <div className="text-sm text-gray-500">
              Você será redirecionado em alguns segundos
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="container max-w-md bg-white rounded-xl shadow-elegant p-8">
        {/* Header do formulário */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Criar Conta na FEBIC
          </h1>
          <p className="text-lg text-gray-600">
            Cadastre-se para participar da Feira Brasileira de Iniciação Científica (Passo {currentStep} de 3)
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 flex items-center justify-end pr-1" 
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage === 100 && (
              <CheckCircle className="h-3 w-3 text-white" />
            )}
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between gap-4">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </button>
            )}
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/auth/login" className="text-blue-600 hover:underline">
                Faça login aqui
              </Link>
            </p>
          </div>
        </form>

        {/* Link para voltar à home */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-blue-600 hover:underline flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Sistema de Gestão de Feiras Científicas © 2025 FEBIC
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;