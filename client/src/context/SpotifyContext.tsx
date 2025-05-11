import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthUrl } from '@/lib/spotify';

interface SpotifyContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('spotify_token');
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      setIsAuthenticated(!!token && !!refreshToken);
      setIsAuthenticating(false);
    };
    
    checkAuth();
  }, []);

  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <SpotifyContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        login,
        logout,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotifyContext = () => {
  const context = useContext(SpotifyContext);
  
  if (context === undefined) {
    throw new Error('useSpotifyContext must be used within a SpotifyProvider');
  }
  
  return context;
};
