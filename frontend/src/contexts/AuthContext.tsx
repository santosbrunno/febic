
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/Auth';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se usuário já está logado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('febic_token');
      const savedUser = localStorage.getItem('febic_user');

      if (savedToken && savedUser) {
        try {
          // Verificar se token ainda é válido
          const isValid = await authService.verifyToken();
          if (isValid) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          } else {
            // Token inválido, limpar dados
            localStorage.removeItem('febic_token');
            localStorage.removeItem('febic_user');
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('febic_token');
          localStorage.removeItem('febic_user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const { user: userData, token: userToken } = response.data;
        
        // Salvar no localStorage
        localStorage.setItem('febic_token', userToken);
        localStorage.setItem('febic_user', JSON.stringify(userData));
        
        // Atualizar estado
        setUser(userData);
        setToken(userToken);
        
        toast.success(`Bem-vindo(a), ${userData.name}!`);
        return true;
      } else {
        toast.error(response.message || 'Erro no login');
        return false;
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      const errorMessage = error.response?.data?.message || 'Erro no login';
      toast.error(errorMessage);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    toast.success('Logout realizado com sucesso');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};