'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');

    setToken(data.token);
    localStorage.setItem('token', data.token);
    router.push('/');
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to send reset link');

    router.push(`/reset-password?token=${data.token}`);
  };

  const resetPassword = async (token: string, password: string) => {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Reset failed');

    alert('Password reset successful!');
    router.push('/login');
  };

  const logout = async() => {
    const res = await fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    });
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ token, login, forgotPassword, resetPassword, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
