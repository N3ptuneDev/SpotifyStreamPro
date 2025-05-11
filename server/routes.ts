import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getSpotifyAuthUrl, 
  exchangeSpotifyCode, 
  refreshSpotifyToken 
} from "./spotify";

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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
