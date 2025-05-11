import React from 'react';
import { usePlayerContext, Track } from '@/context/PlayerContext';
import { formatDistanceToNow } from 'date-fns';

interface SongRowProps {
  track: Track;
  index: number;
  addedAt?: string;
}

const SongRow: React.FC<SongRowProps> = ({ track, index, addedAt }) => {
  const { play, currentTrack, isPlaying, pause } = usePlayerContext();
  
  const isCurrentlyPlaying = isPlaying && currentTrack?.id === track.id;
  
  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(track);
    }
  };
  
  // Format duration from ms to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format added date
  const formatAddedDate = (dateString?: string) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <tr 
      className={`hover:bg-white hover:bg-opacity-10 text-sm ${isCurrentlyPlaying ? 'bg-white bg-opacity-5' : ''}`}
      onClick={handlePlay}
    >
      <td className="py-3 pl-4">{index + 1}</td>
      <td>
        <div className="flex items-center">
          <img 
            src={track.album.images[0]?.url || ''} 
            alt={`${track.album.name} album art`} 
            className="w-10 h-10 mr-3 rounded"
          />
          <div>
            <p className={`font-medium ${isCurrentlyPlaying ? 'text-primary' : ''}`}>{track.name}</p>
            <p className="text-gray-400 text-xs">{track.artists.map(artist => artist.name).join(', ')}</p>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell">{track.album.name}</td>
      {addedAt && <td className="hidden lg:table-cell text-gray-400">{formatAddedDate(addedAt)}</td>}
      <td className="text-right pr-4 text-gray-400">{formatDuration(track.duration_ms)}</td>
    </tr>
  );
};

export default SongRow;
