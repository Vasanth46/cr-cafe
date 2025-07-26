import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from '../services/authService'; // Corrected import
import { type User } from '../types';
import { useToaster } from '../components/Toaster';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Define default values for environment variables
const DEFAULT_INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const DEFAULT_ACTIVITY_CHECK_INTERVAL = 30000; // 30 seconds

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate(); // Get the navigate function
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toaster = useToaster();

  // Wrap logout in useCallback to stabilize its reference for useEffect dependencies
  const logout = useCallback((showToast: boolean = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActive');
    setError(null); // Clear any previous error
    if (showToast) {
      toaster.showToast('Logged out successfully', 'success');
    }
    // Optional: Call backend logout to invalidate refresh token if needed
    // authService.logout().catch((err) => toaster.showToast('Logout failed', 'error'));
  }, [toaster]);

  // This effect runs only once when the app loads to check for a closed session
  useEffect(() => {
    // Use environment variable with a fallback to the default
    const INACTIVITY_TIMEOUT = 
      Number(import.meta.env.VITE_SESSION_INACTIVITY_TIMEOUT_MS) || DEFAULT_INACTIVITY_TIMEOUT;

    const tokenFromStorage = localStorage.getItem('token');
    const lastActiveString = localStorage.getItem('lastActive');

    if (tokenFromStorage && lastActiveString) {
      const lastActive = parseInt(lastActiveString, 10);
      const timeSinceLastActive = Date.now() - lastActive;

      if (timeSinceLastActive > INACTIVITY_TIMEOUT) {
        console.log("Session expired due to inactivity while closed. Forcing logout.");
        logout(false); // Use the logout function, no toast
      } else {
        // Session is valid, initialize state
        setToken(tokenFromStorage);
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
          setUser(JSON.parse(userFromStorage));
        }
      }
    }

    setLoading(false);

    // --- Set up activity tracking ---
    const updateLastActive = () => {
      localStorage.setItem('lastActive', Date.now().toString());
    };

    window.addEventListener('mousemove', updateLastActive);
    window.addEventListener('keydown', updateLastActive);
    window.addEventListener('click', updateLastActive);
    window.addEventListener('scroll', updateLastActive);
    window.addEventListener('beforeunload', updateLastActive);
    updateLastActive(); // Initial call

    return () => {
      window.removeEventListener('mousemove', updateLastActive);
      window.removeEventListener('keydown', updateLastActive);
      window.removeEventListener('click', updateLastActive);
      window.removeEventListener('scroll', updateLastActive);
      window.removeEventListener('beforeunload', updateLastActive);
    };
  }, [logout]); // Dependency on logout

  // --- NEW: This effect sets up a timer to check for inactivity while the app is open ---
  useEffect(() => {
    // Use environment variable with a fallback to the default
    const INACTIVITY_TIMEOUT = 
      Number(import.meta.env.VITE_SESSION_INACTIVITY_TIMEOUT_MS) || DEFAULT_INACTIVITY_TIMEOUT;
    const ACTIVITY_CHECK_INTERVAL = 
      Number(import.meta.env.VITE_SESSION_ACTIVITY_CHECK_INTERVAL_MS) || DEFAULT_ACTIVITY_CHECK_INTERVAL;
      
    let intervalId: NodeJS.Timeout | undefined; // Explicitly type intervalId

    const checkInactivity = () => {
      const lastActiveString = localStorage.getItem('lastActive');
      if (lastActiveString) {
        const lastActive = parseInt(lastActiveString, 10);
        const timeSinceLastActive = Date.now() - lastActive;

        if (timeSinceLastActive > INACTIVITY_TIMEOUT) {
          console.log("Session expired due to inactivity while tab was open. Logging out.");
          logout(false); // No toast
        }
      }
    };

    // Only run the timer if the user is logged in
    if (token) {
      intervalId = setInterval(checkInactivity, ACTIVITY_CHECK_INTERVAL); // Check every 30 seconds
    }

    // Cleanup: clear the interval when the user logs out or the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, logout]); // Reruns if the user logs in/out

  // Event listener for authorization errors from the API service
  useEffect(() => {
    const handleAuthError = () => {
      logout(false); // No toast
      navigate('/login');
    };

    window.addEventListener('authError', handleAuthError);

    return () => {
      window.removeEventListener('authError', handleAuthError);
    };
  }, [logout, navigate]);

  const login = async (username: string, password: string) => { // Explicitly type parameters
    setError(null); // Clear previous error before login
    try {
      const { token, user } = await authService.login(username, password);
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('lastActive', Date.now().toString());
      setError(null); // Clear any previous error
    } catch (err: any) { // Explicitly type catch error
      setError(err.message || 'Authentication failed');
      toaster.showToast(err.message || 'Authentication failed', 'error');
      console.error('Login error:', err);
    }
  };

  if (loading) {
    return <div>Loading session...</div>;
  }

  return (
      <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
