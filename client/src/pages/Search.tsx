import React, { useState, useEffect } from 'react';
import MainContent from '@/components/MainContent';
import GenreCard from '@/components/ui/genre-card';
import { useLocation } from 'wouter';
import { getAuthUrl, searchSpotify, getAvailableGenreSeeds } from '@/lib/spotify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
// import { usePlayerContext } from '@/context/PlayerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Track type for search results
interface Track {
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

// Artist type for search results
interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  genres: string[];
}

// Album type for search results
interface Album {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  images: Array<{ url: string; height: number; width: number }>;
  release_date: string;
  total_tracks: number;
}

const Search: React.FC = () => {
  const [searchParams] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
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
      setLocalSearchQuery(q);
    }
    
    if (genre) {
      setSearchGenre(genre);
    }
  }, [searchParams]);
  
  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/spotify/search', searchQuery],
    queryFn: () => searchSpotify(searchQuery, ['track', 'artist', 'album']),
    enabled: isAuthenticated && !!searchQuery,
  });
  
  // Fetch available genres
  const { data: genresData } = useQuery({
    queryKey: ['/api/spotify/genres'],
    queryFn: getAvailableGenreSeeds,
    enabled: isAuthenticated,
  });
  
  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery.trim());
    }
  };
  
  // Format time in MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Play a track
  const handlePlayTrack = (track: Track) => {
    console.log('Would play track:', track);
    // Temporarily commented out until player context issues are fixed
    // if (playerContext) {
    //   playerContext.play(track);
    // }
  };
  
  // Login function
  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };
  
  // Extract results
  const tracks: Track[] = searchResults?.tracks?.items || [];
  const artists: Artist[] = searchResults?.artists?.items || [];
  const albums: Album[] = searchResults?.albums?.items || [];
  const genres: string[] = genresData?.genres || [];

  return (
    <MainContent title={searchQuery ? `Results for "${searchQuery}"` : searchGenre ? `${searchGenre.charAt(0).toUpperCase() + searchGenre.slice(1)} Music` : 'Search'}>
      {isAuthenticated ? (
        <>
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for songs, artists, or albums"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="bg-card"
              />
              <Button type="submit">Search</Button>
            </div>
          </form>
          
          {!searchQuery && !searchGenre && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-3">Search for your favorite music</h3>
              <p className="text-gray-300 mb-6">Use the search bar above to find songs, artists, and albums</p>
              
              <h4 className="text-lg font-semibold mb-4">Browse genres</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {genres.length > 0 ? (
                  genres.slice(0, 8).map((genre) => (
                    <GenreCard 
                      key={genre} 
                      name={genre} 
                      color={
                        ['pop', 'dance', 'electronic'].includes(genre) ? 'pink' : 
                        ['hip-hop', 'rap', 'r-n-b'].includes(genre) ? 'purple' : 
                        ['rock', 'metal', 'punk'].includes(genre) ? 'amber' : 'emerald'
                      } 
                    />
                  ))
                ) : (
                  ['Pop', 'Hip Hop', 'Rock', 'Electronic'].map((genre) => (
                    <GenreCard 
                      key={genre} 
                      name={genre} 
                      color={
                        genre === 'Pop' ? 'pink' : 
                        genre === 'Hip Hop' ? 'purple' : 
                        genre === 'Rock' ? 'amber' : 'emerald'
                      } 
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {searchQuery && (
            <div>
              {isSearching ? (
                // Loading state
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Tabs defaultValue="tracks" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="tracks">Songs</TabsTrigger>
                    <TabsTrigger value="artists">Artists</TabsTrigger>
                    <TabsTrigger value="albums">Albums</TabsTrigger>
                  </TabsList>
                  
                  {/* Tracks Tab */}
                  <TabsContent value="tracks">
                    {tracks.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full mb-10">
                          <thead className="border-b border-white border-opacity-10">
                            <tr className="text-left text-sm text-gray-400">
                              <th className="pb-3 pl-4">#</th>
                              <th className="pb-3">Title</th>
                              <th className="pb-3 hidden md:table-cell">Album</th>
                              <th className="pb-3 text-right pr-4">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tracks.map((track, index) => (
                              <tr 
                                key={track.id}
                                className="hover:bg-white hover:bg-opacity-10 group cursor-pointer"
                                onClick={() => handlePlayTrack(track)}
                              >
                                <td className="py-2 pl-4">{index + 1}</td>
                                <td className="py-2">
                                  <div className="flex items-center">
                                    <img 
                                      src={track.album.images[0]?.url || ''} 
                                      alt={track.album.name} 
                                      className="w-10 h-10 mr-3 rounded"
                                    />
                                    <div>
                                      <div className="font-medium">{track.name}</div>
                                      <div className="text-sm text-gray-400">
                                        {track.artists.map(a => a.name).join(', ')}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2 hidden md:table-cell text-gray-400">
                                  {track.album.name}
                                </td>
                                <td className="py-2 text-right pr-4 text-gray-400">
                                  {formatTime(track.duration_ms)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-4 text-gray-400">No songs found for "{searchQuery}"</p>
                    )}
                  </TabsContent>
                  
                  {/* Artists Tab */}
                  <TabsContent value="artists">
                    {artists.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                        {artists.map((artist) => (
                          <div key={artist.id} className="bg-dark-bg bg-opacity-70 p-4 rounded-lg text-center">
                            <div className="aspect-square rounded-full overflow-hidden mx-auto mb-3 bg-gray-700 w-40 h-40">
                              {artist.images.length > 0 && (
                                <img 
                                  src={artist.images[0].url} 
                                  alt={artist.name}
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <h3 className="font-medium text-base">{artist.name}</h3>
                            <p className="text-xs text-gray-300 mt-1">{artist.genres.slice(0, 2).join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-gray-400">No artists found for "{searchQuery}"</p>
                    )}
                  </TabsContent>
                  
                  {/* Albums Tab */}
                  <TabsContent value="albums">
                    {albums.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                        {albums.map((album) => (
                          <div key={album.id} className="bg-dark-bg bg-opacity-70 p-3 rounded-lg">
                            <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-700">
                              {album.images.length > 0 && (
                                <img 
                                  src={album.images[0].url} 
                                  alt={album.name}
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <h3 className="font-medium text-sm truncate">{album.name}</h3>
                            <p className="text-xs text-gray-300 truncate">{album.artists.map(a => a.name).join(', ')}</p>
                            <p className="text-xs text-gray-400 mt-1">{album.release_date.split('-')[0]} • {album.total_tracks} tracks</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-gray-400">No albums found for "{searchQuery}"</p>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}
          
          {searchGenre && (
            <div className="bg-dark-bg bg-opacity-70 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{searchGenre.charAt(0).toUpperCase() + searchGenre.slice(1)} Music</h3>
              <p className="text-gray-300 mb-6">Browse top tracks in {searchGenre}</p>
              
              {/* Genre content would go here */}
              <p className="text-center text-gray-400">Coming soon: Genre playlists and recommendations</p>
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