import { SpotifyAuth } from "@shared/schema";

// Spotify API credentials - these should come from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

// Use a more generic redirect URI that is more likely to be configured correctly in Spotify
// This should match what you've registered in the Spotify Developer Dashboard
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:5000/callback";

// Spotify API URLs
const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

/**
 * Generate a Spotify authorization URL
 */
export async function getSpotifyAuthUrl(): Promise<string> {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
    "streaming",
  ];

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: scopes.join(" "),
  });

  return `${AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange an authorization code for access and refresh tokens
 */
export async function exchangeSpotifyCode(
  code: string,
  redirectUri: string
): Promise<any> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to exchange code: ${errorData.error}`);
  }

  return response.json();
}

/**
 * Refresh an access token using a refresh token
 */
export async function refreshSpotifyToken(refreshToken: string): Promise<any> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to refresh token: ${errorData.error}`);
  }

  return response.json();
}
