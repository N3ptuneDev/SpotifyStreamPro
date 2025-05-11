import React, { useState, useEffect } from 'react';
import MainContent from '@/components/MainContent';
import GenreCard from '@/components/ui/genre-card';
import { useLocation } from 'wouter';
import { getAuthUrl } from '@/lib/spotify';
import { Button } from '@/components/ui/button';

const Search: React.FC = () => {
  const [searchParams] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  
  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    setIsAuthenticated(!!token && !!refreshToken);
  }, []);
  
  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const q = params.get('q');
    const genre = params.get('genre');
    
    if (q) {
      setSearchQuery(q);
    }
    
    if (genre) {
      setSearchGenre(genre);
    }
  }, [searchParams]);
  
  // Login function
  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };

  return (
    <MainContent title={searchQuery ? `Results for "${searchQuery}"` : searchGenre ? `${searchGenre.charAt(0).toUpperCase() + searchGenre.slice(1)} Music` : 'Search'}>
      {isAuthenticated ? (
        <>
          {!searchQuery && !searchGenre && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-3">Search for your favorite music</h3>
              <p className="text-gray-300 mb-6">Use the search bar above to find songs, artists, and albums</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <GenreCard name="Pop" color="pink" />
                <GenreCard name="Hip Hop" color="purple" />
                <GenreCard name="Rock" color="amber" />
                <GenreCard name="Electronic" color="emerald" />
              </div>
            </div>
          )}
          
          {searchQuery && (
            <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg">
              <p className="text-gray-300 text-center">Connect to Spotify to see search results for "{searchQuery}"</p>
            </div>
          )}
          
          {searchGenre && (
            <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg">
              <p className="text-gray-300 text-center">Connect to Spotify to browse {searchGenre} music</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg mb-10 text-center">
          <p className="text-gray-300 mb-4">Connect your Spotify account to search for music</p>
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

export default Search;