import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaylists, getAuthUrl } from '@/lib/spotify';

// Define a playlist type
interface Playlist {
  id: string;
  name: string;
  owner: {
    display_name: string;
  };
}

const Sidebar: React.FC = () => {
  const [location] = useLocation();
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
  
  const { data: playlistsData } = useQuery({
    queryKey: ['/api/spotify/playlists'],
    queryFn: getUserPlaylists,
    enabled: isAuthenticated,
  });

  // Ensure playlists is an array of Playlist objects or an empty array
  const playlists: Playlist[] = playlistsData?.items || [];

  return (
    <div className="hidden md:flex md:w-64 bg-dark-bg bg-opacity-90 flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <i className="ri-music-fill text-xl"></i>
        </div>
        <h1 className="text-2xl font-bold font-montserrat text-white">MusuX</h1>
      </div>
      
      {/* Navigation Menu */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          <li>
            <Link href="/">
              <div className={`flex items-center px-4 py-3 rounded-lg ${location === '/' ? 'bg-white bg-opacity-10 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all'}`}>
                <i className="ri-home-5-fill mr-3 text-xl"></i>
                <span className="font-medium">Home</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/search">
              <div className={`flex items-center px-4 py-3 rounded-lg ${location === '/search' ? 'bg-white bg-opacity-10 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all'}`}>
                <i className="ri-search-line mr-3 text-xl"></i>
                <span className="font-medium">Search</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/library">
              <div className={`flex items-center px-4 py-3 rounded-lg ${location === '/library' ? 'bg-white bg-opacity-10 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all'}`}>
                <i className="ri-album-fill mr-3 text-xl"></i>
                <span className="font-medium">Your Library</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/liked-songs">
              <div className={`flex items-center px-4 py-3 rounded-lg ${location === '/liked-songs' ? 'bg-white bg-opacity-10 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 transition-all'}`}>
                <i className="ri-heart-fill mr-3 text-xl"></i>
                <span className="font-medium">Liked Songs</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Playlists Section */}
      {isAuthenticated && (
        <div className="mt-8 px-6">
          <h2 className="text-gray-400 uppercase text-xs font-semibold tracking-wider">Playlists</h2>
          <ul className="mt-3 space-y-2">
            {playlists.slice(0, 5).map((playlist: Playlist) => (
              <li key={playlist.id}>
                <a href="#" className="block py-2 text-gray-300 hover:text-white transition-colors truncate">
                  {playlist.name}
                </a>
              </li>
            ))}
            {playlists.length === 0 && !isAuthenticated && (
              <li>
                <p className="py-2 text-gray-400 text-sm">Connect to Spotify to see your playlists</p>
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Install App Link / Login Button */}
      <div className="mt-auto px-6 pb-6">
        {isAuthenticated ? (
          <a href="#" className="flex items-center py-2 text-gray-300 hover:text-white transition-colors">
            <i className="ri-download-2-line mr-2"></i>
            <span>Install App</span>
          </a>
        ) : (
          <button 
            onClick={login}
            className="flex items-center py-2 text-gray-300 hover:text-white transition-colors"
          >
            <i className="ri-spotify-fill mr-2"></i>
            <span>Connect to Spotify</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
