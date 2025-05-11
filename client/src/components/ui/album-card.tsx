import React from 'react';
import { usePlayerContext, Track } from '@/context/PlayerContext';

interface AlbumCardProps {
  track: Track;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ track }) => {
  const { play, currentTrack, isPlaying, pause } = usePlayerContext();
  
  const isCurrentlyPlaying = isPlaying && currentTrack?.id === track.id;
  
  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(track);
    }
  };
  
  return (
    <div className="group bg-dark-bg bg-opacity-70 p-3 rounded-lg hover:bg-opacity-100 transition-all cursor-pointer">
      <div className="relative aspect-square rounded-md overflow-hidden mb-3">
        <img 
          src={track.album.images[0]?.url || ''} 
          alt={`${track.album.name} album art`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
          <button 
            className="opacity-0 group-hover:opacity-100 bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all transform translate-y-2 group-hover:translate-y-0"
            onClick={handlePlay}
          >
            <i className={`ri-${isCurrentlyPlaying ? 'pause' : 'play'}-fill text-xl`}></i>
          </button>
        </div>
      </div>
      <h3 className="font-medium text-sm truncate">{track.name}</h3>
      <p className="text-xs text-gray-300 truncate">{track.artists.map(artist => artist.name).join(', ')}</p>
    </div>
  );
};

export default AlbumCard;
