import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService'; // Adjust path if needed
import type { User } from '../types'; // Adjust path if needed

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Wrap logout in useCallback to stabilize its reference for useEffect dependencies
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActive');

    // Optional: Call backend logout to invalidate refresh token if needed
    // authService.logout();
  }, []);

  // This effect runs only once when the app loads to check for a closed session
  useEffect(() => {
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

    const tokenFromStorage = localStorage.getItem('token');
    const lastActiveString = localStorage.getItem('lastActive');

    if (tokenFromStorage && lastActiveString) {
      const lastActive = parseInt(lastActiveString, 10);
      const timeSinceLastActive = Date.now() - lastActive;

      if (timeSinceLastActive > INACTIVITY_TIMEOUT) {
        console.log("Session expired due to inactivity while closed. Forcing logout.");
        logout(); // Use the logout function
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
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    let intervalId;

    const checkInactivity = () => {
      const lastActiveString = localStorage.getItem('lastActive');
      if (lastActiveString) {
        const lastActive = parseInt(lastActiveString, 10);
        const timeSinceLastActive = Date.now() - lastActive;

        if (timeSinceLastActive > INACTIVITY_TIMEOUT) {
          console.log("Session expired due to inactivity while tab was open. Logging out.");
          logout();
        }
      }
    };

    // Only run the timer if the user is logged in
    if (token) {
      intervalId = setInterval(checkInactivity, 30000); // Check every 30 seconds
    }

    // Cleanup: clear the interval when the user logs out or the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, logout]); // Reruns if the user logs in/out

  const login = async (username, password) => {
    const { token, user } = await authService.login(username, password);
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('lastActive', Date.now().toString());
  };

  if (loading) {
    return <div>Loading session...</div>;
  }

  return (
      <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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
