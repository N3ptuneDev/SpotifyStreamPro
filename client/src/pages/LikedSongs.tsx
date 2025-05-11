import React, { useState, useEffect } from 'react';
import MainContent from '@/components/MainContent';
import { getAuthUrl } from '@/lib/spotify';
import { Button } from '@/components/ui/button';

const LikedSongs: React.FC = () => {
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
    <MainContent title="Liked Songs">
      {isAuthenticated ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg">
            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <i className="ri-heart-fill text-5xl text-white"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Liked Songs</h2>
              <p className="text-gray-300">Connect to see your liked songs</p>
            </div>
          </div>
          
          {/* Song List Placeholder */}
          <div className="overflow-x-auto">
            <table className="w-full mb-10">
              <thead className="border-b border-white border-opacity-10">
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-3 pl-4">#</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3 hidden md:table-cell">Album</th>
                  <th className="pb-3 hidden lg:table-cell">Date Added</th>
                  <th className="pb-3 text-right pr-4"><i className="ri-time-line"></i></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    <p>Connect to see your liked songs</p>
                    <p className="text-sm mt-2">Your favorite tracks will appear here</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg mb-10 text-center">
          <p className="text-gray-300 mb-4">Connect your Spotify account to see your liked songs</p>
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

export default LikedSongs;