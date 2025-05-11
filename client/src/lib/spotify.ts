import { apiRequest } from "./queryClient";

// Spotify API endpoints
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Local API endpoints
const API_BASE = "/api";
const AUTH_ENDPOINT = `${API_BASE}/spotify/auth`;
const TOKEN_ENDPOINT = `${API_BASE}/spotify/token`;
const REFRESH_TOKEN_ENDPOINT = `${API_BASE}/spotify/refresh`;

// Spotify authentication
export const getAuthUrl = async () => {
  const response = await fetch(`${AUTH_ENDPOINT}/url`);
  const data = await response.json();
  return data.authUrl;
};

export const exchangeCodeForToken = async (code: string, redirectUri: string) => {
  const response = await apiRequest("POST", TOKEN_ENDPOINT, { code, redirectUri });
  return response.json();
};

export const refreshToken = async () => {
  const response = await apiRequest("POST", REFRESH_TOKEN_ENDPOINT, {});
  return response.json();
};

// Spotify API calls with auth token
export const fetchWithToken = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${localStorage.getItem("spotify_token")}`,
  };

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token expiration
  if (response.status === 401) {
    try {
      const refreshed = await refreshToken();
      localStorage.setItem("spotify_token", refreshed.access_token);
      
      // Retry the request with the new token
      return fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshed.access_token}`,
        },
      });
    } catch (error) {
      // If refresh fails, redirect to login
      localStorage.removeItem("spotify_token");
      localStorage.removeItem("spotify_refresh_token");
      window.location.href = await getAuthUrl();
      return new Response(null, { status: 401 });
    }
  }

  return response;
};

// API functions
export const getCurrentUser = async () => {
  const response = await fetchWithToken("/me");
  return response.json();
};

export const getFeaturedPlaylists = async () => {
  const response = await fetchWithToken("/browse/featured-playlists");
  return response.json();
};

export const getRecommendations = async (seedArtists?: string[], seedGenres?: string[], seedTracks?: string[]) => {
  let url = "/recommendations?limit=5";
  
  if (seedArtists && seedArtists.length > 0) {
    url += `&seed_artists=${seedArtists.join(",")}`;
  }
  
  if (seedGenres && seedGenres.length > 0) {
    url += `&seed_genres=${seedGenres.join(",")}`;
  }
  
  if (seedTracks && seedTracks.length > 0) {
    url += `&seed_tracks=${seedTracks.join(",")}`;
  }
  
  const response = await fetchWithToken(url);
  return response.json();
};

export const getRecentlyPlayed = async (limit = 10) => {
  const response = await fetchWithToken(`/me/player/recently-played?limit=${limit}`);
  return response.json();
};

export const searchSpotify = async (query: string, types = ["track", "artist", "album"]) => {
  const response = await fetchWithToken(`/search?q=${encodeURIComponent(query)}&type=${types.join(",")}`);
  return response.json();
};

export const getAlbum = async (albumId: string) => {
  const response = await fetchWithToken(`/albums/${albumId}`);
  return response.json();
};

export const getArtist = async (artistId: string) => {
  const response = await fetchWithToken(`/artists/${artistId}`);
  return response.json();
};

export const getArtistTopTracks = async (artistId: string, market = "US") => {
  const response = await fetchWithToken(`/artists/${artistId}/top-tracks?market=${market}`);
  return response.json();
};

export const getUserPlaylists = async () => {
  const response = await fetchWithToken("/me/playlists");
  return response.json();
};

export const getLikedSongs = async (limit = 50) => {
  const response = await fetchWithToken(`/me/tracks?limit=${limit}`);
  return response.json();
};

export const getPlaylistTracks = async (playlistId: string, limit = 50, offset = 0) => {
  const response = await fetchWithToken(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`);
  return response.json();
};

export const getPlaylist = async (playlistId: string) => {
  const response = await fetchWithToken(`/playlists/${playlistId}`);
  return response.json();
};

export const getAvailableGenreSeeds = async () => {
  const response = await fetchWithToken("/recommendations/available-genre-seeds");
  return response.json();
};

// Playback control
export const playSong = async (trackUri: string, deviceId?: string) => {
  const options: RequestInit = {
    method: "PUT",
    body: JSON.stringify({ uris: [trackUri] }),
  };
  
  if (deviceId) {
    return fetchWithToken(`/me/player/play?device_id=${deviceId}`, options);
  }
  
  return fetchWithToken("/me/player/play", options);
};

export const pausePlayback = async () => {
  return fetchWithToken("/me/player/pause", { method: "PUT" });
};

export const skipToNext = async () => {
  return fetchWithToken("/me/player/next", { method: "POST" });
};

export const skipToPrevious = async () => {
  return fetchWithToken("/me/player/previous", { method: "POST" });
};

export const setVolume = async (volumePercent: number) => {
  return fetchWithToken(`/me/player/volume?volume_percent=${volumePercent}`, { method: "PUT" });
};

export const seekToPosition = async (positionMs: number) => {
  return fetchWithToken(`/me/player/seek?position_ms=${positionMs}`, { method: "PUT" });
};

export const getPlayerState = async () => {
  const response = await fetchWithToken("/me/player");
  if (response.status === 204) {
    return null;
  }
  return response.json();
};
