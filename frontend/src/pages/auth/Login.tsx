import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    await login(formData.email, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para preencher credenciais de teste
  const fillTestCredentials = (type: 'admin' | 'author') => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@febic.com.br',
        password: 'admin123',
      });
    } else {
      setFormData({
        email: 'autor@febic.com.br',
        password: 'autor123',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="container max-w-md bg-white rounded-xl shadow-elegant p-8 transition-all">
        {/* Header do formulário */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Bem-vindo à FEBIC
          </h1>
          <p className="text-lg text-muted-foreground">
            Faça login para acessar a Feira Brasileira de Iniciação Científica
          </p>
        </div>

        {/* Botões de teste */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">🧪 Credenciais de teste:</p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillTestCredentials('admin')}
              className="flex-1 hover-lift hover-glow"
            >
              👨‍💼 Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillTestCredentials('author')}
              className="flex-1 hover-lift hover-glow"
            >
              👩‍💻 Autor
            </Button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10 transition-smooth"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10 transition-smooth"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-smooth" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-smooth" />
                )}
              </button>
            </div>
          </div>

          {/* Botão de submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary hover-lift hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link to="/auth/register" className="text-primary hover:underline transition-smooth">
              Inscreva-se
            </Link>
          </p>
          <Link
            to="/"
            className="text-primary hover:underline hover:text-primary-700 transition-smooth flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Sistema de Gestão de Feiras Científicas &copy; 2025 FEBIC
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;