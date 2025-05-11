import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainContent from '@/components/MainContent';
import { getAuthUrl, getUserPlaylists, getPlaylistTracks, getPlaylist } from '@/lib/spotify';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Define types for playlists and tracks
interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
  };
}

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

const Library: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    setIsAuthenticated(!!token && !!refreshToken);
  }, []);
  
  // Fetch user playlists
  const { data: playlistsData } = useQuery({
    queryKey: ['/api/spotify/playlists'],
    queryFn: getUserPlaylists,
    enabled: isAuthenticated,
  });
  
  // Fetch selected playlist details
  const { data: playlistData } = useQuery({
    queryKey: ['/api/spotify/playlist', selectedPlaylistId],
    queryFn: () => getPlaylist(selectedPlaylistId!),
    enabled: isAuthenticated && !!selectedPlaylistId,
  });
  
  // Fetch tracks for the selected playlist
  const { data: tracksData } = useQuery({
    queryKey: ['/api/spotify/playlist/tracks', selectedPlaylistId],
    queryFn: () => getPlaylistTracks(selectedPlaylistId!),
    enabled: isAuthenticated && !!selectedPlaylistId,
  });
  
  const playlists: Playlist[] = playlistsData?.items || [];
  const tracks: Track[] = tracksData?.items || [];
  
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
    <MainContent title={selectedPlaylistId ? playlistData?.name || "Loading..." : "Your Library"}>
      {isAuthenticated ? (
        <>
          {!selectedPlaylistId ? (
            // Show playlists grid when no playlist is selected
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {/* Create Playlist Card */}
              <div className="bg-dark-bg bg-opacity-40 p-4 rounded-lg border-2 border-dashed border-white border-opacity-10 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <i className="ri-add-line text-3xl text-primary"></i>
                </div>
                <h3 className="font-medium text-base">Create Playlist</h3>
                <p className="text-xs text-gray-300 mt-1 text-center">Add a new collection of tracks</p>
              </div>
              
              {/* Render actual playlists */}
              {playlists.map((playlist) => (
                <div 
                  key={playlist.id}
                  className="bg-dark-bg bg-opacity-70 p-4 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all"
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                >
                  <div className="aspect-square rounded-md bg-gray-700 mb-4 overflow-hidden">
                    {playlist.images.length > 0 && (
                      <img 
                        src={playlist.images[0].url} 
                        alt={playlist.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-base truncate">{playlist.name}</h3>
                  <p className="text-xs text-gray-300 mt-1 truncate">
                    By {playlist.owner.display_name} • {playlist.tracks.total} songs
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // Show playlist details and tracks when a playlist is selected
            <div>
              {/* Playlist header */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg">
                <div className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-accent">
                  {playlistData?.images && playlistData.images.length > 0 && (
                    <img 
                      src={playlistData.images[0].url} 
                      alt={playlistData.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{playlistData?.name}</h2>
                  <p className="text-sm text-gray-300 mt-1">{playlistData?.description}</p>
                  <p className="text-sm mt-2">
                    Created by {playlistData?.owner?.display_name} • {playlistData?.tracks?.total} songs
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button className="bg-primary hover:bg-primary/90">Play</Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-500 hover:bg-white hover:bg-opacity-10"
                      onClick={() => setSelectedPlaylistId(null)}
                    >
                      Back to Library
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Tracks list */}
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
                    {tracks.length > 0 ? (
                      tracks.map((item, index) => (
                        <tr 
                          key={`${item.track.id}-${index}`}
                          className="hover:bg-white hover:bg-opacity-10 group cursor-pointer"
                          onClick={() => {
                            if (item.track) {
                              // Convert Spotify track to our Track format
                              const trackToPlay = {
                                id: item.track.id,
                                name: item.track.name,
                                artists: item.track.artists,
                                album: {
                                  id: item.track.album.id || '',
                                  name: item.track.album.name,
                                  images: item.track.album.images
                                },
                                duration_ms: item.track.duration_ms,
                                uri: item.track.uri
                              };
                              // Play the song using the PlayerContext's play method
                              try {
                                const { play } = usePlayerContext();
                                play(trackToPlay);
                              } catch (error) {
                                console.error('Failed to play track', error);
                              }
                            }
                          }}
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
                          <p>Loading tracks...</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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