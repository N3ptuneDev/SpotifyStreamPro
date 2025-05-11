import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainContent from '@/components/MainContent';
import GenreCard from '@/components/ui/genre-card';
import AlbumCard from '@/components/ui/album-card';
import { getAuthUrl, getRecommendations, getRecentlyPlayed } from '@/lib/spotify';
import { Button } from '@/components/ui/button';
// Comment out for now to debug the context issue
import { usePlayerContext } from '@/context/PlayerContext';

// Define track type to match the format from Spotify API
interface RecommendationTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  uri: string;
}

const Home: React.FC = () => {
  // Temporary state to replace SpotifyContext
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Get player context for music playback
  const playerContext = usePlayerContext();
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    setIsAuthenticated(!!token && !!refreshToken);
  }, []);
  
  // Fetch recommendations when authenticated
  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/spotify/recommendations'],
    queryFn: () => getRecommendations(['4NHQUGzhtTLFvgF5SZesLK'], ['pop', 'electronic'], []),
    enabled: isAuthenticated,
  });
  
  // Fetch recently played tracks
  const { data: recentlyPlayedData, isLoading: recentlyPlayedLoading } = useQuery({
    queryKey: ['/api/spotify/recently-played'],
    queryFn: () => getRecentlyPlayed(5),
    enabled: isAuthenticated,
  });
  
  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };
  
  // Handle track play
  const handlePlay = (track: RecommendationTrack) => {
    console.log('Playing track:', track);
    if (playerContext && track) {
      playerContext.play(track);
    }
  };
  
  // Simplified genres for the demo
  const selectedGenres = ['Pop', 'Electronic', 'Hip Hop', 'Indie'];
  
  // Extract tracks from recommendation data
  const recommendedTracks = recommendationsData?.tracks || [];
  const recentTracks = recentlyPlayedData?.items?.map((item: any) => item.track) || [];

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
          {recommendationsLoading ? (
            // Loading state
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-dark-bg bg-opacity-70 p-3 rounded-lg animate-pulse">
                <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-700"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))
          ) : recommendedTracks.length > 0 ? (
            // Display recommended tracks
            recommendedTracks.map((track: RecommendationTrack) => (
              <div 
                key={track.id}
                className="bg-dark-bg bg-opacity-70 p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all"
                onClick={() => handlePlay(track)}
              >
                <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-700">
                  {track.album.images.length > 0 && (
                    <img 
                      src={track.album.images[0].url} 
                      alt={`${track.name} album art`}
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <h3 className="font-medium text-sm truncate">{track.name}</h3>
                <p className="text-xs text-gray-300 truncate">{track.artists.map(a => a.name).join(', ')}</p>
              </div>
            ))
          ) : (
            // No recommendations available
            <div className="bg-dark-bg bg-opacity-70 p-3 rounded-lg col-span-full">
              <h3 className="font-medium text-center py-4">No recommendations available right now</h3>
            </div>
          )}
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
      
      {/* Recently Played Section */}
      {isAuthenticated && (
        <>
          <h2 className="text-xl font-semibold font-montserrat mb-4">Recently Played</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {recentlyPlayedLoading ? (
              // Loading state
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-dark-bg bg-opacity-70 p-3 rounded-lg animate-pulse">
                  <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-700"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))
            ) : recentTracks.length > 0 ? (
              // Display recently played tracks
              recentTracks.map((track: RecommendationTrack) => (
                <div 
                  key={track.id}
                  className="bg-dark-bg bg-opacity-70 p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all"
                  onClick={() => handlePlay(track)}
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-700">
                    {track.album.images.length > 0 && (
                      <img 
                        src={track.album.images[0].url} 
                        alt={`${track.name} album art`}
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-sm truncate">{track.name}</h3>
                  <p className="text-xs text-gray-300 truncate">{track.artists.map(a => a.name).join(', ')}</p>
                </div>
              ))
            ) : (
              // No recently played tracks
              <div className="bg-dark-bg bg-opacity-70 p-3 rounded-lg col-span-full">
                <h3 className="font-medium text-center py-4">No recently played tracks</h3>
              </div>
            )}
          </div>
        </>
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