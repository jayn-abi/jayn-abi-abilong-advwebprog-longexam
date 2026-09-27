import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const getHomePathForUser = (user) => {
  if (user?.type === 'admin') return '/admin';
  if (user?.type === 'supplier') return '/supplier/products';
  return '/';
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
