import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainContent from '@/components/MainContent';
import { getAuthUrl, getLikedSongs } from '@/lib/spotify';
import { Button } from '@/components/ui/button';

// Define type for liked songs
interface Track {
  id: string;
  track: {
    id: string;
    name: string;
    duration_ms: number;
    album: {
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
    artists: Array<{ id: string; name: string }>;
    uri: string;
  };
  added_at: string;
}

const LikedSongs: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    setIsAuthenticated(!!token && !!refreshToken);
  }, []);
  
  // Fetch liked songs
  const { data: likedSongsData, isLoading } = useQuery({
    queryKey: ['/api/spotify/liked-songs'],
    queryFn: () => getLikedSongs(50),
    enabled: isAuthenticated,
  });
  
  const tracks: Track[] = likedSongsData?.items || [];
  
  const login = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };
  
  // Format time in MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <MainContent title="Liked Songs">
      {isAuthenticated ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg">
            <div className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <i className="ri-heart-fill text-5xl text-white"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Liked Songs</h2>
              <p className="text-gray-300 mt-1">All of your favorite tracks in one playlist</p>
              {tracks.length > 0 && (
                <p className="text-sm mt-2">{tracks.length} songs</p>
              )}
              <div className="flex gap-3 mt-4">
                <Button className="bg-primary hover:bg-primary/90">Play</Button>
              </div>
            </div>
          </div>
          
          {/* Song List */}
          <div className="overflow-x-auto">
            <table className="w-full mb-10">
              <thead className="border-b border-white border-opacity-10">
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-3 pl-4">#</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3 hidden md:table-cell">Album</th>
                  <th className="pb-3 hidden lg:table-cell">Date Added</th>
                  <th className="pb-3 text-right pr-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      <p>Loading your liked songs...</p>
                    </td>
                  </tr>
                ) : tracks.length > 0 ? (
                  tracks.map((item, index) => (
                    <tr 
                      key={`${item.track.id}-${index}`}
                      className="hover:bg-white hover:bg-opacity-10 group"
                    >
                      <td className="py-2 pl-4">{index + 1}</td>
                      <td className="py-2">
                        <div className="flex items-center">
                          <img 
                            src={item.track.album.images[0]?.url || ''} 
                            alt={item.track.album.name} 
                            className="w-10 h-10 mr-3 rounded"
                          />
                          <div>
                            <div className="font-medium">{item.track.name}</div>
                            <div className="text-sm text-gray-400">
                              {item.track.artists.map(a => a.name).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 hidden md:table-cell text-gray-400">
                        {item.track.album.name}
                      </td>
                      <td className="py-2 hidden lg:table-cell text-gray-400">
                        {formatDate(item.added_at)}
                      </td>
                      <td className="py-2 text-right pr-4 text-gray-400">
                        {formatTime(item.track.duration_ms)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      <p>You haven't liked any songs yet</p>
                      <p className="text-sm mt-2">Your favorite tracks will appear here</p>
                    </td>
                  </tr>
                )}
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