import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { exchangeCodeForToken } from '@/lib/spotify';

// Temporary hook that doesn't use SpotifyContext
export const useSpotify = () => {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    setIsAuthenticated(!!token && !!refreshToken);
    setIsAuthenticating(false);

    // Handle OAuth callback if code is present
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      // If we have a code in the URL, exchange it for tokens
      if (code) {
        try {
          // Get the redirectUri from the state or use the current origin
          const redirectUri = `${window.location.origin}/`;
          
          const tokens = await exchangeCodeForToken(code, redirectUri);
          
          localStorage.setItem('spotify_token', tokens.access_token);
          localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
          
          // Clean up the URL
          window.history.replaceState({}, document.title, '/');
          setLocation('/');
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to exchange code for token', error);
        }
      }
    };

    handleCallback();
  }, [setLocation]);

  return { isAuthenticated, isAuthenticating };
};
