import React, { createContext, useState, useEffect, type ReactNode } from 'react';

import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  loading: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('labelaUser');
    const storagedToken = localStorage.getItem('labelaToken');

    if (storagedUser && storagedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (token: string, userData: User) => {
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    localStorage.setItem('labelaUser', JSON.stringify(userData));
    localStorage.setItem('labelaToken', token);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('labelaUser');
    localStorage.removeItem('labelaToken');
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
