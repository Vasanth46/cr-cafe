import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Restore user data from localStorage on app startup
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authService.login(username, password);
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (err: any) {
      console.error('Login failed:', err);

      // This line checks if the backend sent a specific error message.
      // If it did, it uses that message. Otherwise, it uses a generic one.

      let errorMessage = 'Something went wrong. Please try again.';

      if (err.response) {
        const status = err.response.status;

        if (status === 401 || status === 403) {
          errorMessage = 'Invalid username or password. Please try again.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          // If backend sends a specific message
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        // No response was received – backend might be down
        errorMessage = 'Server unreachable. Please check your internet or try again later.';
      } else {
        errorMessage = 'Unexpected error occurred.';
      }
      setError(errorMessage); // Set the specific error message to be displayed

      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore errors, proceed to clear local state
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 