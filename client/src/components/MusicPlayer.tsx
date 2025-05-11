import React from 'react';
import AudioVisualizer from './ui/audio-visualizer';
import ProgressSlider from './ui/progress-slider';
import VolumeSlider from './ui/volume-slider';
// import { usePlayerContext } from '@/context/PlayerContext';

// Simplified MusicPlayer component that doesn't use PlayerContext (temporary)
const MusicPlayer: React.FC = () => {
  // Mock data for now until we fix context issues
  const currentTrack = null;
  const isPlaying = false;
  const volume = 70;
  const progress = 0;
  const duration = 0;
  const togglePlayback = () => console.log('Toggle playback');
  const previous = () => console.log('Previous track');
  const next = () => console.log('Next track');
  const setProgress = () => console.log('Set progress');
  const setPlayerVolume = () => console.log('Set volume');

  // Format time in MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // If no track is playing, show a minimal player
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-dark-bg bg-opacity-95 backdrop-blur-md border-t border-white border-opacity-10 px-4 z-10">
        <div className="h-full max-w-7xl mx-auto flex items-center justify-center">
          <p className="text-gray-400">No track playing</p>
        </div>
      </div>
    );
  }
  
  // Mock track data for development
  const mockTrack = {
    name: "Sample Track",
    album: {
      name: "Sample Album",
      images: [{ url: "", height: 300, width: 300 }]
    },
    artists: [{ id: "1", name: "Sample Artist" }]
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-dark-bg bg-opacity-95 backdrop-blur-md border-t border-white border-opacity-10 px-4 z-10">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Currently Playing Song Info */}
        <div className="flex items-center w-1/3">
          <img 
            src={currentTrack.album.images[0]?.url || ''} 
            alt={`${currentTrack.album.name} album art`} 
            className="h-14 w-14 rounded-md shadow-lg mr-3" 
          />
          <div className="mr-4">
            <h4 className="font-medium text-sm truncate max-w-[120px] md:max-w-xs">{currentTrack.name}</h4>
            <p className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-xs">
              {currentTrack.artists.map((artist: {id: string, name: string}) => artist.name).join(', ')}
            </p>
          </div>
          <div className="flex items-center">
            <button className="text-gray-400 hover:text-white transition-colors">
              <i className="ri-heart-line"></i>
            </button>
          </div>
        </div>
        
        {/* Playback Controls */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="flex items-center space-x-4 mb-2">
            <button className="text-gray-300 hover:text-white transition-colors text-lg">
              <i className="ri-shuffle-line"></i>
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors text-lg"
              onClick={previous}
            >
              <i className="ri-skip-back-fill"></i>
            </button>
            <button 
              className="bg-white text-dark-bg rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-90 transition-colors"
              onClick={togglePlayback}
            >
              <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill text-lg`}></i>
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors text-lg"
              onClick={next}
            >
              <i className="ri-skip-forward-fill"></i>
            </button>
            <button className="text-gray-300 hover:text-white transition-colors text-lg">
              <i className="ri-repeat-line"></i>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full max-w-md">
            <span className="text-xs text-gray-400 mr-2">{formatTime(progress)}</span>
            <ProgressSlider 
              value={progress}
              max={duration}
              onChange={setProgress}
            />
            <span className="text-xs text-gray-400 ml-2">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume & Extra Controls */}
        <div className="flex items-center justify-end w-1/3">
          {/* Audio Visualizer */}
          <div className="mr-4 hidden md:block">
            <AudioVisualizer isPlaying={isPlaying} />
          </div>
          
          <button className="text-gray-300 hover:text-white transition-colors mr-3">
            <i className="ri-play-list-line"></i>
          </button>
          <button className="text-gray-300 hover:text-white transition-colors mr-3">
            <i className="ri-computer-line"></i>
          </button>
          <div className="items-center hidden md:flex">
            <button className="text-gray-300 hover:text-white transition-colors mr-2">
              <i className="ri-volume-up-line"></i>
            </button>
            <VolumeSlider 
              value={volume} 
              onChange={setPlayerVolume} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
