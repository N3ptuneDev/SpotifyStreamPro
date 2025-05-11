import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getSpotifyAuthUrl, 
  exchangeSpotifyCode, 
  refreshSpotifyToken 
} from "./spotify";

// Extend the express Request type to include session
declare module 'express-serve-static-core' {
  interface Request {
    session?: {
      spotifyToken?: string;
      spotifyRefreshToken?: string;
      [key: string]: any;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Spotify authentication routes
  app.get("/api/spotify/auth/url", async (req, res) => {
    try {
      const authUrl = await getSpotifyAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Error getting auth URL:", error);
      res.status(500).json({ message: "Failed to get authorization URL" });
    }
  });

  app.post("/api/spotify/token", async (req, res) => {
    try {
      const { code, redirectUri } = req.body;
      if (!code || !redirectUri) {
        return res.status(400).json({ message: "Code and redirectUri are required" });
      }
      
      const tokenResponse = await exchangeSpotifyCode(code, redirectUri);
      res.json(tokenResponse);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      res.status(500).json({ message: "Failed to exchange code for token" });
    }
  });

  app.post("/api/spotify/refresh", async (req, res) => {
    try {
      // In a real app, get the refresh token from user session
      // For this demo, we'll assume it's in the request body
      const { refreshToken } = req.body;
      
      if (!refreshToken && req.session && req.session.spotifyRefreshToken) {
        const tokenResponse = await refreshSpotifyToken(req.session.spotifyRefreshToken);
        // Update the session with the new access token
        if (req.session) {
          req.session.spotifyToken = tokenResponse.access_token;
        }
        return res.json(tokenResponse);
      }
      
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
      
      const tokenResponse = await refreshSpotifyToken(refreshToken);
      res.json(tokenResponse);
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });
  
  // Handle Spotify callback
  app.get("/api/spotify/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: "Authorization code is required" });
      }
      
      // Exchange code for token
      const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "";
      const tokenResponse = await exchangeSpotifyCode(code, redirectUri);
      
      // In a production app, we'd store tokens in the user's session
      if (req.session) {
        req.session.spotifyToken = tokenResponse.access_token;
        req.session.spotifyRefreshToken = tokenResponse.refresh_token;
      }
      
      // Redirect to the frontend with the token data
      // For simplicity, we'll include them as URL parameters
      // In a real app, you might use a more secure approach
      const params = new URLSearchParams({
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_in: tokenResponse.expires_in.toString(),
      });
      
      res.redirect(`/?${params.toString()}`);
    } catch (error) {
      console.error("Error in Spotify callback:", error);
      res.redirect(`/error?message=Authentication failed`);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
