import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlayerState, pausePlayback, playSong, skipToNext, skipToPrevious, seekToPosition, setVolume } from '@/lib/spotify';

export interface Track {
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

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  play: (track?: Track) => Promise<void>;
  pause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setProgress: (ms: number) => Promise<void>;
  setPlayerVolume: (volume: number) => Promise<void>;
  togglePlayback: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(70);
  const [progress, setProgressState] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  
  // Poll for player state
  useEffect(() => {
    if (!localStorage.getItem('spotify_token')) return;
    
    const pollPlayerState = async () => {
      try {
        const state = await getPlayerState();
        if (state) {
          setCurrentTrack(state.item);
          setIsPlaying(state.is_playing);
          setProgressState(state.progress_ms);
          setDuration(state.item?.duration_ms || 0);
          setVolumeState(state.device?.volume_percent || 70);
        }
      } catch (error) {
        console.error('Failed to get player state', error);
      }
    };
    
    pollPlayerState();
    const interval = setInterval(pollPlayerState, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Progress update interval
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgressState((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          return 0;
        }
        return prev + 1000;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration]);
  
  const play = async (track?: Track) => {
    try {
      if (track) {
        await playSong(track.uri);
        setCurrentTrack(track);
        setDuration(track.duration_ms);
        setProgressState(0);
      } else if (currentTrack) {
        await playSong(currentTrack.uri);
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play track', error);
    }
  };
  
  const pause = async () => {
    try {
      await pausePlayback();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to pause playback', error);
    }
  };
  
  const next = async () => {
    try {
      await skipToNext();
      // Player state will update in the next polling cycle
    } catch (error) {
      console.error('Failed to skip to next track', error);
    }
  };
  
  const previous = async () => {
    try {
      await skipToPrevious();
      // Player state will update in the next polling cycle
    } catch (error) {
      console.error('Failed to skip to previous track', error);
    }
  };
  
  const setProgress = async (ms: number) => {
    try {
      await seekToPosition(ms);
      setProgressState(ms);
    } catch (error) {
      console.error('Failed to seek to position', error);
    }
  };
  
  const setPlayerVolume = async (volumePercent: number) => {
    try {
      await setVolume(volumePercent);
      setVolumeState(volumePercent);
    } catch (error) {
      console.error('Failed to set volume', error);
    }
  };
  
  const togglePlayback = async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };
  
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        play,
        pause,
        next,
        previous,
        setProgress,
        setPlayerVolume,
        togglePlayback,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  
  return context;
};
