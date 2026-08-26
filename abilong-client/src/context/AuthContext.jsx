import { useState } from 'react';
import { authApi, usersApi, setToken, clearToken } from '../lib/api';
import { AuthContext } from './auth-context';

const USER_KEY = 'bulldogex_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    persistUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const data = await authApi.signup(payload);
    setToken(data.token);
    persistUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearToken();
    persistUser(null);
  };

  const refreshUser = async () => {
    const freshUser = await usersApi.me();
    persistUser(freshUser);
    return freshUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
