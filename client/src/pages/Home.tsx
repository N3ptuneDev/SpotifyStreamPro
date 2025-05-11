import React, { useState, useEffect } from 'react';
import MainContent from '@/components/MainContent';
import GenreCard from '@/components/ui/genre-card';
import { getAuthUrl } from '@/lib/spotify';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
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
  
  // Simplified genres for the demo
  const selectedGenres = ['Pop', 'Electronic', 'Hip Hop', 'Indie'];

  return (
    <MainContent>
      {/* Hero Section */}
      <div className="relative h-60 md:h-72 rounded-xl overflow-hidden mb-8 bg-center bg-cover" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=400&fit=crop')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-accent/70"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">Welcome to MusuX</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-lg">Stream your favorite music with a beautiful interface. Connect your Spotify account to get started.</p>
          
          {!isAuthenticated && (
            <Button 
              className="mt-6 bg-white text-text-dark font-medium px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-all w-max flex items-center"
              onClick={login}
            >
              <i className="ri-spotify-fill mr-2 text-lg"></i>
              Connect with Spotify
            </Button>
          )}
        </div>
      </div>
      
      {/* Recommended Songs Section */}
      <h2 className="text-xl font-semibold font-montserrat mb-4">Recommended for you</h2>
      
      {isAuthenticated ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {/* Loading state would normally be here */}
          <div className="bg-dark-bg bg-opacity-70 p-3 rounded-lg">
            <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-700"></div>
            <h3 className="font-medium text-sm">Connect to see recommendations</h3>
            <p className="text-xs text-gray-300">Your music will appear here</p>
          </div>
        </div>
      ) : (
        <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg mb-10 text-center">
          <p className="text-gray-300 mb-4">Connect your Spotify account to see personalized recommendations</p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={login}
          >
            Connect with Spotify
          </Button>
        </div>
      )}
      
      {/* Music Genres Section */}
      <h2 className="text-xl font-semibold font-montserrat mb-4">Browse by Genre</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <GenreCard name={selectedGenres[0]} color="pink" />
        <GenreCard name={selectedGenres[1]} color="purple" />
        <GenreCard name={selectedGenres[2]} color="amber" />
        <GenreCard name={selectedGenres[3]} color="emerald" />
      </div>
    </MainContent>
  );
};

export default Home;