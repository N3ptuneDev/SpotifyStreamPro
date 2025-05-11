import React, { useState, useEffect } from 'react';
import MainContent from '@/components/MainContent';
import { getAuthUrl } from '@/lib/spotify';
import { Button } from '@/components/ui/button';

const Library: React.FC = () => {
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
    <MainContent title="Your Library">
      {isAuthenticated ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {/* Create Playlist Card */}
            <div className="bg-dark-bg bg-opacity-40 p-4 rounded-lg border-2 border-dashed border-white border-opacity-10 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <i className="ri-add-line text-3xl text-primary"></i>
              </div>
              <h3 className="font-medium text-base">Create Playlist</h3>
              <p className="text-xs text-gray-300 mt-1 text-center">Add a new collection of tracks</p>
            </div>
            
            {/* Placeholder for playlists */}
            <div className="bg-dark-bg bg-opacity-70 p-4 rounded-lg">
              <div className="aspect-square rounded-md bg-gray-700 mb-4"></div>
              <h3 className="font-medium text-base truncate">Your Playlists</h3>
              <p className="text-xs text-gray-300 mt-1">Connect to see your playlists</p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg mb-10 text-center">
          <p className="text-gray-300 mb-4">Connect your Spotify account to see your library</p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={login}
          >
            Connect with Spotify
          </Button>
        </div>
      )}
    </MainContent>
  );
};

export default Library;