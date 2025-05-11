import { useEffect, useState } from 'react';

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  getCurrentState: () => Promise<any>;
  resume: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (options: any) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    // Load the Spotify Web Playback SDK script if it's not already loaded
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'MusuX Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        setError(`Initialization error: ${message}`);
      });
      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        setError(`Authentication error: ${message}`);
      });
      spotifyPlayer.addListener('account_error', ({ message }) => {
        setError(`Account error: ${message}`);
      });
      spotifyPlayer.addListener('playback_error', ({ message }) => {
        setError(`Playback error: ${message}`);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', state => {
        console.log('Player state changed', state);
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      // Connect to the player
      spotifyPlayer.connect().then(success => {
        if (success) {
          console.log('Spotify Web Playback SDK successfully connected!');
        }
      });

      setPlayer(spotifyPlayer);

      // Cleanup on unmount
      return () => {
        spotifyPlayer.disconnect();
      };
    };
  }, []);

  return { player, deviceId, isReady, error };
};
