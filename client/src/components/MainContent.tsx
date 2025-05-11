import React, { useState, useEffect } from 'react';
import SearchBar from './ui/search-bar';
import { getAuthUrl } from '@/lib/spotify';

interface MainContentProps {
  children: React.ReactNode;
  title?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, title }) => {
  // Temporary state to replace SpotifyContext
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    setIsAuthenticated(!!token && !!refreshToken);
  }, []);
  
  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-dark-bg bg-opacity-90 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <i className="ri-menu-line text-2xl"></i>
        </button>
        
        {/* Search Bar */}
        <SearchBar />
        
        {/* User Profile / Login Button */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <i className="ri-user-fill text-sm"></i>
              </div>
            </div>
          ) : (
            <button 
              className="ml-4 px-4 py-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-sm font-medium transition-all"
              onClick={login}
            >
              Login with Spotify
            </button>
          )}
        </div>
      </header>
      
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto h-screen-minus-player bg-opacity-20 bg-dark-bg backdrop-blur-sm">
        {/* Content Section */}
        <section className="px-6 py-8">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </section>
      </main>
    </>
  );
};

export default MainContent;
